"""
Live Councils Router
"""
from fastapi import APIRouter, HTTPException, Depends, Request
from datetime import datetime, timezone
from typing import Optional
import uuid

from database import db
from models.council import LiveCouncil, LiveCouncilCreate
from utils.auth_helpers import get_current_user, require_auth

router = APIRouter(prefix="/councils", tags=["Live Councils"])


@router.post("", response_model=LiveCouncil)
async def create_council(council: LiveCouncilCreate, user: dict = Depends(require_auth)):
    council_id = f"council_{uuid.uuid4().hex[:12]}"
    stream_key = f"stream_{uuid.uuid4().hex[:16]}"
    
    council_doc = {
        "council_id": council_id,
        "host_id": user["user_id"],
        "host_name": user.get("name", "Anonymous Host"),
        **council.model_dump(),
        "scheduled_time": council.scheduled_time.isoformat(),
        "status": "scheduled",
        "viewers": [],
        "stream_key": stream_key,
        "stream_url": None,
        "chat_messages": [],
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.live_councils.insert_one(council_doc)
    council_doc["scheduled_time"] = council.scheduled_time
    council_doc["created_at"] = datetime.fromisoformat(council_doc["created_at"])
    return LiveCouncil(**council_doc)


@router.get("")
async def get_councils(status: Optional[str] = None, limit: int = 20):
    query = {}
    if status:
        query["status"] = status
    
    councils = await db.live_councils.find(query, {"_id": 0, "stream_key": 0}).sort("scheduled_time", 1).limit(limit).to_list(limit)
    for council in councils:
        if isinstance(council.get("scheduled_time"), str):
            council["scheduled_time"] = datetime.fromisoformat(council["scheduled_time"])
        if isinstance(council.get("created_at"), str):
            council["created_at"] = datetime.fromisoformat(council["created_at"])
    return {"councils": councils}


@router.get("/{council_id}")
async def get_council(council_id: str, user: dict = Depends(get_current_user)):
    council = await db.live_councils.find_one({"council_id": council_id}, {"_id": 0})
    if not council:
        raise HTTPException(status_code=404, detail="Council not found")
    
    # Only show stream_key to the host
    if not user or user.get("user_id") != council.get("host_id"):
        council.pop("stream_key", None)
    
    if isinstance(council.get("scheduled_time"), str):
        council["scheduled_time"] = datetime.fromisoformat(council["scheduled_time"])
    if isinstance(council.get("created_at"), str):
        council["created_at"] = datetime.fromisoformat(council["created_at"])
    return council


@router.post("/{council_id}/join")
async def join_council(council_id: str, user: dict = Depends(require_auth)):
    council = await db.live_councils.find_one({"council_id": council_id}, {"_id": 0})
    if not council:
        raise HTTPException(status_code=404, detail="Council not found")
    
    if len(council.get("viewers", [])) >= council.get("max_viewers", 100):
        raise HTTPException(status_code=400, detail="Council is full")
    
    await db.live_councils.update_one(
        {"council_id": council_id},
        {"$addToSet": {"viewers": user["user_id"]}}
    )
    return {"message": "Joined council successfully", "council_id": council_id}


@router.post("/{council_id}/leave")
async def leave_council(council_id: str, user: dict = Depends(require_auth)):
    await db.live_councils.update_one(
        {"council_id": council_id},
        {"$pull": {"viewers": user["user_id"]}}
    )
    return {"message": "Left council successfully"}


@router.post("/{council_id}/start")
async def start_council(council_id: str, user: dict = Depends(require_auth)):
    """Start a live stream - only the host can do this"""
    council = await db.live_councils.find_one({"council_id": council_id}, {"_id": 0})
    if not council:
        raise HTTPException(status_code=404, detail="Council not found")
    if council["host_id"] != user["user_id"]:
        raise HTTPException(status_code=403, detail="Only the host can start the stream")
    
    await db.live_councils.update_one(
        {"council_id": council_id},
        {"$set": {"status": "live", "started_at": datetime.now(timezone.utc).isoformat()}}
    )
    return {"message": "Council is now live", "stream_key": council.get("stream_key")}


@router.post("/{council_id}/end")
async def end_council(council_id: str, user: dict = Depends(require_auth)):
    """End a live stream"""
    council = await db.live_councils.find_one({"council_id": council_id}, {"_id": 0})
    if not council:
        raise HTTPException(status_code=404, detail="Council not found")
    if council["host_id"] != user["user_id"]:
        raise HTTPException(status_code=403, detail="Only the host can end the stream")
    
    await db.live_councils.update_one(
        {"council_id": council_id},
        {"$set": {"status": "ended", "ended_at": datetime.now(timezone.utc).isoformat()}}
    )
    return {"message": "Council ended"}


@router.post("/{council_id}/chat")
async def send_chat_message(council_id: str, request: Request, user: dict = Depends(require_auth)):
    """Send a chat message in the council"""
    body = await request.json()
    message = body.get("message", "").strip()
    
    if not message:
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    
    chat_msg = {
        "message_id": f"msg_{uuid.uuid4().hex[:8]}",
        "user_id": user["user_id"],
        "user_name": user.get("name", "Anonymous"),
        "message": message[:500],
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    
    await db.live_councils.update_one(
        {"council_id": council_id},
        {"$push": {"chat_messages": {"$each": [chat_msg], "$slice": -100}}}
    )
    return chat_msg


@router.get("/{council_id}/chat")
async def get_chat_messages(council_id: str, since: Optional[str] = None):
    """Get chat messages for a council"""
    council = await db.live_councils.find_one({"council_id": council_id}, {"_id": 0, "chat_messages": 1})
    if not council:
        raise HTTPException(status_code=404, detail="Council not found")
    
    messages = council.get("chat_messages", [])
    if since:
        messages = [m for m in messages if m.get("timestamp", "") > since]
    
    return {"messages": messages[-50:]}
