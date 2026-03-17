from fastapi import FastAPI, APIRouter, HTTPException, Depends, Response, Request, Cookie
from fastapi.security import HTTPBearer
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
import httpx
from emergentintegrations.llm.chat import LlmChat, UserMessage
from emergentintegrations.payments.stripe.checkout import StripeCheckout, CheckoutSessionResponse, CheckoutStatusResponse, CheckoutSessionRequest

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Settings
JWT_SECRET = os.environ.get('JWT_SECRET', 'darwaza-secret-key-2025')
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_DAYS = 7

# Emergent LLM Key
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY', '')

# Stripe Key
STRIPE_API_KEY = os.environ.get('STRIPE_API_KEY', '')

# Subscription Plans - Fixed prices defined on backend only
SUBSCRIPTION_PLANS = {
    "free": {"price_monthly": 0.0, "price_yearly": 0.0},
    "family": {"price_monthly": 10.0, "price_yearly": 99.0},
    "heritage": {"price_monthly": 25.0, "price_yearly": 250.0},
    "premium": {"price_monthly": 55.0, "price_yearly": 550.0}
}

app = FastAPI(title="Darwaza API", version="1.0.0")
api_router = APIRouter(prefix="/api")
security = HTTPBearer(auto_error=False)

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ==================== MODELS ====================

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    preferred_language: str = "ar"
    preferred_interface: str = "heritage"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    email: str
    name: str
    picture: Optional[str] = None
    preferred_language: str = "ar"
    preferred_interface: str = "heritage"
    user_type: str = "general"
    subscription_plan: Optional[str] = None
    created_at: datetime

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class AIMessage(BaseModel):
    content: str
    model: str = "gpt-5.2"  # gpt-5.2, gemini-3-flash-preview, claude-sonnet-4-5-20250929

class AIResponse(BaseModel):
    response: str
    model: str
    session_id: str

class ChatHistory(BaseModel):
    model_config = ConfigDict(extra="ignore")
    message_id: str
    session_id: str
    user_id: str
    role: str
    content: str
    model: str
    timestamp: datetime

class MarketplaceItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    item_id: str
    seller_id: str
    title: str
    title_ar: str
    description: str
    description_ar: str
    category: str
    price: float
    currency: str = "KWD"
    images: List[str] = []
    is_authenticated: bool = False
    status: str = "active"
    created_at: datetime

class MarketplaceItemCreate(BaseModel):
    title: str
    title_ar: str
    description: str
    description_ar: str
    category: str
    price: float
    currency: str = "KWD"
    images: List[str] = []

class LiveCouncil(BaseModel):
    model_config = ConfigDict(extra="ignore")
    council_id: str
    host_id: str
    title: str
    title_ar: str
    description: str
    description_ar: str
    scheduled_time: datetime
    duration_minutes: int = 60
    status: str = "scheduled"
    viewers: List[str] = []
    max_viewers: int = 100
    stream_url: Optional[str] = None
    created_at: datetime

class LiveCouncilCreate(BaseModel):
    title: str
    title_ar: str
    description: str
    description_ar: str
    scheduled_time: datetime
    duration_minutes: int = 60
    max_viewers: int = 100

class SubscriptionPlan(BaseModel):
    plan_id: str
    name: str
    name_ar: str
    description: str
    description_ar: str
    price_monthly: float
    price_yearly: float
    currency: str = "KWD"
    features: List[str]
    features_ar: List[str]

# ==================== AUTH HELPERS ====================

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())

