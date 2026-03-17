"""
Marketplace Router
"""
from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime, timezone
from typing import Optional
import uuid

from database import db
from models.marketplace import MarketplaceItem, MarketplaceItemCreateWithImages
from utils.auth_helpers import require_auth

router = APIRouter(prefix="/marketplace", tags=["Marketplace"])


def get_sample_antique_items():
    """Return sample antique items for display"""
    return [
        {
            "item_id": "sample_1",
            "seller_id": "seller_001",
            "seller_name": "أبو فهد",
            "title": "Antique Kuwaiti Coffee Pot (Dallah)",
            "title_ar": "دلة قهوة كويتية أصيلة",
            "description": "Beautiful handcrafted brass coffee pot from the 1950s. Used in traditional diwaniyas. Excellent condition with intricate engravings.",
            "description_ar": "دلة نحاسية جميلة مصنوعة يدوياً من الخمسينات. استُخدمت في الديوانيات التقليدية. حالة ممتازة مع نقوش دقيقة.",
            "category": "antiques",
            "price": 150.0,
            "currency": "KWD",
            "images": ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop"],
            "is_authenticated": True,
            "status": "active",
            "views": 234,
            "created_at": datetime.now(timezone.utc)
        },
        {
            "item_id": "sample_2",
            "seller_id": "seller_002",
            "seller_name": "أم خالد",
            "title": "Traditional Sadu Weaving",
            "title_ar": "نسيج سدو تقليدي",
            "description": "Authentic hand-woven Sadu textile from Bedouin heritage. Perfect for decoration or collection. Size: 2m x 1m.",
            "description_ar": "نسيج سدو أصيل منسوج يدوياً من التراث البدوي. مثالي للديكور أو الجمع. المقاس: 2م × 1م.",
            "category": "crafts",
            "price": 85.0,
            "currency": "KWD",
            "images": ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop"],
            "is_authenticated": True,
            "status": "active",
            "views": 156,
            "created_at": datetime.now(timezone.utc)
        },
        {
            "item_id": "sample_3",
            "seller_id": "seller_003",
            "seller_name": "محمد العنزي",
            "title": "Vintage Pearl Diving Chest",
            "title_ar": "صندوق غوص اللؤلؤ القديم",
            "description": "Rare wooden chest used by pearl divers in the early 1900s. Contains original brass fittings and lock. Museum quality piece.",
            "description_ar": "صندوق خشبي نادر استخدمه غواصو اللؤلؤ في أوائل القرن العشرين. يحتوي على تجهيزات نحاسية وقفل أصلي. قطعة بجودة المتاحف.",
            "category": "antiques",
            "price": 450.0,
            "currency": "KWD",
            "images": ["https://images.unsplash.com/photo-1524634126442-357e0eac3c14?w=400&h=400&fit=crop"],
            "is_authenticated": True,
            "status": "active",
            "views": 312,
            "created_at": datetime.now(timezone.utc)
        },
        {
            "item_id": "sample_4",
            "seller_id": "seller_004",
            "seller_name": "فاطمة السالم",
            "title": "Antique Gold Jewelry Set",
            "title_ar": "طقم مجوهرات ذهبية أثرية",
            "description": "Traditional Kuwaiti gold jewelry set including necklace, earrings, and bracelet. 21K gold from the 1960s.",
            "description_ar": "طقم مجوهرات ذهبية كويتية تقليدية يشمل قلادة وأقراط وسوار. ذهب عيار 21 من الستينات.",
            "category": "jewelry",
            "price": 1200.0,
            "currency": "KWD",
            "images": ["https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop"],
            "is_authenticated": True,
            "status": "active",
            "views": 567,
            "created_at": datetime.now(timezone.utc)
        },
        {
            "item_id": "sample_5",
            "seller_id": "seller_005",
            "seller_name": "عبدالله الرشيد",
            "title": "Vintage Bisht (Traditional Cloak)",
            "title_ar": "بشت تراثي قديم",
            "description": "Hand-embroidered bisht with gold threading. Worn by dignitaries in the 1970s. Excellent preservation.",
            "description_ar": "بشت مطرز يدوياً بخيوط الذهب. ارتداه كبار الشخصيات في السبعينات. محفوظ بشكل ممتاز.",
            "category": "clothing",
            "price": 320.0,
            "currency": "KWD",
            "images": ["https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=400&fit=crop"],
            "is_authenticated": False,
            "status": "active",
            "views": 198,
            "created_at": datetime.now(timezone.utc)
        },
        {
            "item_id": "sample_6",
            "seller_id": "seller_006",
            "seller_name": "نورة الصباح",
            "title": "Ancient Quran Manuscript",
            "title_ar": "مخطوطة قرآنية قديمة",
            "description": "Rare handwritten Quran pages from the 18th century. Beautiful calligraphy with gold leaf decorations.",
            "description_ar": "صفحات قرآنية نادرة مكتوبة بخط اليد من القرن الثامن عشر. خط جميل مع زخارف بأوراق الذهب.",
            "category": "books",
            "price": 2500.0,
            "currency": "KWD",
            "images": ["https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=400&h=400&fit=crop"],
            "is_authenticated": True,
            "status": "active",
            "views": 421,
            "created_at": datetime.now(timezone.utc)
        },
        {
            "item_id": "sample_7",
            "seller_id": "seller_007",
            "seller_name": "يوسف المطوع",
            "title": "Traditional Incense Burner (Mabkhara)",
            "title_ar": "مبخرة تقليدية",
            "description": "Ornate brass incense burner with detailed Islamic geometric patterns. Perfect for Oud and Bakhoor.",
            "description_ar": "مبخرة نحاسية مزخرفة بأنماط هندسية إسلامية دقيقة. مثالية للعود والبخور.",
            "category": "antiques",
            "price": 95.0,
            "currency": "KWD",
            "images": ["https://images.unsplash.com/photo-1590076215667-875d4ef2d7de?w=400&h=400&fit=crop"],
            "is_authenticated": False,
            "status": "active",
            "views": 145,
            "created_at": datetime.now(timezone.utc)
        },
        {
            "item_id": "sample_8",
            "seller_id": "seller_008",
            "seller_name": "هند العجمي",
            "title": "Vintage Kuwaiti Painting",
            "title_ar": "لوحة كويتية قديمة",
            "description": "Oil painting depicting old Kuwait markets from the 1960s by local artist. Framed and signed.",
            "description_ar": "لوحة زيتية تصور أسواق الكويت القديمة من الستينات لفنان محلي. مؤطرة وموقعة.",
            "category": "art",
            "price": 750.0,
            "currency": "KWD",
            "images": ["https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=400&fit=crop"],
            "is_authenticated": True,
            "status": "active",
            "views": 289,
            "created_at": datetime.now(timezone.utc)
        }
    ]


