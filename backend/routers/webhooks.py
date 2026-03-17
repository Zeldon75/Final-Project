"""
Webhook Router - Handle external service webhooks
"""
from fastapi import APIRouter, Request
from datetime import datetime, timezone
import logging

from database import db
from config import STRIPE_API_KEY
from emergentintegrations.payments.stripe.checkout import StripeCheckout

router = APIRouter(prefix="/webhook", tags=["Webhooks"])
logger = logging.getLogger(__name__)


@router.post("/stripe")
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
            await db.payment_transactions.update_one(
                {"session_id": webhook_response.session_id},
                {"$set": {"payment_status": "paid", "updated_at": datetime.now(timezone.utc).isoformat()}}
            )
            
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
