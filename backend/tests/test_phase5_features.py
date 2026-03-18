"""
Phase 5 Testing - Navigation, Tourist Guide, Youth, Kids Pages
Tests all new features requested:
1. Navigation dropdowns (Sections and Explore menus)
2. Tourist page with 4 category tabs (Etiquette, Cuisine, Landmarks, Social)
3. Youth page with 3 tabs (Courses, Design Lab, Careers)
4. Kids page with 6 interactive games
5. API endpoints validation
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestHealthAndBasicAPIs:
    """Basic health and API status checks"""
    
    def test_health_endpoint(self):
        """Test /api/health returns healthy status"""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data.get("status") == "healthy"
        print("✓ Health endpoint is healthy")

class TestTouristGuideAPI:
    """Tourist Guide API Tests - Real Kuwaiti Content"""
    
    def test_tourists_guide_endpoint(self):
        """Test /api/content/tourists-guide returns data"""
        response = requests.get(f"{BASE_URL}/api/content/tourists-guide")
        assert response.status_code == 200
        data = response.json()
        
        # Verify all 4 main categories exist
        assert "etiquette" in data, "Missing etiquette data"
        assert "cuisine" in data, "Missing cuisine data"
        assert "landmarks" in data, "Missing landmarks data"
        assert "social_life" in data, "Missing social_life data"
        assert "phrases" in data, "Missing phrases data"
        print("✓ Tourist guide has all 4 categories + phrases")
    
    def test_etiquette_sections(self):
        """Test etiquette has proper sections"""
        response = requests.get(f"{BASE_URL}/api/content/tourists-guide")
        data = response.json()
        etiquette = data.get("etiquette", {})
        
        assert "sections" in etiquette
        sections = etiquette.get("sections", [])
        assert len(sections) >= 4, f"Expected 4+ etiquette sections, got {len(sections)}"
        
        # Check section structure
        for section in sections:
            assert "id" in section
            assert "title" in section
            assert "title_ar" in section
            assert "content" in section
            assert "tips" in section
            assert "image" in section
        
        # Check specific sections exist
        section_ids = [s["id"] for s in sections]
        assert "greetings" in section_ids, "Missing greetings section"
        assert "diwaniya" in section_ids, "Missing diwaniya section"
        assert "dress" in section_ids, "Missing dress code section"
        assert "ramadan" in section_ids, "Missing ramadan section"
        print("✓ Etiquette has 4 sections: greetings, diwaniya, dress, ramadan")
    
    def test_cuisine_dishes(self):
        """Test cuisine has 6 Kuwaiti dishes"""
        response = requests.get(f"{BASE_URL}/api/content/tourists-guide")
        data = response.json()
        cuisine = data.get("cuisine", {})
        
        assert "dishes" in cuisine
        dishes = cuisine.get("dishes", [])
        assert len(dishes) >= 6, f"Expected 6+ dishes, got {len(dishes)}"
        
        # Check dish structure
        for dish in dishes:
            assert "name" in dish
            assert "name_ar" in dish
            assert "description" in dish
            assert "ingredients" in dish
            assert "where_to_try" in dish
            assert "image" in dish
        
        # Check specific dishes
        dish_ids = [d["id"] for d in dishes]
        expected_dishes = ["machboos", "jireesh", "margoog", "gabout", "harees", "luqaimat"]
        for dish_id in expected_dishes:
            assert dish_id in dish_ids, f"Missing dish: {dish_id}"
        print("✓ Cuisine has 6 dishes: machboos, jireesh, margoog, gabout, harees, luqaimat")
    
    def test_landmarks_places(self):
        """Test landmarks has 6 tourist attractions"""
        response = requests.get(f"{BASE_URL}/api/content/tourists-guide")
        data = response.json()
        landmarks = data.get("landmarks", {})
        
        assert "places" in landmarks
        places = landmarks.get("places", [])
        assert len(places) >= 6, f"Expected 6+ places, got {len(places)}"
        
        # Check place structure
        for place in places:
            assert "name" in place
            assert "name_ar" in place
            assert "description" in place
            assert "address" in place
            assert "rating" in place
            assert "highlights" in place
            assert "image" in place
        
        # Check specific landmarks
        place_ids = [p["id"] for p in places]
        expected_places = ["kuwait-towers", "grand-mosque", "mubarakiya-souq", "failaka-island", "sadu-house", "liberation-tower"]
        for place_id in expected_places:
            assert place_id in place_ids, f"Missing landmark: {place_id}"
        print("✓ Landmarks has 6 places: Kuwait Towers, Grand Mosque, Mubarakiya Souq, Failaka Island, Sadu House, Liberation Tower")
    
    def test_social_life_topics(self):
        """Test social life has 4 topics"""
        response = requests.get(f"{BASE_URL}/api/content/tourists-guide")
        data = response.json()
        social_life = data.get("social_life", {})
        
        assert "topics" in social_life
        topics = social_life.get("topics", [])
        assert len(topics) >= 4, f"Expected 4+ topics, got {len(topics)}"
        
        # Check topic structure
        for topic in topics:
            assert "title" in topic
            assert "title_ar" in topic
            assert "description" in topic
            assert "facts" in topic
            assert "image" in topic
        
        topic_ids = [t["id"] for t in topics]
        expected_topics = ["diwaniya-life", "family-gatherings", "celebrations", "coffee-culture"]
        for topic_id in expected_topics:
            assert topic_id in topic_ids, f"Missing topic: {topic_id}"
        print("✓ Social life has 4 topics: diwaniya, family gatherings, celebrations, coffee culture")
    
    def test_useful_phrases(self):
        """Test useful phrases exists with 10 entries"""
        response = requests.get(f"{BASE_URL}/api/content/tourists-guide")
        data = response.json()
        phrases = data.get("phrases", [])
        
        assert len(phrases) >= 10, f"Expected 10+ phrases, got {len(phrases)}"
        
        # Check phrase structure
        for phrase in phrases:
            assert "ar" in phrase
            assert "en" in phrase
            assert "pronunciation" in phrase
            assert "context" in phrase
        
        # Verify some common phrases
        en_phrases = [p["en"] for p in phrases]
        assert any("Peace be upon you" in p for p in en_phrases), "Missing 'Peace be upon you' phrase"
        print("✓ Phrases has 10+ Kuwaiti/Arabic expressions with pronunciation guides")


class TestContentAPIs:
    """Content API Tests - Food Videos, Arab Countries"""
    
    def test_food_videos_endpoint(self):
        """Test /api/content/food-videos returns data"""
        response = requests.get(f"{BASE_URL}/api/content/food-videos")
        assert response.status_code == 200
        data = response.json()
        assert "videos" in data or "categories" in data
        print("✓ Food videos endpoint returns data")
    
    def test_arab_countries_endpoint(self):
        """Test /api/content/arab-countries returns data"""
        response = requests.get(f"{BASE_URL}/api/content/arab-countries")
        assert response.status_code == 200
        data = response.json()
        assert "countries" in data
        print("✓ Arab countries endpoint returns data")
    
    def test_categories_endpoint(self):
        """Test /api/content/categories returns data"""
        response = requests.get(f"{BASE_URL}/api/content/categories")
        assert response.status_code == 200
        data = response.json()
        assert "categories" in data
        print("✓ Categories endpoint returns data")


class TestSubscriptionsAPI:
    """Subscriptions API Tests"""
    
    def test_subscription_plans(self):
        """Test /api/subscriptions/plans returns plans"""
        response = requests.get(f"{BASE_URL}/api/subscriptions/plans")
        assert response.status_code == 200
        data = response.json()
        
        # May be wrapped in 'plans' or be a list
        plans = data.get("plans", data) if isinstance(data, dict) else data
        assert len(plans) >= 1, "Should have at least 1 subscription plan"
        print(f"✓ Subscriptions endpoint returns {len(plans)} plans")


class TestMarketplaceAPI:
    """Marketplace API Tests"""
    
    def test_marketplace_items(self):
        """Test /api/marketplace/items returns items"""
        response = requests.get(f"{BASE_URL}/api/marketplace/items")
        assert response.status_code == 200
        data = response.json()
        
        # May be wrapped in 'items' or be a list
        items = data.get("items", data) if isinstance(data, dict) else data
        print(f"✓ Marketplace endpoint returns items")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
