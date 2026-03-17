"""
AI Chat Router
"""
from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime, timezone
import uuid
import logging

from database import db
from config import EMERGENT_LLM_KEY
from models.ai import AIMessage, AIResponse
from utils.auth_helpers import require_auth
from emergentintegrations.llm.chat import LlmChat, UserMessage

router = APIRouter(prefix="/ai", tags=["AI"])
logger = logging.getLogger(__name__)


@router.post("/chat", response_model=AIResponse)
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


@router.get("/history")
async def get_chat_history(user: dict = Depends(require_auth), limit: int = 50):
    history = await db.chat_history.find(
        {"user_id": user["user_id"]},
        {"_id": 0}
    ).sort("timestamp", -1).limit(limit).to_list(limit)
    return {"history": history}
