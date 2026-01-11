import requests
import sys
import json
from datetime import datetime, timezone, timedelta
import uuid

class LeadBridgeAPITester:
    def __init__(self, base_url="https://networkhub-11.preview.emergentagent.com"):
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({'Content-Type': 'application/json'})
        
        # Test credentials from review request
        self.admin_creds = {"email": "admin@thesocialcircle.in", "password": "admin123"}
        self.mentor_creds = {"email": "chef.rajiv@thesocialcircle.in", "password": "host123"}
        self.user_creds = {"email": "amit.tech@gmail.com", "password": "guest123"}
        
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
        self.test_invitation_id = None
        self.test_ticket_id = None
        self.test_payment_id = None
        
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

    def test_login_without_email_verification(self):
        """Test NEW FEATURE: Login without email verification"""
        print("\n🔍 Testing Login Without Email Verification...")
        
        # Register a new user
        timestamp = datetime.now().strftime('%H%M%S')
        test_user_data = {
            "name": f"Test User {timestamp}",
            "email": f"testuser{timestamp}@example.com",
            "password": "testpass123",
            "role": "USER"
        }
        
        success, response = self.make_request('POST', '/auth/register', test_user_data, expected_status=200)
        if success:
            register_result = response.json()
            # Check that email_verified is false but registration succeeded
            if register_result.get('email_verified') == False:
                self.log_test("Registration with email_verified=false", True)
                
                # Now try to login immediately without verifying email
                login_data = {
                    "email": test_user_data["email"],
                    "password": test_user_data["password"]
                }
                
                success, response = self.make_request('POST', '/auth/login', login_data, expected_status=200)
                if success:
                    login_result = response.json()
                    self.log_test("Login without email verification", True)
                    
                    # Verify we can access protected endpoints
                    success, response = self.make_request('GET', '/auth/me')
                    if success:
                        me_result = response.json()
                        if me_result.get('email') == test_user_data["email"]:
                            self.log_test("Access protected endpoint without email verification", True)
                        else:
                            self.log_test("Access protected endpoint without email verification", False, "Wrong user data")
                    else:
                        self.log_test("Access protected endpoint without email verification", False, f"Status: {response.status_code}")
                else:
                    self.log_test("Login without email verification", False, f"Status: {response.status_code}")
            else:
                self.log_test("Registration with email_verified=false", False, f"email_verified: {register_result.get('email_verified')}")
        else:
            self.log_test("Registration for login test", False, f"Status: {response.status_code}")

    def test_projected_revenue_endpoint(self):
        """Test NEW FEATURE: Projected revenue endpoint"""
        print("\n🔍 Testing Projected Revenue Endpoint...")
        
        # Login as mentor/host
        success, response = self.make_request('POST', '/auth/login', self.mentor_creds, expected_status=200)
        if not success:
            self.log_test("Projected Revenue Tests", False, "Failed to login as mentor")
            return
        
        # Test the projected revenue endpoint
        success, response = self.make_request('GET', '/mentor/leads/projected-revenue')
        if success:
            revenue_data = response.json()
            
            # Check response structure
            required_fields = ['projected_data', 'total_leads', 'total_potential_revenue']
            has_all_fields = all(field in revenue_data for field in required_fields)
            
            if has_all_fields:
                self.log_test("Projected Revenue Endpoint Structure", True)
                
                # Check if projected_data is an array
                if isinstance(revenue_data.get('projected_data'), list):
                    self.log_test("Projected Revenue Data Array", True)
                    
                    # Check numeric fields
                    total_leads = revenue_data.get('total_leads', 0)
                    total_revenue = revenue_data.get('total_potential_revenue', 0)
                    
                    if isinstance(total_leads, int) and isinstance(total_revenue, (int, float)):
                        self.log_test("Projected Revenue Numeric Fields", True)
                        
                        # If we have projected data, check structure
                        projected_data = revenue_data.get('projected_data', [])
                        if projected_data:
                            first_item = projected_data[0]
                            item_fields = ['event_id', 'event_title', 'lead_count', 'price_per_lead', 'potential_revenue']
                            has_item_fields = all(field in first_item for field in item_fields)
                            
                            if has_item_fields:
                                self.log_test("Projected Revenue Item Structure", True)
                            else:
                                self.log_test("Projected Revenue Item Structure", False, f"Missing fields in item")
                        else:
                            self.log_test("Projected Revenue Item Structure", True, "No data items (acceptable)")
                    else:
                        self.log_test("Projected Revenue Numeric Fields", False, f"Invalid types: leads={type(total_leads)}, revenue={type(total_revenue)}")
                else:
                    self.log_test("Projected Revenue Data Array", False, f"projected_data type: {type(revenue_data.get('projected_data'))}")
            else:
                missing_fields = [field for field in required_fields if field not in revenue_data]
                self.log_test("Projected Revenue Endpoint Structure", False, f"Missing fields: {missing_fields}")
        else:
            self.log_test("Projected Revenue Endpoint", False, f"Status: {response.status_code}")

    def test_pass_lead_endpoint(self):
        """Test NEW FEATURE: Pass lead endpoint"""
        print("\n🔍 Testing Pass Lead Endpoint...")
        
        # First, we need to create a complete flow to get a purchased lead
        # Step 1: Login as mentor to get their events
        success, response = self.make_request('POST', '/auth/login', self.mentor_creds, expected_status=200)
        if not success:
            self.log_test("Pass Lead Tests", False, "Failed to login as mentor")
            return
        
        # Get mentor events
        success, response = self.make_request('GET', '/mentor/events')
        if not success or not response.json():
            self.log_test("Pass Lead Tests", False, "No mentor events available")
            return
        
        mentor_events = response.json()
        test_event = mentor_events[0]
        test_event_id = test_event["event_id"]
        
        # Step 2: Create a lead as guest
        success, response = self.make_request('POST', '/auth/login', self.user_creds, expected_status=200)
        if not success:
            self.log_test("Pass Lead Tests", False, "Failed to login as guest")
            return
        
        # Apply to mentor's event
        timestamp = datetime.now().strftime('%H%M%S')
        booking_data = {
            "name": f"Pass Test User {timestamp}",
            "email": f"passtest{timestamp}@example.com",
            "phone": "9876543210",
            "message": "Test application for pass functionality"
        }
        
        success, response = self.make_request('POST', f'/events/{test_event_id}/book', booking_data)
        if not success:
            self.log_test("Pass Lead Tests", False, "Failed to create lead")
            return
        
        result = response.json()
        pass_test_lead_id = result.get('lead_id')
        
        # Step 3: Admin verifies the lead
        success, response = self.make_request('POST', '/auth/login', self.admin_creds, expected_status=200)
        if not success:
            self.log_test("Pass Lead Tests", False, "Failed to login as admin")
            return
        
        verify_data = {"status": "VERIFIED"}
        success, response = self.make_request('PUT', f'/admin/leads/{pass_test_lead_id}/verify', verify_data)
        if not success:
            self.log_test("Pass Lead Tests", False, "Failed to verify lead")
            return
        
        # Step 4: Host purchases the lead
        success, response = self.make_request('POST', '/auth/login', self.mentor_creds, expected_status=200)
        if not success:
            self.log_test("Pass Lead Tests", False, "Failed to login as host")
            return
        
        success, response = self.make_request('POST', f'/mentor/leads/{pass_test_lead_id}/purchase')
        if not success:
            self.log_test("Pass Lead Tests", False, "Failed to purchase lead")
            return
        
        purchase_result = response.json()
        demo_payment_code = purchase_result.get('demo_payment_code')
        payment_id = purchase_result.get('payment_id')
        
        # Complete payment
        payment_verify_data = {
            "demo_payment_code": demo_payment_code,
            "payment_id": payment_id
        }
        success, response = self.make_request('POST', '/mentor/payment-verify', payment_verify_data)
        if not success:
            self.log_test("Pass Lead Tests", False, "Failed to complete payment")
            return
        
        # Step 5: Now test the PASS endpoint
        success, response = self.make_request('POST', f'/mentor/leads/{pass_test_lead_id}/pass')
        if success:
            self.log_test("Pass Lead Endpoint", True)
            
            # Verify lead status changed to PASSED via admin endpoint
            success, response = self.make_request('POST', '/auth/login', self.admin_creds, expected_status=200)
            if success:
                success, response = self.make_request('GET', '/admin/leads')
                if success:
                    all_leads = response.json()
                    passed_lead = None
                    for lead in all_leads:
                        if lead.get('lead_id') == pass_test_lead_id:
                            passed_lead = lead
                            break
                    
                    if passed_lead and passed_lead.get('status') == 'PASSED':
                        self.log_test("Lead Status Changed to PASSED", True)
                    else:
                        self.log_test("Lead Status Changed to PASSED", False, f"Status: {passed_lead.get('status') if passed_lead else 'Lead not found'}")
                else:
                    self.log_test("Lead Status Changed to PASSED", False, f"Failed to get all leads: {response.status_code}")
            else:
                self.log_test("Lead Status Changed to PASSED", False, "Failed to login as admin for verification")
        else:
            self.log_test("Pass Lead Endpoint", False, f"Status: {response.status_code}")
        
        # Test unauthorized access (user trying to pass a lead)
        success, response = self.make_request('POST', '/auth/login', self.user_creds, expected_status=200)
        if success:
            success, response = self.make_request('POST', f'/mentor/leads/{pass_test_lead_id}/pass', expected_status=403)
            if success:
                self.log_test("RBAC - User blocked from pass endpoint", True)
            else:
                self.log_test("RBAC - User blocked from pass endpoint", False, f"Status: {response.status_code}")

    def test_logout(self):
        """Test logout functionality"""
        print("\n🔍 Testing Logout...")
        
        # Login as user first
        self.make_request('POST', '/auth/login', self.user_creds, expected_status=200)
        
        # Test logout
        success, response = self.make_request('POST', '/auth/logout')
        if success:
            self.log_test("User Logout", True)
        else:
            self.log_test("User Logout", False, f"Status: {response.status_code}")

    def test_guest_selection_ticketing_flow(self):
        """Test the complete guest selection and ticketing flow"""
        print("\n🔍 Testing Guest Selection & Ticketing Flow...")
        
        # Step 1: Guest applies to an event (existing functionality)
        print("Step 1: Guest applies to event...")
        success, response = self.make_request('POST', '/auth/login', self.user_creds, expected_status=200)
        if not success:
            self.log_test("Guest Selection Flow", False, "Failed to login as guest")
            return
        
        # Get available events first
        success, response = self.make_request('GET', '/events')
        if not success or not response.json():
            self.log_test("Guest Selection Flow", False, "No events available")
            return
        
        events = response.json()
        target_event = None
        for event in events:
            if "Farm-to-Table" in event.get("title", "") or "Dinner" in event.get("title", ""):
                target_event = event
                break
        
        if not target_event:
            target_event = events[0]  # Use first available event
        
        self.test_event_id = target_event["event_id"]
        
        # Apply to event
        booking_data = {
            "name": "Amit Kumar",
            "email": "amit.tech@gmail.com",
            "phone": "9876543210",
            "message": "Excited to attend this event!"
        }
        
        success, response = self.make_request('POST', f'/events/{self.test_event_id}/book', booking_data)
        if success:
            result = response.json()
            self.test_lead_id = result.get('lead_id')
            self.log_test("Guest Application", True)
        else:
            self.log_test("Guest Application", False, f"Status: {response.status_code}")
            return
        
        # Verify application in user bookings
        success, response = self.make_request('GET', '/user/bookings')
        if success:
            bookings = response.json()
            found_booking = any(b.get('lead_id') == self.test_lead_id for b in bookings)
            self.log_test("Verify Application in User Bookings", found_booking)
        else:
            self.log_test("Verify Application in User Bookings", False, f"Status: {response.status_code}")
        
        # Step 2: Admin verifies the lead
        print("Step 2: Admin verifies lead...")
        success, response = self.make_request('POST', '/auth/login', self.admin_creds, expected_status=200)
        if not success:
            self.log_test("Admin Verification", False, "Failed to login as admin")
            return
        
        # Get all leads
        success, response = self.make_request('GET', '/admin/leads')
        if success:
            self.log_test("Get All Leads", True)
            
            # Verify the specific lead
            verify_data = {"status": "VERIFIED"}
            success, response = self.make_request('PUT', f'/admin/leads/{self.test_lead_id}/verify', verify_data)
            if success:
                self.log_test("Admin Lead Verification", True)
            else:
                self.log_test("Admin Lead Verification", False, f"Status: {response.status_code}")
        else:
            self.log_test("Get All Leads", False, f"Status: {response.status_code}")
            return
        
        # Step 3: Host purchases the lead
        print("Step 3: Host purchases lead...")
        success, response = self.make_request('POST', '/auth/login', self.mentor_creds, expected_status=200)
        if not success:
            self.log_test("Host Purchase", False, "Failed to login as host")
            return
        
        # Get mentor leads
        success, response = self.make_request('GET', '/mentor/leads')
        if success:
            leads = response.json()
            verified_lead = None
            for lead in leads:
                if lead.get('lead_id') == self.test_lead_id and lead.get('status') == 'VERIFIED':
                    verified_lead = lead
                    break
            
            if verified_lead:
                self.log_test("Get Verified Leads", True)
                
                # Purchase the lead
                success, response = self.make_request('POST', f'/mentor/leads/{self.test_lead_id}/purchase')
                if success:
                    purchase_result = response.json()
                    demo_payment_code = purchase_result.get('demo_payment_code')
                    self.test_payment_id = purchase_result.get('payment_id')
                    self.log_test("Host Purchase Lead", True)
                    
                    # Complete demo payment
                    payment_verify_data = {
                        "demo_payment_code": demo_payment_code,
                        "payment_id": self.test_payment_id
                    }
                    success, response = self.make_request('POST', '/mentor/payment-verify', payment_verify_data)
                    if success:
                        self.log_test("Host Payment Verification", True)
                    else:
                        self.log_test("Host Payment Verification", False, f"Status: {response.status_code}")
                        return
                else:
                    self.log_test("Host Purchase Lead", False, f"Status: {response.status_code}")
                    return
            else:
                self.log_test("Get Verified Leads", False, "No verified lead found")
                return
        else:
            self.log_test("Get Mentor Leads", False, f"Status: {response.status_code}")
            return
        
        # Step 4: Host invites guest (NEW FUNCTIONALITY)
        print("Step 4: Host invites guest...")
        invite_data = {"ticket_price": 3500}
        success, response = self.make_request('POST', f'/mentor/leads/{self.test_lead_id}/invite', invite_data)
        if success:
            invite_result = response.json()
            self.test_invitation_id = invite_result.get('invitation_id')
            self.log_test("Host Invite Guest", True)
            
            # Verify invitation in host's invitations
            success, response = self.make_request('GET', '/mentor/invitations')
            if success:
                invitations = response.json()
                found_invitation = any(inv.get('invitation_id') == self.test_invitation_id for inv in invitations)
                self.log_test("Verify Invitation in Host Dashboard", found_invitation)
            else:
                self.log_test("Verify Invitation in Host Dashboard", False, f"Status: {response.status_code}")
        else:
            self.log_test("Host Invite Guest", False, f"Status: {response.status_code}")
            return
        
        # Step 5: Guest receives invitation (NEW FUNCTIONALITY)
        print("Step 5: Guest receives invitation...")
        success, response = self.make_request('POST', '/auth/login', self.user_creds, expected_status=200)
        if not success:
            self.log_test("Guest Invitation Check", False, "Failed to login as guest")
            return
        
        success, response = self.make_request('GET', '/user/invitations')
        if success:
            invitations = response.json()
            pending_invitation = None
            for inv in invitations:
                if inv.get('invitation_id') == self.test_invitation_id and inv.get('status') == 'PENDING':
                    pending_invitation = inv
                    break
            
            if pending_invitation:
                self.log_test("Guest Receives Invitation", True)
                
                # Verify invitation details
                if pending_invitation.get('ticket_price') == 3500:
                    self.log_test("Invitation Ticket Price Correct", True)
                else:
                    self.log_test("Invitation Ticket Price Correct", False, f"Expected 3500, got {pending_invitation.get('ticket_price')}")
            else:
                self.log_test("Guest Receives Invitation", False, "No pending invitation found")
                return
        else:
            self.log_test("Guest Receives Invitation", False, f"Status: {response.status_code}")
            return
        
        # Step 6: Guest pays for ticket (NEW FUNCTIONALITY)
        print("Step 6: Guest pays for ticket...")
        success, response = self.make_request('POST', f'/user/invitations/{self.test_invitation_id}/pay')
        if success:
            payment_result = response.json()
            ticket_demo_code = payment_result.get('demo_payment_code')
            ticket_payment_id = payment_result.get('payment_id')
            self.log_test("Guest Initiate Ticket Payment", True)
            
            # Complete ticket payment
            ticket_payment_verify_data = {
                "demo_payment_code": ticket_demo_code,
                "payment_id": ticket_payment_id
            }
            success, response = self.make_request('POST', '/user/ticket-payment-verify', ticket_payment_verify_data)
            if success:
                ticket_result = response.json()
                self.test_ticket_id = ticket_result.get('ticket_id')
                self.log_test("Guest Ticket Payment Verification", True)
                
                # Verify ticket is created
                success, response = self.make_request('GET', '/user/tickets')
                if success:
                    tickets = response.json()
                    found_ticket = any(t.get('ticket_id') == self.test_ticket_id for t in tickets)
                    if found_ticket:
                        self.log_test("Verify Ticket Created", True)
                        
                        # Check ticket details
                        ticket = next((t for t in tickets if t.get('ticket_id') == self.test_ticket_id), None)
                        if ticket and ticket.get('status') == 'CONFIRMED':
                            self.log_test("Ticket Status Confirmed", True)
                        else:
                            self.log_test("Ticket Status Confirmed", False, f"Status: {ticket.get('status') if ticket else 'Not found'}")
                    else:
                        self.log_test("Verify Ticket Created", False, "Ticket not found in user tickets")
                else:
                    self.log_test("Verify Ticket Created", False, f"Status: {response.status_code}")
            else:
                self.log_test("Guest Ticket Payment Verification", False, f"Status: {response.status_code}")
        else:
            self.log_test("Guest Initiate Ticket Payment", False, f"Status: {response.status_code}")
        
        print("✅ Guest Selection & Ticketing Flow Complete!")

    def test_new_ticketing_endpoints(self):
        """Test all new ticketing endpoints individually"""
        print("\n🔍 Testing New Ticketing Endpoints...")
        
        # Test host invitations endpoint
        success, response = self.make_request('POST', '/auth/login', self.mentor_creds, expected_status=200)
        if success:
            success, response = self.make_request('GET', '/mentor/invitations')
            if success:
                self.log_test("GET /mentor/invitations", True)
            else:
                self.log_test("GET /mentor/invitations", False, f"Status: {response.status_code}")
        
        # Test guest invitations endpoint
        success, response = self.make_request('POST', '/auth/login', self.user_creds, expected_status=200)
        if success:
            success, response = self.make_request('GET', '/user/invitations')
            if success:
                self.log_test("GET /user/invitations", True)
            else:
                self.log_test("GET /user/invitations", False, f"Status: {response.status_code}")
            
            # Test guest tickets endpoint
            success, response = self.make_request('GET', '/user/tickets')
            if success:
                self.log_test("GET /user/tickets", True)
            else:
                self.log_test("GET /user/tickets", False, f"Status: {response.status_code}")
        
        # Test unauthorized access
        success, response = self.make_request('POST', '/auth/login', self.user_creds, expected_status=200)
        if success:
            # User trying to access host invitations
            success, response = self.make_request('GET', '/mentor/invitations', expected_status=403)
            if success:
                self.log_test("RBAC - User blocked from host invitations", True)
            else:
                self.log_test("RBAC - User blocked from host invitations", False, f"Status: {response.status_code}")

    def run_all_tests(self):
        """Run all tests in sequence"""
        print("🚀 Starting The Social Circle API Tests...")
        print(f"Testing against: {self.base_url}")
        
        # Run tests in logical order
        self.test_user_registration()
        self.test_authentication()
        
        # NEW FEATURES TESTING
        self.test_login_without_email_verification()
        self.test_projected_revenue_endpoint()
        self.test_pass_lead_endpoint()
        
        self.test_auth_me_endpoint()
        self.test_events_endpoints()
        self.test_mentor_profile_endpoints()
        self.test_mentor_events_endpoints()
        self.test_booking_flow()
        self.test_mentor_leads_endpoints()
        self.test_admin_endpoints()
        self.test_role_based_access_control()
        
        # NEW: Test guest selection and ticketing flow
        self.test_guest_selection_ticketing_flow()
        self.test_new_ticketing_endpoints()
        
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