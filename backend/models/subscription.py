"""
Subscription models
"""
from pydantic import BaseModel
from typing import List


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
