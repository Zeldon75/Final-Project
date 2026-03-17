"""
Payment models
"""
from pydantic import BaseModel


class PaymentRequest(BaseModel):
    plan_id: str
    billing_cycle: str = "monthly"  # monthly or yearly
    payment_method: str = "stripe"  # stripe or knet
    origin_url: str


class PaymentStatusRequest(BaseModel):
    session_id: str
