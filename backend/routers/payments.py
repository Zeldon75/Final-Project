"""
Payments Router
"""
from fastapi import APIRouter, HTTPException, Depends, Request
from datetime import datetime, timezone
import uuid
import logging

from database import db
from config import STRIPE_API_KEY, SUBSCRIPTION_PLANS
from models.payment import PaymentRequest
from utils.auth_helpers import require_auth
from emergentintegrations.payments.stripe.checkout import StripeCheckout, CheckoutSessionRequest

router = APIRouter(prefix="/payments", tags=["Payments"])
logger = logging.getLogger(__name__)


@router.post("/checkout")
async def create_checkout(payment: PaymentRequest, request: Request, user: dict = Depends(require_auth)):
    """Create a checkout session for subscription payment"""
    
    if payment.plan_id not in SUBSCRIPTION_PLANS:
        raise HTTPException(status_code=400, detail="Invalid plan")
    
    if payment.plan_id == "free":
        raise HTTPException(status_code=400, detail="Free plan doesn't require payment")
    
    plan_prices = SUBSCRIPTION_PLANS[payment.plan_id]
    if payment.billing_cycle == "yearly":
        amount = plan_prices["price_yearly"]
    else:
        amount = plan_prices["price_monthly"]
    
    success_url = f"{payment.origin_url}/subscriptions/success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{payment.origin_url}/subscriptions"
    
    if payment.payment_method == "stripe":
        host_url = str(request.base_url).rstrip('/')
        webhook_url = f"{host_url}/api/webhook/stripe"
        stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
        
        checkout_request = CheckoutSessionRequest(
            amount=float(amount),
            currency="usd",
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
        transaction_id = f"knet_{uuid.uuid4().hex[:12]}"
        
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


@router.get("/status/{session_id}")
async def get_payment_status(session_id: str, request: Request, user: dict = Depends(require_auth)):
    """Get payment status and update subscription if paid"""
    
    transaction = await db.payment_transactions.find_one(
        {"session_id": session_id, "user_id": user["user_id"]},
        {"_id": 0}
    )
    
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    if transaction["payment_method"] == "stripe" and transaction["payment_status"] == "pending":
        host_url = str(request.base_url).rstrip('/')
        webhook_url = f"{host_url}/api/webhook/stripe"
        stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
        
        try:
            status = await stripe_checkout.get_checkout_status(session_id)
            
            new_status = "paid" if status.payment_status == "paid" else status.payment_status
            await db.payment_transactions.update_one(
                {"session_id": session_id},
                {"$set": {"payment_status": new_status, "updated_at": datetime.now(timezone.utc).isoformat()}}
            )
            
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


@router.get("/history")
async def get_payment_history(user: dict = Depends(require_auth)):
    """Get user's payment history"""
    transactions = await db.payment_transactions.find(
        {"user_id": user["user_id"]},
        {"_id": 0}
    ).sort("created_at", -1).limit(20).to_list(20)
    
    return {"transactions": transactions}
