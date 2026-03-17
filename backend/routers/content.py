"""
Content Router - Serves static JSON data for Arab World and Food sections
"""
from fastapi import APIRouter
from pathlib import Path
import json

router = APIRouter(prefix="/content", tags=["Content"])

DATA_DIR = Path(__file__).parent.parent / "data"


def load_json_data(filename: str) -> dict:
    """Load JSON data from file"""
    filepath = DATA_DIR / filename
    if filepath.exists():
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}


@router.get("/categories")
async def get_categories():
    categories = [
        {"id": "antiques", "name": "Antiques", "name_ar": "التحف", "icon": "gem"},
        {"id": "crafts", "name": "Traditional Crafts", "name_ar": "الحرف التقليدية", "icon": "palette"},
        {"id": "clothing", "name": "Traditional Clothing", "name_ar": "الملابس التقليدية", "icon": "shirt"},
        {"id": "jewelry", "name": "Jewelry", "name_ar": "المجوهرات", "icon": "crown"},
        {"id": "art", "name": "Art & Calligraphy", "name_ar": "الفن والخط", "icon": "pen-tool"},
        {"id": "books", "name": "Books & Manuscripts", "name_ar": "الكتب والمخطوطات", "icon": "book-open"}
    ]
    return {"categories": categories}


@router.get("/arab-countries")
async def get_arab_countries():
    """Get Arab countries data from JSON file"""
    data = load_json_data("arab_data.json")
    if data:
        return data
    # Fallback to basic list
    countries = [
        {"code": "KW", "name": "Kuwait", "name_ar": "الكويت"},
        {"code": "SA", "name": "Saudi Arabia", "name_ar": "السعودية"},
        {"code": "AE", "name": "UAE", "name_ar": "الإمارات"},
        {"code": "EG", "name": "Egypt", "name_ar": "مصر"},
        {"code": "LB", "name": "Lebanon", "name_ar": "لبنان"},
        {"code": "MA", "name": "Morocco", "name_ar": "المغرب"}
    ]
    return {"countries": countries}


@router.get("/food-videos")
async def get_food_videos():
    """Get food/cooking video data from JSON file"""
    data = load_json_data("food_data.json")
    if data:
        return data
    # Fallback to empty structure
    return {"videos": [], "categories": []}