@router.post("/items", response_model=MarketplaceItem)
async def create_item(item: MarketplaceItemCreateWithImages, user: dict = Depends(require_auth)):
    item_id = f"item_{uuid.uuid4().hex[:12]}"
    
    # Process images - store base64 data or URLs
    processed_images = []
    for img in item.images[:5]:  # Limit to 5 images
        if img.startswith('data:image') or img.startswith('http'):
            processed_images.append(img)
    
    item_doc = {
        "item_id": item_id,
        "seller_id": user["user_id"],
        "seller_name": user.get("name", "Anonymous"),
        "title": item.title,
        "title_ar": item.title_ar,
        "description": item.description,
        "description_ar": item.description_ar,
        "category": item.category,
        "price": item.price,
        "currency": item.currency,
        "images": processed_images,
        "is_authenticated": False,
        "status": "active",
        "views": 0,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.marketplace_items.insert_one(item_doc)
    item_doc["created_at"] = datetime.fromisoformat(item_doc["created_at"])
    return MarketplaceItem(**item_doc)


@router.delete("/items/{item_id}")
async def delete_item(item_id: str, user: dict = Depends(require_auth)):
    item = await db.marketplace_items.find_one({"item_id": item_id}, {"_id": 0})
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    if item["seller_id"] != user["user_id"]:
        raise HTTPException(status_code=403, detail="Not authorized to delete this item")
    
    await db.marketplace_items.delete_one({"item_id": item_id})
    return {"message": "Item deleted successfully"}


@router.get("/items")
async def get_items(category: Optional[str] = None, limit: int = 20, skip: int = 0):
    query = {"status": "active"}
    if category:
        query["category"] = category
    
    items = await db.marketplace_items.find(query, {"_id": 0}).skip(skip).limit(limit).to_list(limit)
    
    # If no items exist, return sample items
    if not items:
        items = get_sample_antique_items()
    else:
        for item in items:
            if isinstance(item.get("created_at"), str):
                item["created_at"] = datetime.fromisoformat(item["created_at"])
    
    return {"items": items, "total": len(items)}


@router.get("/items/{item_id}", response_model=MarketplaceItem)
async def get_item(item_id: str):
    item = await db.marketplace_items.find_one({"item_id": item_id}, {"_id": 0})
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    if isinstance(item.get("created_at"), str):
        item["created_at"] = datetime.fromisoformat(item["created_at"])
    return MarketplaceItem(**item)
