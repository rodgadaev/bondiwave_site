import requests
import sys
from datetime import datetime
import json

class BondiWaveAPITester:
    def __init__(self, base_url="https://premium-nose-strips.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}" if endpoint else self.api_url
        if headers is None:
            headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)

            success = response.status_code == expected_status
            
            result = {
                "test_name": name,
                "method": method,
                "endpoint": endpoint,
                "expected_status": expected_status,
                "actual_status": response.status_code,
                "success": success,
                "response_data": None,
                "error": None
            }
            
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    result["response_data"] = response.json()
                    print(f"   Response: {json.dumps(result['response_data'], indent=2)}")
                except:
                    result["response_data"] = response.text
                    print(f"   Response: {response.text}")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    result["response_data"] = response.json()
                    print(f"   Error Response: {json.dumps(result['response_data'], indent=2)}")
                except:
                    result["response_data"] = response.text
                    print(f"   Error Response: {response.text}")

            self.test_results.append(result)
            return success, result["response_data"]

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            result = {
                "test_name": name,
                "method": method,
                "endpoint": endpoint,
                "expected_status": expected_status,
                "actual_status": None,
                "success": False,
                "response_data": None,
                "error": str(e)
            }
            self.test_results.append(result)
            return False, {}

    def test_api_root(self):
        """Test API root endpoint"""
        return self.run_test("API Root", "GET", "", 200)

    def test_subscribe_new_email(self):
        """Test subscribing a new email"""
        test_email = f"test_{datetime.now().strftime('%Y%m%d_%H%M%S')}@example.com"
        return self.run_test(
            "Subscribe New Email",
            "POST",
            "subscribe",
            200,
            data={"email": test_email}
        )

    def test_subscribe_duplicate_email(self):
        """Test subscribing with duplicate email"""
        test_email = "duplicate@example.com"
        # First subscription
        self.run_test(
            "Subscribe First Time",
            "POST", 
            "subscribe",
            200,
            data={"email": test_email}
        )
        # Second subscription (should handle duplicate)
        return self.run_test(
            "Subscribe Duplicate Email",
            "POST",
            "subscribe", 
            200,
            data={"email": test_email}
        )

    def test_subscribe_invalid_email(self):
        """Test subscribing with invalid email"""
        return self.run_test(
            "Subscribe Invalid Email",
            "POST",
            "subscribe",
            422,  # FastAPI validation error
            data={"email": "invalid-email"}
        )

    def test_get_subscriber_count(self):
        """Test getting subscriber count"""
        return self.run_test("Get Subscriber Count", "GET", "subscribers/count", 200)

    def test_status_endpoints(self):
        """Test status check endpoints"""
        # Test creating status check
        success1, _ = self.run_test(
            "Create Status Check",
            "POST",
            "status",
            200,
            data={"client_name": "test_client"}
        )
        
        # Test getting status checks
        success2, _ = self.run_test("Get Status Checks", "GET", "status", 200)
        
        return success1 and success2

def main():
    print("🚀 Starting Bondi Wave API Tests...")
    print("=" * 50)
    
    tester = BondiWaveAPITester()
    
    # Run all tests
    tests = [
        tester.test_api_root,
        tester.test_subscribe_new_email,
        tester.test_subscribe_duplicate_email,
        tester.test_get_subscriber_count,
        tester.test_status_endpoints,
    ]
    
    for test in tests:
        try:
            test()
        except Exception as e:
            print(f"❌ Test failed with exception: {str(e)}")
    
    # Print summary
    print("\n" + "=" * 50)
    print(f"📊 Test Summary:")
    print(f"   Tests Run: {tester.tests_run}")
    print(f"   Tests Passed: {tester.tests_passed}")
    print(f"   Success Rate: {(tester.tests_passed/tester.tests_run*100):.1f}%" if tester.tests_run > 0 else "0%")
    
    # Print failed tests
    failed_tests = [r for r in tester.test_results if not r["success"]]
    if failed_tests:
        print(f"\n❌ Failed Tests ({len(failed_tests)}):")
        for test in failed_tests:
            print(f"   - {test['test_name']}: Expected {test['expected_status']}, got {test['actual_status']}")
            if test['error']:
                print(f"     Error: {test['error']}")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())