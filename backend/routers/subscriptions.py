"""
Subscriptions Router
"""
from fastapi import APIRouter

router = APIRouter(prefix="/subscriptions", tags=["Subscriptions"])


@router.get("/plans")
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
