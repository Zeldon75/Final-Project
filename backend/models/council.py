"""
Live Council models
"""
from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime


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
