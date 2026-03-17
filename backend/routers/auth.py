"""
Authentication Router
"""
from fastapi import APIRouter, HTTPException, Depends, Response, Request
from datetime import datetime, timezone, timedelta
import uuid
import httpx
import logging

from database import db
from models.user import UserCreate, UserLogin, UserResponse, TokenResponse
from utils.auth_helpers import (
    hash_password, verify_password, create_jwt_token, 
    get_current_user, require_auth
)

router = APIRouter(prefix="/auth", tags=["Authentication"])
logger = logging.getLogger(__name__)


@router.post("/register", response_model=TokenResponse)
async def register(user_data: UserCreate):
    existing = await db.users.find_one({"email": user_data.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = f"user_{uuid.uuid4().hex[:12]}"
    user_doc = {
        "user_id": user_id,
        "email": user_data.email,
        "password_hash": hash_password(user_data.password),
        "name": user_data.name,
        "picture": None,
        "preferred_language": user_data.preferred_language,
        "preferred_interface": user_data.preferred_interface,
        "user_type": "general",
        "subscription_plan": None,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.users.insert_one(user_doc)
    token = create_jwt_token(user_id)
    
    user_response = {k: v for k, v in user_doc.items() if k != "password_hash"}
    user_response["created_at"] = datetime.fromisoformat(user_response["created_at"])
    
    return TokenResponse(access_token=token, user=UserResponse(**user_response))


@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    if not user or not verify_password(credentials.password, user.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    token = create_jwt_token(user["user_id"])
    user_response = {k: v for k, v in user.items() if k != "password_hash"}
    if isinstance(user_response.get("created_at"), str):
        user_response["created_at"] = datetime.fromisoformat(user_response["created_at"])
    
    return TokenResponse(access_token=token, user=UserResponse(**user_response))


@router.post("/session")
async def exchange_session(request: Request, response: Response):
    """Exchange session_id from Emergent OAuth for session_token"""
    body = await request.json()
    session_id = body.get("session_id")
    
    if not session_id:
        raise HTTPException(status_code=400, detail="session_id required")
    
    # Call Emergent Auth API
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.get(
                "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
                headers={"X-Session-ID": session_id}
            )
            if resp.status_code != 200:
                raise HTTPException(status_code=401, detail="Invalid session")
            
            auth_data = resp.json()
        except Exception as e:
            logger.error(f"Auth error: {e}")
            raise HTTPException(status_code=500, detail="Authentication service error")
    
    # Find or create user
    email = auth_data["email"]
    user = await db.users.find_one({"email": email}, {"_id": 0})
    
    if not user:
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        user = {
            "user_id": user_id,
            "email": email,
            "name": auth_data.get("name", ""),
            "picture": auth_data.get("picture"),
            "password_hash": None,
            "preferred_language": "ar",
            "preferred_interface": "heritage",
            "user_type": "general",
            "subscription_plan": None,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.users.insert_one(user)
    else:
        user_id = user["user_id"]
        await db.users.update_one(
            {"user_id": user_id},
            {"$set": {"name": auth_data.get("name", user.get("name")), "picture": auth_data.get("picture")}}
        )
        user = await db.users.find_one({"user_id": user_id}, {"_id": 0})
    
    # Store session
    session_token = auth_data.get("session_token", f"session_{uuid.uuid4().hex}")
    await db.user_sessions.insert_one({
        "user_id": user_id,
        "session_token": session_token,
        "expires_at": (datetime.now(timezone.utc) + timedelta(days=7)).isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    
    # Set cookie
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
        max_age=7 * 24 * 60 * 60
    )
    
    user_response = {k: v for k, v in user.items() if k != "password_hash"}
    if isinstance(user_response.get("created_at"), str):
        user_response["created_at"] = datetime.fromisoformat(user_response["created_at"])
    
    return {"user": UserResponse(**user_response)}


@router.get("/me", response_model=UserResponse)
async def get_me(user: dict = Depends(require_auth)):
    if isinstance(user.get("created_at"), str):
        user["created_at"] = datetime.fromisoformat(user["created_at"])
    return UserResponse(**{k: v for k, v in user.items() if k != "password_hash"})


@router.post("/logout")
async def logout(request: Request, response: Response):
    session_token = request.cookies.get("session_token")
    if session_token:
        await db.user_sessions.delete_one({"session_token": session_token})
    response.delete_cookie("session_token", path="/")
    return {"message": "Logged out successfully"}


@router.put("/preferences")
async def update_preferences(request: Request, user: dict = Depends(require_auth)):
    body = await request.json()
    allowed_fields = ["preferred_language", "preferred_interface", "name"]
    update_data = {k: v for k, v in body.items() if k in allowed_fields}
    
    if update_data:
        await db.users.update_one({"user_id": user["user_id"]}, {"$set": update_data})
    
    updated_user = await db.users.find_one({"user_id": user["user_id"]}, {"_id": 0})
    if isinstance(updated_user.get("created_at"), str):
        updated_user["created_at"] = datetime.fromisoformat(updated_user["created_at"])
    return UserResponse(**{k: v for k, v in updated_user.items() if k != "password_hash"})
