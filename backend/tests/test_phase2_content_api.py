"""
Test Phase 2 Content APIs - Food Videos, Arab Countries, and Core Endpoints
Tests the data architecture implementation with JSON data files
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Fixtures
@pytest.fixture(scope="module")
def api_client():
    """Shared requests session"""
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    return session


class TestHealthEndpoints:
    """Health and root endpoint tests"""
    
    def test_health_returns_healthy_status(self, api_client):
        """Backend API /api/health endpoint returns healthy status"""
        response = api_client.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "timestamp" in data
    
    def test_root_endpoint_returns_welcome(self, api_client):
        """Root API endpoint returns welcome message"""
        response = api_client.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "Darwaza API" in data.get("message", "")


class TestFoodVideosEndpoint:
    """Tests for /api/content/food-videos endpoint"""
    
    def test_food_videos_returns_8_videos(self, api_client):
        """Backend API /api/content/food-videos returns 8 videos"""
        response = api_client.get(f"{BASE_URL}/api/content/food-videos")
        assert response.status_code == 200
        data = response.json()
        videos = data.get("videos", [])
        assert len(videos) == 8, f"Expected 8 videos, got {len(videos)}"
    
    def test_food_videos_has_categories(self, api_client):
        """Backend API /api/content/food-videos returns categories"""
        response = api_client.get(f"{BASE_URL}/api/content/food-videos")
        assert response.status_code == 200
        data = response.json()
        categories = data.get("categories", [])
        assert len(categories) >= 4, f"Expected at least 4 categories, got {len(categories)}"
        
        # Check category structure
        for cat in categories:
            assert "id" in cat
            assert "name" in cat
            assert "name_ar" in cat
    
    def test_food_videos_structure(self, api_client):
        """Food videos have correct structure with all required fields"""
        response = api_client.get(f"{BASE_URL}/api/content/food-videos")
        data = response.json()
        videos = data.get("videos", [])
        
        required_fields = ["id", "title", "title_ar", "description", "description_ar", 
                          "category", "youtube_id", "duration", "thumbnail"]
        
        for video in videos:
            for field in required_fields:
                assert field in video, f"Video missing field: {field}"
    
    def test_food_videos_categories_match(self, api_client):
        """Video categories should match defined categories"""
        response = api_client.get(f"{BASE_URL}/api/content/food-videos")
        data = response.json()
        videos = data.get("videos", [])
        categories = data.get("categories", [])
        
        category_ids = {cat["id"] for cat in categories}
        for video in videos:
            assert video["category"] in category_ids, f"Video category {video['category']} not in categories list"


class TestArabCountriesEndpoint:
    """Tests for /api/content/arab-countries endpoint"""
    
    def test_arab_countries_returns_6_countries(self, api_client):
        """Backend API /api/content/arab-countries returns 6 countries"""
        response = api_client.get(f"{BASE_URL}/api/content/arab-countries")
        assert response.status_code == 200
        data = response.json()
        countries = data.get("countries", [])
        assert len(countries) == 6, f"Expected 6 countries, got {len(countries)}"
    
    def test_arab_countries_have_video_and_dish(self, api_client):
        """Each country has video_id and dish data"""
        response = api_client.get(f"{BASE_URL}/api/content/arab-countries")
        data = response.json()
        countries = data.get("countries", [])
        
        for country in countries:
            assert "video_id" in country, f"Country {country['code']} missing video_id"
            assert "video_title" in country, f"Country {country['code']} missing video_title"
            assert "dish" in country, f"Country {country['code']} missing dish"
            
            dish = country["dish"]
            assert "name" in dish, f"Country {country['code']} dish missing name"
            assert "name_ar" in dish, f"Country {country['code']} dish missing name_ar"
            assert "description" in dish, f"Country {country['code']} dish missing description"
            assert "image" in dish, f"Country {country['code']} dish missing image"
    
    def test_arab_countries_structure(self, api_client):
        """Countries have correct structure with flags and descriptions"""
        response = api_client.get(f"{BASE_URL}/api/content/arab-countries")
        data = response.json()
        countries = data.get("countries", [])
        
        required_fields = ["code", "name", "name_ar", "flag", "description", "description_ar"]
        
        for country in countries:
            for field in required_fields:
                assert field in country, f"Country missing field: {field}"
    
    def test_kuwait_is_present(self, api_client):
        """Kuwait (KW) is present in countries list"""
        response = api_client.get(f"{BASE_URL}/api/content/arab-countries")
        data = response.json()
        countries = data.get("countries", [])
        
        country_codes = [c["code"] for c in countries]
        assert "KW" in country_codes, "Kuwait (KW) not found in countries"


class TestSubscriptionPlansEndpoint:
    """Tests for /api/subscriptions/plans endpoint"""
    
    def test_subscription_returns_4_plans(self, api_client):
        """Backend API /api/subscriptions/plans returns 4 subscription plans"""
        response = api_client.get(f"{BASE_URL}/api/subscriptions/plans")
        assert response.status_code == 200
        data = response.json()
        plans = data.get("plans", [])
        assert len(plans) == 4, f"Expected 4 plans, got {len(plans)}"
    
    def test_subscription_plans_have_correct_ids(self, api_client):
        """Plans have free, family, heritage, premium ids"""
        response = api_client.get(f"{BASE_URL}/api/subscriptions/plans")
        data = response.json()
        plans = data.get("plans", [])
        
        plan_ids = {plan["plan_id"] for plan in plans}
        expected_ids = {"free", "family", "heritage", "premium"}
        assert plan_ids == expected_ids, f"Expected {expected_ids}, got {plan_ids}"
    
    def test_subscription_plans_pricing(self, api_client):
        """Plans have correct pricing (Free=0, Family=10, Heritage=25, Premium=55 KWD)"""
        response = api_client.get(f"{BASE_URL}/api/subscriptions/plans")
        data = response.json()
        plans = data.get("plans", [])
        
        expected_prices = {
            "free": 0.0,
            "family": 10.0,
            "heritage": 25.0,
            "premium": 55.0
        }
        
        for plan in plans:
            plan_id = plan["plan_id"]
            assert plan["price_monthly"] == expected_prices[plan_id], \
                f"Plan {plan_id}: expected {expected_prices[plan_id]}, got {plan['price_monthly']}"
    
    def test_subscription_plans_structure(self, api_client):
        """Plans have all required fields"""
        response = api_client.get(f"{BASE_URL}/api/subscriptions/plans")
        data = response.json()
        plans = data.get("plans", [])
        
        required_fields = ["plan_id", "name", "name_ar", "description", "description_ar",
                          "price_monthly", "price_yearly", "currency", "features", "features_ar"]
        
        for plan in plans:
            for field in required_fields:
                assert field in plan, f"Plan {plan['plan_id']} missing field: {field}"


class TestMarketplaceItemsEndpoint:
    """Tests for /api/marketplace/items endpoint"""
    
    def test_marketplace_returns_8_items(self, api_client):
        """Backend API /api/marketplace/items returns 8 sample antique items"""
        response = api_client.get(f"{BASE_URL}/api/marketplace/items")
        assert response.status_code == 200
        data = response.json()
        items = data.get("items", [])
        assert len(items) == 8, f"Expected 8 items, got {len(items)}"
    
    def test_marketplace_items_structure(self, api_client):
        """Items have required structure with bilingual content"""
        response = api_client.get(f"{BASE_URL}/api/marketplace/items")
        data = response.json()
        items = data.get("items", [])
        
        required_fields = ["item_id", "seller_id", "seller_name", "title", "title_ar",
                          "description", "description_ar", "category", "price", 
                          "currency", "images", "status"]
        
        for item in items:
            for field in required_fields:
                assert field in item, f"Item {item['item_id']} missing field: {field}"
    
    def test_marketplace_items_have_valid_prices(self, api_client):
        """All items have positive prices in KWD"""
        response = api_client.get(f"{BASE_URL}/api/marketplace/items")
        data = response.json()
        items = data.get("items", [])
        
        for item in items:
            assert item["price"] > 0, f"Item {item['item_id']} has invalid price: {item['price']}"
            assert item["currency"] == "KWD", f"Item {item['item_id']} currency is not KWD"


class TestContentCategories:
    """Tests for /api/content/categories endpoint"""
    
    def test_categories_returns_list(self, api_client):
        """Categories endpoint returns list of marketplace categories"""
        response = api_client.get(f"{BASE_URL}/api/content/categories")
        assert response.status_code == 200
        data = response.json()
        categories = data.get("categories", [])
        assert len(categories) >= 5, f"Expected at least 5 categories, got {len(categories)}"
    
    def test_categories_structure(self, api_client):
        """Categories have id, name, name_ar, and icon"""
        response = api_client.get(f"{BASE_URL}/api/content/categories")
        data = response.json()
        categories = data.get("categories", [])
        
        for cat in categories:
            assert "id" in cat
            assert "name" in cat
            assert "name_ar" in cat
            assert "icon" in cat