def create_jwt_token(user_id: str) -> str:
    payload = {
        "user_id": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(days=JWT_EXPIRATION_DAYS),
        "iat": datetime.now(timezone.utc)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(request: Request, credentials = Depends(security)) -> Optional[dict]:
    token = None
    
    # Check cookie first
    session_token = request.cookies.get("session_token")
    if session_token:
        # Validate session from DB
        session = await db.user_sessions.find_one({"session_token": session_token}, {"_id": 0})
        if session:
            expires_at = session.get("expires_at")
            if isinstance(expires_at, str):
                expires_at = datetime.fromisoformat(expires_at)
            if expires_at.tzinfo is None:
                expires_at = expires_at.replace(tzinfo=timezone.utc)
            if expires_at > datetime.now(timezone.utc):
                user = await db.users.find_one({"user_id": session["user_id"]}, {"_id": 0})
                if user:
                    return user
    
    # Fall back to Authorization header (JWT)
    if credentials:
        token = credentials.credentials
    
    if not token:
        return None
    
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user = await db.users.find_one({"user_id": payload["user_id"]}, {"_id": 0})
        return user
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

async def require_auth(user: dict = Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")
    return user

# ==================== AUTH ENDPOINTS ====================

@api_router.post("/auth/register", response_model=TokenResponse)
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

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    if not user or not verify_password(credentials.password, user.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    token = create_jwt_token(user["user_id"])
    user_response = {k: v for k, v in user.items() if k != "password_hash"}
    if isinstance(user_response.get("created_at"), str):
        user_response["created_at"] = datetime.fromisoformat(user_response["created_at"])
    
    return TokenResponse(access_token=token, user=UserResponse(**user_response))

@api_router.post("/auth/session")
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
        # Update user info
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

@api_router.get("/auth/me", response_model=UserResponse)
async def get_me(user: dict = Depends(require_auth)):
    if isinstance(user.get("created_at"), str):
        user["created_at"] = datetime.fromisoformat(user["created_at"])
    return UserResponse(**{k: v for k, v in user.items() if k != "password_hash"})

@api_router.post("/auth/logout")
async def logout(request: Request, response: Response):
    session_token = request.cookies.get("session_token")
    if session_token:
        await db.user_sessions.delete_one({"session_token": session_token})
    response.delete_cookie("session_token", path="/")
    return {"message": "Logged out successfully"}

@api_router.put("/auth/preferences")
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

# ==================== AI ENDPOINTS ====================

@api_router.post("/ai/chat", response_model=AIResponse)
async def ai_chat(message: AIMessage, user: dict = Depends(require_auth)):
    session_id = f"chat_{user['user_id']}_{uuid.uuid4().hex[:8]}"
    
    model_mapping = {
        "gpt-5.2": ("openai", "gpt-5.2"),
        "gemini": ("gemini", "gemini-3-flash-preview"),
        "claude": ("anthropic", "claude-sonnet-4-5-20250929")
    }
    
    provider, model_name = model_mapping.get(message.model, ("openai", "gpt-5.2"))
    
    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=session_id,
            system_message="You are a helpful AI assistant for Darwaza, a Kuwaiti cultural heritage platform. You can speak Arabic, English, and other languages. Help users learn about Kuwaiti culture, traditions, and heritage."
        ).with_model(provider, model_name)
        
        user_message = UserMessage(text=message.content)
        response = await chat.send_message(user_message)
        
        # Save to chat history
        await db.chat_history.insert_one({
            "message_id": f"msg_{uuid.uuid4().hex[:12]}",
            "session_id": session_id,
            "user_id": user["user_id"],
            "role": "user",
            "content": message.content,
            "model": message.model,
            "timestamp": datetime.now(timezone.utc).isoformat()
        })
        await db.chat_history.insert_one({
            "message_id": f"msg_{uuid.uuid4().hex[:12]}",
            "session_id": session_id,
            "user_id": user["user_id"],
            "role": "assistant",
            "content": response,
            "model": message.model,
            "timestamp": datetime.now(timezone.utc).isoformat()
        })
        
        return AIResponse(response=response, model=message.model, session_id=session_id)
    except Exception as e:
        logger.error(f"AI Error: {e}")
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")

@api_router.get("/ai/history")
async def get_chat_history(user: dict = Depends(require_auth), limit: int = 50):
    history = await db.chat_history.find(
        {"user_id": user["user_id"]},
        {"_id": 0}
    ).sort("timestamp", -1).limit(limit).to_list(limit)
    return {"history": history}

# ==================== MARKETPLACE ENDPOINTS ====================

@api_router.post("/marketplace/items", response_model=MarketplaceItem)
async def create_item(item: MarketplaceItemCreate, user: dict = Depends(require_auth)):
    item_id = f"item_{uuid.uuid4().hex[:12]}"
    item_doc = {
        "item_id": item_id,
        "seller_id": user["user_id"],
        **item.model_dump(),
        "is_authenticated": False,
        "status": "active",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.marketplace_items.insert_one(item_doc)
    item_doc["created_at"] = datetime.fromisoformat(item_doc["created_at"])
    return MarketplaceItem(**item_doc)

@api_router.get("/marketplace/items")
async def get_items(category: Optional[str] = None, limit: int = 20, skip: int = 0):
    query = {"status": "active"}
    if category:
        query["category"] = category
    
    items = await db.marketplace_items.find(query, {"_id": 0}).skip(skip).limit(limit).to_list(limit)
    for item in items:
        if isinstance(item.get("created_at"), str):
            item["created_at"] = datetime.fromisoformat(item["created_at"])
    return {"items": items, "total": await db.marketplace_items.count_documents(query)}

@api_router.get("/marketplace/items/{item_id}", response_model=MarketplaceItem)
async def get_item(item_id: str):
    item = await db.marketplace_items.find_one({"item_id": item_id}, {"_id": 0})
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    if isinstance(item.get("created_at"), str):
        item["created_at"] = datetime.fromisoformat(item["created_at"])
    return MarketplaceItem(**item)

# ==================== LIVE COUNCILS ENDPOINTS ====================

@api_router.post("/councils", response_model=LiveCouncil)
async def create_council(council: LiveCouncilCreate, user: dict = Depends(require_auth)):
    council_id = f"council_{uuid.uuid4().hex[:12]}"
    council_doc = {
        "council_id": council_id,
        "host_id": user["user_id"],
        **council.model_dump(),
        "scheduled_time": council.scheduled_time.isoformat(),
        "status": "scheduled",
        "viewers": [],
        "stream_url": None,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.live_councils.insert_one(council_doc)
    council_doc["scheduled_time"] = council.scheduled_time
    council_doc["created_at"] = datetime.fromisoformat(council_doc["created_at"])
    return LiveCouncil(**council_doc)

@api_router.get("/councils")
async def get_councils(status: Optional[str] = None, limit: int = 20):
    query = {}
    if status:
        query["status"] = status
    
    councils = await db.live_councils.find(query, {"_id": 0}).sort("scheduled_time", 1).limit(limit).to_list(limit)
    for council in councils:
        if isinstance(council.get("scheduled_time"), str):
            council["scheduled_time"] = datetime.fromisoformat(council["scheduled_time"])
        if isinstance(council.get("created_at"), str):
            council["created_at"] = datetime.fromisoformat(council["created_at"])
    return {"councils": councils}

@api_router.get("/councils/{council_id}", response_model=LiveCouncil)
async def get_council(council_id: str):
    council = await db.live_councils.find_one({"council_id": council_id}, {"_id": 0})
    if not council:
        raise HTTPException(status_code=404, detail="Council not found")
    if isinstance(council.get("scheduled_time"), str):
        council["scheduled_time"] = datetime.fromisoformat(council["scheduled_time"])
    if isinstance(council.get("created_at"), str):
        council["created_at"] = datetime.fromisoformat(council["created_at"])
    return LiveCouncil(**council)

@api_router.post("/councils/{council_id}/join")
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
    return {"message": "Joined council successfully"}

# ==================== SUBSCRIPTIONS ====================

@api_router.get("/subscriptions/plans")
async def get_subscription_plans():
    plans = [
        {
            "plan_id": "free",
            "name": "Free",
            "name_ar": "مجاني",
            "description": "Basic access to Darwaza",
            "description_ar": "الوصول الأساسي إلى دروازة",
            "price_monthly": 0.0,
            "price_yearly": 0.0,
            "currency": "KWD",
            "features": ["Browse marketplace", "View live councils", "Basic AI chat (limited)"],
            "features_ar": ["تصفح السوق", "مشاهدة المجالس الحية", "محادثة الذكاء الاصطناعي (محدودة)"]
        },
        {
            "plan_id": "family",
            "name": "Family",
            "name_ar": "العائلة",
            "description": "Perfect for families exploring heritage together",
            "description_ar": "مثالي للعائلات لاستكشاف التراث معًا",
            "price_monthly": 10.0,
            "price_yearly": 99.0,
            "currency": "KWD",
            "features": ["Everything in Free", "Unlimited AI chat", "Kids Heritage Box", "Live workshops access"],
            "features_ar": ["كل ما في المجاني", "محادثة AI غير محدودة", "صندوق التراث للأطفال", "الوصول لورش العمل الحية"]
        },
        {
            "plan_id": "heritage",
            "name": "Heritage Plus",
            "name_ar": "التراث المميز",
            "description": "Full heritage experience with AR and courses",
            "description_ar": "تجربة التراث الكاملة مع الواقع المعزز والدورات",
            "price_monthly": 25.0,
            "price_yearly": 250.0,
            "currency": "KWD",
            "features": ["Everything in Family", "AR experiences", "Certified courses", "Priority support"],
            "features_ar": ["كل ما في العائلة", "تجارب الواقع المعزز", "دورات معتمدة", "دعم أولوية"]
        },
        {
            "plan_id": "premium",
            "name": "Premium",
            "name_ar": "بريميوم",
            "description": "Full access to all Darwaza features",
            "description_ar": "الوصول الكامل لجميع ميزات دروازة",
            "price_monthly": 55.0,
            "price_yearly": 550.0,
            "currency": "KWD",
            "features": ["Everything in Heritage", "Host live councils", "VIP events access", "Exclusive discounts", "Personal heritage consultant"],
            "features_ar": ["كل ما في التراث", "استضافة المجالس الحية", "الوصول لفعاليات VIP", "خصومات حصرية", "مستشار تراثي شخصي"]
        }
    ]
    return {"plans": plans}

# ==================== PAYMENT ENDPOINTS (STRIPE + K-NET) ====================

class PaymentRequest(BaseModel):
    plan_id: str
    billing_cycle: str = "monthly"  # monthly or yearly
    payment_method: str = "stripe"  # stripe or knet
    origin_url: str

class PaymentStatusRequest(BaseModel):
    session_id: str

@api_router.post("/payments/checkout")
async def create_checkout(payment: PaymentRequest, request: Request, user: dict = Depends(require_auth)):
    """Create a checkout session for subscription payment"""
    
    # Validate plan exists
    if payment.plan_id not in SUBSCRIPTION_PLANS:
        raise HTTPException(status_code=400, detail="Invalid plan")
    
    if payment.plan_id == "free":
        raise HTTPException(status_code=400, detail="Free plan doesn't require payment")
    
    # Get amount from server-side definition only (SECURITY)
    plan_prices = SUBSCRIPTION_PLANS[payment.plan_id]
    if payment.billing_cycle == "yearly":
        amount = plan_prices["price_yearly"]
    else:
        amount = plan_prices["price_monthly"]
    
    # Build URLs from provided origin
    success_url = f"{payment.origin_url}/subscriptions/success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{payment.origin_url}/subscriptions"
    
    if payment.payment_method == "stripe":
        # Initialize Stripe checkout
        host_url = str(request.base_url).rstrip('/')
        webhook_url = f"{host_url}/api/webhook/stripe"
        stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
        
        # Create checkout session
        checkout_request = CheckoutSessionRequest(
            amount=float(amount),
            currency="usd",  # Stripe uses USD, convert KWD display
            success_url=success_url,
            cancel_url=cancel_url,
            metadata={
                "user_id": user["user_id"],
                "plan_id": payment.plan_id,
                "billing_cycle": payment.billing_cycle,
                "original_currency": "KWD",
                "original_amount": str(amount)
            }
        )
        
        session = await stripe_checkout.create_checkout_session(checkout_request)
        
        # Create payment transaction record
        await db.payment_transactions.insert_one({
            "transaction_id": f"txn_{uuid.uuid4().hex[:12]}",
            "session_id": session.session_id,
            "user_id": user["user_id"],
            "plan_id": payment.plan_id,
            "billing_cycle": payment.billing_cycle,
            "amount": amount,
            "currency": "KWD",
            "payment_method": "stripe",
            "payment_status": "pending",
            "created_at": datetime.now(timezone.utc).isoformat()
        })
        
        return {"checkout_url": session.url, "session_id": session.session_id, "payment_method": "stripe"}
    
    elif payment.payment_method == "knet":
        # K-NET requires merchant account setup
        # For now, return info about K-NET integration
        transaction_id = f"knet_{uuid.uuid4().hex[:12]}"
        
        # Create pending transaction
        await db.payment_transactions.insert_one({
            "transaction_id": transaction_id,
            "session_id": transaction_id,
            "user_id": user["user_id"],
            "plan_id": payment.plan_id,
            "billing_cycle": payment.billing_cycle,
            "amount": amount,
            "currency": "KWD",
            "payment_method": "knet",
            "payment_status": "pending",
            "created_at": datetime.now(timezone.utc).isoformat()
        })
        
        return {
            "checkout_url": None,
            "session_id": transaction_id,
            "payment_method": "knet",
            "message": "K-NET integration requires merchant account setup with a Kuwaiti bank. Please contact support.",
            "message_ar": "تكامل كي-نت يتطلب إعداد حساب تاجر مع بنك كويتي. يرجى التواصل مع الدعم."
        }
    else:
        raise HTTPException(status_code=400, detail="Invalid payment method")

@api_router.get("/payments/status/{session_id}")
async def get_payment_status(session_id: str, request: Request, user: dict = Depends(require_auth)):
    """Get payment status and update subscription if paid"""
    
    # Find transaction
    transaction = await db.payment_transactions.find_one(
        {"session_id": session_id, "user_id": user["user_id"]},
        {"_id": 0}
    )
    
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    if transaction["payment_method"] == "stripe" and transaction["payment_status"] == "pending":
        # Check with Stripe
        host_url = str(request.base_url).rstrip('/')
        webhook_url = f"{host_url}/api/webhook/stripe"
        stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
        
        try:
            status = await stripe_checkout.get_checkout_status(session_id)
            
            # Update transaction status
            new_status = "paid" if status.payment_status == "paid" else status.payment_status
            await db.payment_transactions.update_one(
                {"session_id": session_id},
                {"$set": {"payment_status": new_status, "updated_at": datetime.now(timezone.utc).isoformat()}}
            )
            
            # If paid, update user subscription
            if new_status == "paid":
                await db.users.update_one(
                    {"user_id": user["user_id"]},
                    {"$set": {
                        "subscription_plan": transaction["plan_id"],
                        "subscription_billing_cycle": transaction["billing_cycle"],
                        "subscription_started_at": datetime.now(timezone.utc).isoformat()
                    }}
                )
            
            return {
                "session_id": session_id,
                "payment_status": new_status,
                "plan_id": transaction["plan_id"],
                "amount": transaction["amount"],
                "currency": transaction["currency"]
            }
        except Exception as e:
            logger.error(f"Stripe status check error: {e}")
            return {
                "session_id": session_id,
                "payment_status": transaction["payment_status"],
                "plan_id": transaction["plan_id"]
            }
    
    return {
        "session_id": session_id,
        "payment_status": transaction["payment_status"],
        "plan_id": transaction["plan_id"],
        "amount": transaction["amount"],
        "currency": transaction["currency"]
    }

@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    """Handle Stripe webhook events"""
    body = await request.body()
    signature = request.headers.get("Stripe-Signature")
    
    host_url = str(request.base_url).rstrip('/')
    webhook_url = f"{host_url}/api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
    
    try:
        webhook_response = await stripe_checkout.handle_webhook(body, signature)
        
        if webhook_response.payment_status == "paid":
            # Update transaction and user subscription
            await db.payment_transactions.update_one(
                {"session_id": webhook_response.session_id},
                {"$set": {"payment_status": "paid", "updated_at": datetime.now(timezone.utc).isoformat()}}
            )
            
            # Get transaction to find user
            transaction = await db.payment_transactions.find_one(
                {"session_id": webhook_response.session_id},
                {"_id": 0}
            )
            
            if transaction:
                await db.users.update_one(
                    {"user_id": transaction["user_id"]},
                    {"$set": {
                        "subscription_plan": transaction["plan_id"],
                        "subscription_billing_cycle": transaction["billing_cycle"],
                        "subscription_started_at": datetime.now(timezone.utc).isoformat()
                    }}
                )
        
        return {"status": "received"}
    except Exception as e:
        logger.error(f"Webhook error: {e}")
        return {"status": "error", "message": str(e)}

@api_router.get("/payments/history")
async def get_payment_history(user: dict = Depends(require_auth)):
    """Get user's payment history"""
    transactions = await db.payment_transactions.find(
        {"user_id": user["user_id"]},
        {"_id": 0}
    ).sort("created_at", -1).limit(20).to_list(20)
    
    return {"transactions": transactions}

# ==================== CONTENT ENDPOINTS ====================

@api_router.get("/content/categories")
async def get_categories():
    categories = [
        {"id": "antiques", "name": "Antiques", "name_ar": "التحف", "icon": "gem"},
        {"id": "crafts", "name": "Traditional Crafts", "name_ar": "الحرف التقليدية", "icon": "palette"},
        {"id": "clothing", "name": "Traditional Clothing", "name_ar": "الملابس التقليدية", "icon": "shirt"},
        {"id": "jewelry", "name": "Jewelry", "name_ar": "المجوهرات", "icon": "crown"},
        {"id": "art", "name": "Art & Calligraphy", "name_ar": "الفن والخط", "icon": "pen-tool"},
        {"id": "books", "name": "Books & Manuscripts", "name_ar": "الكتب والمخطوطات", "icon": "book-open"}
    ]
    return {"categories": categories}

@api_router.get("/content/arab-countries")
async def get_arab_countries():
    countries = [
        {"code": "KW", "name": "Kuwait", "name_ar": "الكويت"},
        {"code": "SA", "name": "Saudi Arabia", "name_ar": "السعودية"},
        {"code": "AE", "name": "UAE", "name_ar": "الإمارات"},
        {"code": "QA", "name": "Qatar", "name_ar": "قطر"},
        {"code": "BH", "name": "Bahrain", "name_ar": "البحرين"},
        {"code": "OM", "name": "Oman", "name_ar": "عمان"},
        {"code": "EG", "name": "Egypt", "name_ar": "مصر"},
        {"code": "JO", "name": "Jordan", "name_ar": "الأردن"},
        {"code": "LB", "name": "Lebanon", "name_ar": "لبنان"},
        {"code": "SY", "name": "Syria", "name_ar": "سوريا"},
        {"code": "IQ", "name": "Iraq", "name_ar": "العراق"},
        {"code": "MA", "name": "Morocco", "name_ar": "المغرب"},
        {"code": "TN", "name": "Tunisia", "name_ar": "تونس"},
        {"code": "DZ", "name": "Algeria", "name_ar": "الجزائر"},
        {"code": "LY", "name": "Libya", "name_ar": "ليبيا"},
        {"code": "SD", "name": "Sudan", "name_ar": "السودان"},
        {"code": "YE", "name": "Yemen", "name_ar": "اليمن"},
        {"code": "PS", "name": "Palestine", "name_ar": "فلسطين"}
    ]
    return {"countries": countries}

# ==================== HEALTH CHECK ====================

@api_router.get("/")
async def root():
    return {"message": "Welcome to Darwaza API", "version": "1.0.0"}

@api_router.get("/health")
async def health():
    return {"status": "healthy", "timestamp": datetime.now(timezone.utc).isoformat()}

# Include router and middleware
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
