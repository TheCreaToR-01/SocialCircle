import requests
import sys
import json
from datetime import datetime, timezone, timedelta
import uuid

class LeadBridgeAPITester:
    def __init__(self, base_url="https://leadbridge-1.preview.emergentagent.com"):
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({'Content-Type': 'application/json'})
        
        # Test credentials
        self.admin_creds = {"email": "admin@leadbridge.com", "password": "admin123"}
        self.mentor_creds = {"email": "mentor@leadbridge.com", "password": "mentor123"}
        self.user_creds = {"email": "user@leadbridge.com", "password": "user123"}
        
        # Store tokens and user data
        self.admin_token = None
        self.mentor_token = None
        self.user_token = None
        self.admin_user = None
        self.mentor_user = None
        self.user_user = None
        
        # Test data storage
        self.test_event_id = None
        self.test_lead_id = None
        self.test_mentor_id = None
        
        # Test results
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def log_test(self, test_name, success, details=""):
        """Log test results"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {test_name}")
        else:
            self.failed_tests.append({"test": test_name, "details": details})
            print(f"❌ {test_name} - {details}")

    def make_request(self, method, endpoint, data=None, token=None, expected_status=200, use_cookies=True):
        """Make HTTP request with error handling"""
        url = f"{self.base_url}/api{endpoint}"
        headers = {}
        
        if token:
            headers['Authorization'] = f'Bearer {token}'
            
        try:
            # Use session for cookie-based auth or requests for token-based
            if use_cookies:
                if method == 'GET':
                    response = self.session.get(url, headers=headers)
                elif method == 'POST':
                    response = self.session.post(url, json=data, headers=headers)
                elif method == 'PUT':
                    response = self.session.put(url, json=data, headers=headers)
                elif method == 'DELETE':
                    response = self.session.delete(url, headers=headers)
            else:
                if method == 'GET':
                    response = requests.get(url, headers=headers)
                elif method == 'POST':
                    response = requests.post(url, json=data, headers=headers)
                elif method == 'PUT':
                    response = requests.put(url, json=data, headers=headers)
                elif method == 'DELETE':
                    response = requests.delete(url, headers=headers)
            
            success = response.status_code == expected_status
            return success, response
            
        except Exception as e:
            return False, str(e)

    def test_user_registration(self):
        """Test user registration for different roles"""
        print("\n🔍 Testing User Registration...")
        
        # Test USER registration
        test_user_data = {
            "name": f"Test User {datetime.now().strftime('%H%M%S')}",
            "email": f"testuser{datetime.now().strftime('%H%M%S')}@example.com",
            "password": "testpass123",
            "role": "USER"
        }
        
        success, response = self.make_request('POST', '/auth/register', test_user_data, expected_status=200)
        if success:
            self.log_test("User Registration (USER role)", True)
        else:
            self.log_test("User Registration (USER role)", False, f"Status: {response.status_code}")
        
        # Test MENTOR registration
        test_mentor_data = {
            "name": f"Test Mentor {datetime.now().strftime('%H%M%S')}",
            "email": f"testmentor{datetime.now().strftime('%H%M%S')}@example.com",
            "password": "testpass123",
            "role": "MENTOR"
        }
        
        success, response = self.make_request('POST', '/auth/register', test_mentor_data, expected_status=200)
        if success:
            self.log_test("User Registration (MENTOR role)", True)
        else:
            self.log_test("User Registration (MENTOR role)", False, f"Status: {response.status_code}")

    def test_authentication(self):
        """Test login for all user types"""
        print("\n🔍 Testing Authentication...")
        
        # Test Admin Login
        success, response = self.make_request('POST', '/auth/login', self.admin_creds, expected_status=200)
        if success:
            self.admin_user = response.json()
            self.log_test("Admin Login", True)
        else:
            self.log_test("Admin Login", False, f"Status: {response.status_code}")
        
        # Test Mentor Login  
        success, response = self.make_request('POST', '/auth/login', self.mentor_creds, expected_status=200)
        if success:
            self.mentor_user = response.json()
            self.log_test("Mentor Login", True)
        else:
            self.log_test("Mentor Login", False, f"Status: {response.status_code}")
        
        # Test User Login
        success, response = self.make_request('POST', '/auth/login', self.user_creds, expected_status=200)
        if success:
            self.user_user = response.json()
            self.log_test("User Login", True)
        else:
            self.log_test("User Login", False, f"Status: {response.status_code}")

    def test_auth_me_endpoint(self):
        """Test /auth/me endpoint for all user types using cookie-based auth"""
        print("\n🔍 Testing Auth Me Endpoint...")
        
        # Test with admin session
        success, response = self.make_request('GET', '/auth/me')
        if success and response.json().get('role') == 'ADMIN':
            self.log_test("Auth Me - Admin", True)
        else:
            self.log_test("Auth Me - Admin", False, f"Status: {response.status_code}, Role: {response.json().get('role') if success else 'N/A'}")
        
        # Login as mentor and test
        self.make_request('POST', '/auth/login', self.mentor_creds, expected_status=200)
        success, response = self.make_request('GET', '/auth/me')
        if success and response.json().get('role') == 'MENTOR':
            self.log_test("Auth Me - Mentor", True)
        else:
            self.log_test("Auth Me - Mentor", False, f"Status: {response.status_code}, Role: {response.json().get('role') if success else 'N/A'}")
        
        # Login as user and test
        self.make_request('POST', '/auth/login', self.user_creds, expected_status=200)
        success, response = self.make_request('GET', '/auth/me')
        if success and response.json().get('role') == 'USER':
            self.log_test("Auth Me - User", True)
        else:
            self.log_test("Auth Me - User", False, f"Status: {response.status_code}, Role: {response.json().get('role') if success else 'N/A'}")

    def test_events_endpoints(self):
        """Test event-related endpoints"""
        print("\n🔍 Testing Events Endpoints...")
        
        # Test get all events (public endpoint)
        success, response = self.make_request('GET', '/events')
        if success:
            events = response.json()
            self.log_test("Get All Events", True)
            if events:
                # Test get specific event
                event_id = events[0]['event_id']
                success, response = self.make_request('GET', f'/events/{event_id}')
                if success:
                    self.log_test("Get Specific Event", True)
                    self.test_event_id = event_id
                else:
                    self.log_test("Get Specific Event", False, f"Status: {response.status_code}")
        else:
            self.log_test("Get All Events", False, f"Status: {response.status_code}")

    def test_mentor_profile_endpoints(self):
        """Test mentor profile endpoints"""
        print("\n🔍 Testing Mentor Profile Endpoints...")
        
        # Login as mentor first
        success, response = self.make_request('POST', '/auth/login', self.mentor_creds, expected_status=200)
        if not success:
            self.log_test("Mentor Profile Tests", False, "Failed to login as mentor")
            return
        
        # Test get mentor profile
        success, response = self.make_request('GET', '/mentor/profile')
        if success:
            mentor_profile = response.json()
            self.test_mentor_id = mentor_profile.get('mentor_id')
            self.log_test("Get Mentor Profile", True)
            
            # Test update mentor profile
            update_data = {
                "bio": "Updated bio for testing",
                "expertise": ["Testing", "API Development"],
                "experience": "5 years in testing"
            }
            success, response = self.make_request('PUT', '/mentor/profile', update_data)
            if success:
                self.log_test("Update Mentor Profile", True)
            else:
                self.log_test("Update Mentor Profile", False, f"Status: {response.status_code}")
        else:
            self.log_test("Get Mentor Profile", False, f"Status: {response.status_code}")

    def test_mentor_events_endpoints(self):
        """Test mentor event management endpoints"""
        print("\n🔍 Testing Mentor Events Endpoints...")
        
        # Ensure we're logged in as mentor
        self.make_request('POST', '/auth/login', self.mentor_creds, expected_status=200)
        
        # Test get mentor events
        success, response = self.make_request('GET', '/mentor/events')
        if success:
            self.log_test("Get Mentor Events", True)
        else:
            self.log_test("Get Mentor Events", False, f"Status: {response.status_code}")
        
        # Test create event (might fail if mentor not approved)
        event_data = {
            "title": "Test Event",
            "description": "This is a test event",
            "category": "Testing",
            "event_datetime": (datetime.now(timezone.utc) + timedelta(days=7)).isoformat(),
            "duration": 60,
            "available_slots": 10,
            "price_per_lead": 100.0
        }
        
        success, response = self.make_request('POST', '/mentor/events', event_data, expected_status=201)
        if success:
            self.log_test("Create Event", True)
        else:
            # Might fail if mentor not approved - check status
            if response.status_code == 403:
                self.log_test("Create Event", False, "Mentor not verified (expected)")
            else:
                self.log_test("Create Event", False, f"Status: {response.status_code}")

    def test_booking_flow(self):
        """Test event booking flow"""
        print("\n🔍 Testing Booking Flow...")
        
        if not self.test_event_id:
            self.log_test("Booking Flow Tests", False, "Missing event ID")
            return
        
        # Login as user
        success, response = self.make_request('POST', '/auth/login', self.user_creds, expected_status=200)
        if not success:
            self.log_test("Booking Flow Tests", False, "Failed to login as user")
            return
        
        # Test book event
        booking_data = {
            "name": "Test User",
            "email": "testuser@example.com",
            "phone": "1234567890",
            "message": "Test booking message"
        }
        
        success, response = self.make_request('POST', f'/events/{self.test_event_id}/book', booking_data)
        if success:
            result = response.json()
            self.test_lead_id = result.get('lead_id')
            self.log_test("Book Event", True)
            
            # Test get user bookings
            success, response = self.make_request('GET', '/user/bookings')
            if success:
                self.log_test("Get User Bookings", True)
            else:
                self.log_test("Get User Bookings", False, f"Status: {response.status_code}")
        else:
            self.log_test("Book Event", False, f"Status: {response.status_code}")

    def test_mentor_leads_endpoints(self):
        """Test mentor leads endpoints"""
        print("\n🔍 Testing Mentor Leads Endpoints...")
        
        # Login as mentor
        self.make_request('POST', '/auth/login', self.mentor_creds, expected_status=200)
        
        # Test get mentor leads
        success, response = self.make_request('GET', '/mentor/leads')
        if success:
            self.log_test("Get Mentor Leads", True)
        else:
            self.log_test("Get Mentor Leads", False, f"Status: {response.status_code}")

    def test_admin_endpoints(self):
        """Test admin endpoints"""
        print("\n🔍 Testing Admin Endpoints...")
        
        # Login as admin
        success, response = self.make_request('POST', '/auth/login', self.admin_creds, expected_status=200)
        if not success:
            self.log_test("Admin Tests", False, "Failed to login as admin")
            return
        
        # Test get all users
        success, response = self.make_request('GET', '/admin/users')
        if success:
            self.log_test("Get All Users", True)
        else:
            self.log_test("Get All Users", False, f"Status: {response.status_code}")
        
        # Test get all mentors
        success, response = self.make_request('GET', '/admin/mentors')
        if success:
            mentors = response.json()
            self.log_test("Get All Mentors", True)
            
            # Test mentor verification if we have a mentor
            if mentors and self.test_mentor_id:
                verify_data = {"status": "APPROVED"}
                success, response = self.make_request('PUT', f'/admin/mentors/{self.test_mentor_id}/verify', verify_data)
                if success:
                    self.log_test("Verify Mentor", True)
                else:
                    self.log_test("Verify Mentor", False, f"Status: {response.status_code}")
        else:
            self.log_test("Get All Mentors", False, f"Status: {response.status_code}")
        
        # Test get all leads
        success, response = self.make_request('GET', '/admin/leads')
        if success:
            leads = response.json()
            self.log_test("Get All Leads", True)
            
            # Test lead verification if we have a lead
            if leads and self.test_lead_id:
                verify_data = {"status": "VERIFIED"}
                success, response = self.make_request('PUT', f'/admin/leads/{self.test_lead_id}/verify', verify_data)
                if success:
                    self.log_test("Verify Lead", True)
                else:
                    self.log_test("Verify Lead", False, f"Status: {response.status_code}")
        else:
            self.log_test("Get All Leads", False, f"Status: {response.status_code}")
        
        # Test analytics
        success, response = self.make_request('GET', '/admin/analytics')
        if success:
            self.log_test("Get Analytics", True)
        else:
            self.log_test("Get Analytics", False, f"Status: {response.status_code}")

    def test_role_based_access_control(self):
        """Test role-based access control"""
        print("\n🔍 Testing Role-Based Access Control...")
        
        # Login as user
        self.make_request('POST', '/auth/login', self.user_creds, expected_status=200)
        
        # Test user trying to access admin endpoint
        success, response = self.make_request('GET', '/admin/users', expected_status=403)
        if success:
            self.log_test("RBAC - User blocked from admin", True)
        else:
            self.log_test("RBAC - User blocked from admin", False, f"Status: {response.status_code}")
        
        # Test user trying to access mentor endpoint
        success, response = self.make_request('GET', '/mentor/profile', expected_status=403)
        if success:
            self.log_test("RBAC - User blocked from mentor", True)
        else:
            self.log_test("RBAC - User blocked from mentor", False, f"Status: {response.status_code}")

    def test_logout(self):
        """Test logout functionality"""
        print("\n🔍 Testing Logout...")
        
        if self.user_token:
            success, response = self.make_request('POST', '/auth/logout', token=self.user_token)
            if success:
                self.log_test("User Logout", True)
            else:
                self.log_test("User Logout", False, f"Status: {response.status_code}")

    def run_all_tests(self):
        """Run all tests in sequence"""
        print("🚀 Starting LeadBridge API Tests...")
        print(f"Testing against: {self.base_url}")
        
        # Run tests in logical order
        self.test_user_registration()
        self.test_authentication()
        self.test_auth_me_endpoint()
        self.test_events_endpoints()
        self.test_mentor_profile_endpoints()
        self.test_mentor_events_endpoints()
        self.test_booking_flow()
        self.test_mentor_leads_endpoints()
        self.test_admin_endpoints()
        self.test_role_based_access_control()
        self.test_logout()
        
        # Print summary
        print(f"\n📊 Test Summary:")
        print(f"Tests Run: {self.tests_run}")
        print(f"Tests Passed: {self.tests_passed}")
        print(f"Tests Failed: {len(self.failed_tests)}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run)*100:.1f}%")
        
        if self.failed_tests:
            print(f"\n❌ Failed Tests:")
            for failure in self.failed_tests:
                print(f"  - {failure['test']}: {failure['details']}")
        
        return self.tests_passed == self.tests_run

def main():
    tester = LeadBridgeAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())