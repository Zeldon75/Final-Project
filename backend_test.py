import requests
import json
import sys
from datetime import datetime

class DarwazaAPITester:
    def __init__(self):
        self.base_url = "https://sadu-cultural.preview.emergentagent.com/api"
        self.session = requests.Session()
        self.token = None
        self.user_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        
    def log_result(self, test_name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {test_name} - PASSED {details}")
        else:
            self.failed_tests.append({"test": test_name, "details": details})
            print(f"❌ {test_name} - FAILED {details}")
        return success
    
    def test_health_check(self):
        """Test basic health endpoints"""
        print("\n🔍 Testing Health Check Endpoints...")
        
        try:
            # Test root endpoint
            response = self.session.get(f"{self.base_url}/")
            success = response.status_code == 200 and "Darwaza API" in response.text
            self.log_result("API Root Endpoint", success, f"Status: {response.status_code}")
            
            # Test health endpoint
            response = self.session.get(f"{self.base_url}/health")
            success = response.status_code == 200 and "healthy" in response.text
            self.log_result("Health Endpoint", success, f"Status: {response.status_code}")
            
            return True
        except Exception as e:
            self.log_result("Health Check", False, f"Exception: {str(e)}")
            return False
    
    def test_subscription_plans(self):
        """Test subscription plans endpoint with updated pricing"""
        print("\n🔍 Testing Subscription Plans...")
        
        try:
            response = self.session.get(f"{self.base_url}/subscriptions/plans")
            if response.status_code == 200:
                data = response.json()
                plans = data.get("plans", [])
                
                # Check if we have all 4 plans (including premium)
                plan_ids = [plan.get("plan_id") for plan in plans]
                expected_plans = ["free", "family", "heritage", "premium"]
                has_all_plans = all(plan_id in plan_ids for plan_id in expected_plans)
                
                self.log_result("Subscription Plans Count", len(plans) == 4, f"Found {len(plans)} plans")
                self.log_result("Required Plans Present", has_all_plans, f"Plans: {plan_ids}")
                
                # Check specific pricing (Free=0, Family=10KWD, Heritage=25KWD, Premium=55KWD)
                expected_prices = {
                    "free": 0.0,
                    "family": 10.0,
                    "heritage": 25.0,
                    "premium": 55.0
                }
                
                pricing_correct = True
                for plan in plans:
                    plan_id = plan.get("plan_id")
                    if plan_id in expected_prices:
                        expected_price = expected_prices[plan_id]
                        actual_price = plan.get("price_monthly", -1)
                        if actual_price != expected_price:
                            pricing_correct = False
                            self.log_result(f"Plan {plan_id} Pricing", False, f"Expected {expected_price}, got {actual_price}")
                        else:
                            self.log_result(f"Plan {plan_id} Pricing", True, f"{actual_price} KWD")
                
                self.log_result("All Plan Pricing Correct", pricing_correct, "Updated pricing structure verified")
                
                # Check plan structure
                if plans:
                    first_plan = plans[0]
                    required_fields = ["plan_id", "name", "name_ar", "price_monthly", "price_yearly", "features", "features_ar"]
                    has_structure = all(field in first_plan for field in required_fields)
                    self.log_result("Plan Data Structure", has_structure, "All required fields present")
                
                return True
            else:
                self.log_result("Subscription Plans", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_result("Subscription Plans", False, f"Exception: {str(e)}")
            return False
    
    def test_content_endpoints(self):
        """Test content endpoints"""
        print("\n🔍 Testing Content Endpoints...")
        
        try:
            # Test categories endpoint
            response = self.session.get(f"{self.base_url}/content/categories")
            if response.status_code == 200:
                data = response.json()
                categories = data.get("categories", [])
                self.log_result("Marketplace Categories", len(categories) > 0, f"Found {len(categories)} categories")
                
                # Check category structure
                if categories:
                    first_cat = categories[0]
                    required_fields = ["id", "name", "name_ar", "icon"]
                    has_structure = all(field in first_cat for field in required_fields)
                    self.log_result("Category Data Structure", has_structure, "All required fields present")
            else:
                self.log_result("Marketplace Categories", False, f"Status: {response.status_code}")
            
            # Test Arab countries endpoint
            response = self.session.get(f"{self.base_url}/content/arab-countries")
            if response.status_code == 200:
                data = response.json()
                countries = data.get("countries", [])
                self.log_result("Arab Countries", len(countries) >= 15, f"Found {len(countries)} countries")
                
                # Check if Kuwait is present
                kuwait_present = any(country.get("code") == "KW" for country in countries)
                self.log_result("Kuwait in Countries List", kuwait_present, "KW code found")
            else:
                self.log_result("Arab Countries", False, f"Status: {response.status_code}")
            
            return True
        except Exception as e:
            self.log_result("Content Endpoints", False, f"Exception: {str(e)}")
            return False
    
    def test_user_registration(self):
        """Test user registration"""
        print("\n🔍 Testing User Registration...")
        
        try:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            test_user = {
                "email": f"test_user_{timestamp}@example.com",
                "password": "TestPassword123!",
                "name": f"Test User {timestamp}",
                "preferred_language": "ar",
                "preferred_interface": "heritage"
            }
            
            response = self.session.post(f"{self.base_url}/auth/register", json=test_user)
            if response.status_code == 200:
                data = response.json()
                self.token = data.get("access_token")
                self.user_id = data.get("user", {}).get("user_id")
                
                # Update session headers
                self.session.headers.update({"Authorization": f"Bearer {self.token}"})
                
                self.log_result("User Registration", True, f"User ID: {self.user_id}")
                return True
            else:
                self.log_result("User Registration", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
        except Exception as e:
            self.log_result("User Registration", False, f"Exception: {str(e)}")
            return False
    
    def test_user_profile(self):
        """Test user profile endpoint"""
        print("\n🔍 Testing User Profile...")
        
        if not self.token:
            self.log_result("User Profile", False, "No auth token available")
            return False
        
        try:
            response = self.session.get(f"{self.base_url}/auth/me")
            success = response.status_code == 200
            if success:
                data = response.json()
                has_user_id = data.get("user_id") == self.user_id
                self.log_result("Get User Profile", has_user_id, f"Matched user ID: {data.get('user_id')}")
            else:
                self.log_result("Get User Profile", False, f"Status: {response.status_code}")
            
            return success
        except Exception as e:
            self.log_result("User Profile", False, f"Exception: {str(e)}")
            return False
    
    def test_ai_chat(self):
        """Test AI chat functionality"""
        print("\n🔍 Testing AI Chat...")
        
        if not self.token:
            self.log_result("AI Chat", False, "No auth token available")
            return False
        
        try:
            test_message = {
                "content": "Tell me about Kuwaiti heritage in one sentence",
                "model": "gpt-5.2"
            }
            
            response = self.session.post(f"{self.base_url}/ai/chat", json=test_message)
            if response.status_code == 200:
                data = response.json()
                has_response = len(data.get("response", "")) > 0
                has_session = data.get("session_id") is not None
                self.log_result("AI Chat Response", has_response, f"Response length: {len(data.get('response', ''))}")
                self.log_result("AI Session ID", has_session, f"Session: {data.get('session_id', 'None')}")
                return True
            else:
                self.log_result("AI Chat", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
        except Exception as e:
            self.log_result("AI Chat", False, f"Exception: {str(e)}")
            return False
    
    def test_marketplace_endpoints(self):
        """Test marketplace functionality"""
        print("\n🔍 Testing Marketplace Endpoints...")
        
        try:
            # Test get marketplace items
            response = self.session.get(f"{self.base_url}/marketplace/items")
            success = response.status_code == 200
            if success:
                data = response.json()
                self.log_result("Get Marketplace Items", True, f"Found {len(data.get('items', []))} items")
            else:
                self.log_result("Get Marketplace Items", False, f"Status: {response.status_code}")
            
            return success
        except Exception as e:
            self.log_result("Marketplace Endpoints", False, f"Exception: {str(e)}")
            return False
    
    def test_councils_endpoints(self):
        """Test live councils functionality"""
        print("\n🔍 Testing Live Councils Endpoints...")
        
        try:
            # Test get councils
            response = self.session.get(f"{self.base_url}/councils")
            success = response.status_code == 200
            if success:
                data = response.json()
                self.log_result("Get Live Councils", True, f"Found {len(data.get('councils', []))} councils")
            else:
                self.log_result("Get Live Councils", False, f"Status: {response.status_code}")
            
            return success
        except Exception as e:
            self.log_result("Live Councils", False, f"Exception: {str(e)}")
            return False
    
    def test_payment_checkout(self):
        """Test payment checkout functionality (Stripe + K-NET)"""
        print("\n🔍 Testing Payment Checkout...")
        
        if not self.token:
            self.log_result("Payment Checkout", False, "No auth token available")
            return False
        
        try:
            # Test Stripe checkout
            stripe_payload = {
                "plan_id": "family",
                "billing_cycle": "monthly",
                "payment_method": "stripe",
                "origin_url": "https://sadu-cultural.preview.emergentagent.com"
            }
            
            response = self.session.post(f"{self.base_url}/payments/checkout", json=stripe_payload)
            if response.status_code == 200:
                data = response.json()
                has_checkout_url = data.get("checkout_url") is not None
                has_session_id = data.get("session_id") is not None
                self.log_result("Stripe Checkout", has_checkout_url, f"Session ID: {data.get('session_id', 'None')}")
            else:
                self.log_result("Stripe Checkout", False, f"Status: {response.status_code}, Response: {response.text}")
            
            # Test K-NET checkout (should return placeholder message)
            knet_payload = {
                "plan_id": "heritage",
                "billing_cycle": "monthly",
                "payment_method": "knet",
                "origin_url": "https://sadu-cultural.preview.emergentagent.com"
            }
            
            response = self.session.post(f"{self.base_url}/payments/checkout", json=knet_payload)
            if response.status_code == 200:
                data = response.json()
                is_knet_placeholder = data.get("payment_method") == "knet" and data.get("message") is not None
                self.log_result("K-NET Placeholder", is_knet_placeholder, f"Message: {data.get('message', 'None')}")
            else:
                self.log_result("K-NET Checkout", False, f"Status: {response.status_code}")
                
            return True
        except Exception as e:
            self.log_result("Payment Checkout", False, f"Exception: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting Darwaza Backend API Tests...")
        print("=" * 50)
        
        # Test without authentication
        self.test_health_check()
        self.test_subscription_plans()
        self.test_content_endpoints()
        self.test_marketplace_endpoints()
        self.test_councils_endpoints()
        
        # Test with authentication
        if self.test_user_registration():
            self.test_user_profile()
            self.test_ai_chat()
            self.test_payment_checkout()
        
        # Final summary
        print("\n" + "=" * 50)
        print("🏁 BACKEND TEST SUMMARY")
        print("=" * 50)
        print(f"✅ Tests Passed: {self.tests_passed}")
        print(f"❌ Tests Failed: {len(self.failed_tests)}")
        print(f"📊 Total Tests: {self.tests_run}")
        print(f"🎯 Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        
        if self.failed_tests:
            print("\n❌ Failed Tests Details:")
            for failure in self.failed_tests:
                print(f"  • {failure['test']}: {failure['details']}")
        
        return len(self.failed_tests) == 0

def main():
    tester = DarwazaAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())