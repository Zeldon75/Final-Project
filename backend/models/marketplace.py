"""
Marketplace models
"""
from pydantic import BaseModel, ConfigDict
from typing import List
from datetime import datetime


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


class MarketplaceItemCreateWithImages(BaseModel):
    title: str
    title_ar: str
    description: str
    description_ar: str
    category: str
    price: float
    currency: str = "KWD"
    images: List[str] = []  # Base64 encoded images or URLs
