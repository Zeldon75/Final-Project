"""
AI Chat models
"""
from pydantic import BaseModel, ConfigDict
from datetime import datetime


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
