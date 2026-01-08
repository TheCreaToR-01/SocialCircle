#!/usr/bin/env python3
"""
Focused test for The Social Circle Guest Selection & Ticketing Flow
Tests the specific endpoints mentioned in the review request
"""

import requests
import json
from datetime import datetime

class TicketingFlowTester:
    def __init__(self):
        self.base_url = "https://networkhub-11.preview.emergentagent.com"
        self.session = requests.Session()
        self.session.headers.update({'Content-Type': 'application/json'})
        
        # Test credentials from review request
        self.admin_creds = {"email": "admin@thesocialcircle.in", "password": "admin123"}
        self.host_creds = {"email": "chef.rajiv@thesocialcircle.in", "password": "host123"}
        self.guest_creds = {"email": "amit.tech@gmail.com", "password": "guest123"}
        
        self.test_data = {}

    def login(self, credentials):
        """Login and return success status"""
        response = self.session.post(f"{self.base_url}/api/auth/login", json=credentials)
        return response.status_code == 200, response

    def test_complete_flow(self):
        """Test the complete guest selection and ticketing flow"""
        print("🎯 Testing Complete Guest Selection & Ticketing Flow")
        print("=" * 60)
        
        # Step 1: Guest applies to event
        print("\n1️⃣ Guest Application Flow")
        success, response = self.login(self.guest_creds)
        if not success:
            print("❌ Failed to login as guest")
            return False
        print("✅ Guest logged in successfully")
        
        # Get events
        response = self.session.get(f"{self.base_url}/api/events")
        if response.status_code != 200:
            print("❌ Failed to get events")
            return False
        
        events = response.json()
        if not events:
            print("❌ No events available")
            return False
        
        # Find Farm-to-Table event or use first available
        target_event = None
        for event in events:
            if "Farm-to-Table" in event.get("title", "") or "Dinner" in event.get("title", ""):
                target_event = event
                break
        
        if not target_event:
            target_event = events[0]
        
        print(f"✅ Found event: {target_event['title']}")
        self.test_data['event_id'] = target_event['event_id']
        
        # Apply to event
        booking_data = {
            "name": "Amit Kumar",
            "email": "amit.tech@gmail.com", 
            "phone": "9876543210",
            "message": "Excited to attend this culinary experience!"
        }
        
        response = self.session.post(f"{self.base_url}/api/events/{self.test_data['event_id']}/book", json=booking_data)
        if response.status_code != 200:
            print(f"❌ Failed to book event: {response.status_code}")
            return False
        
        result = response.json()
        self.test_data['lead_id'] = result['lead_id']
        print(f"✅ Event booked successfully, Lead ID: {self.test_data['lead_id']}")
        
        # Verify in user bookings
        response = self.session.get(f"{self.base_url}/api/user/bookings")
        if response.status_code == 200:
            bookings = response.json()
            found = any(b.get('lead_id') == self.test_data['lead_id'] for b in bookings)
            print(f"✅ Application verified in user bookings: {found}")
        
        # Step 2: Admin verification
        print("\n2️⃣ Admin Verification Flow")
        success, response = self.login(self.admin_creds)
        if not success:
            print("❌ Failed to login as admin")
            return False
        print("✅ Admin logged in successfully")
        
        # Get all leads
        response = self.session.get(f"{self.base_url}/api/admin/leads")
        if response.status_code != 200:
            print("❌ Failed to get admin leads")
            return False
        print("✅ Retrieved admin leads")
        
        # Verify the lead
        verify_data = {"status": "VERIFIED"}
        response = self.session.put(f"{self.base_url}/api/admin/leads/{self.test_data['lead_id']}/verify", json=verify_data)
        if response.status_code != 200:
            print(f"❌ Failed to verify lead: {response.status_code}")
            return False
        print("✅ Lead verified by admin")
        
        # Step 3: Host purchase lead
        print("\n3️⃣ Host Purchase Flow")
        success, response = self.login(self.host_creds)
        if not success:
            print("❌ Failed to login as host")
            return False
        print("✅ Host logged in successfully")
        
        # Get mentor leads
        response = self.session.get(f"{self.base_url}/api/mentor/leads")
        if response.status_code != 200:
            print("❌ Failed to get mentor leads")
            return False
        
        leads = response.json()
        verified_lead = None
        for lead in leads:
            if lead.get('lead_id') == self.test_data['lead_id'] and lead.get('status') == 'VERIFIED':
                verified_lead = lead
                break
        
        if not verified_lead:
            print("❌ Verified lead not found in mentor leads")
            return False
        print("✅ Found verified lead in mentor dashboard")
        
        # Purchase lead
        response = self.session.post(f"{self.base_url}/api/mentor/leads/{self.test_data['lead_id']}/purchase")
        if response.status_code != 200:
            print(f"❌ Failed to purchase lead: {response.status_code}")
            return False
        
        purchase_result = response.json()
        demo_code = purchase_result['demo_payment_code']
        payment_id = purchase_result['payment_id']
        print(f"✅ Lead purchase initiated, Demo code: {demo_code}")
        
        # Complete payment
        payment_data = {
            "demo_payment_code": demo_code,
            "payment_id": payment_id
        }
        response = self.session.post(f"{self.base_url}/api/mentor/payment-verify", json=payment_data)
        if response.status_code != 200:
            print(f"❌ Failed to verify payment: {response.status_code}")
            return False
        print("✅ Payment verified, lead purchased")
        
        # Step 4: Host invites guest (NEW FUNCTIONALITY)
        print("\n4️⃣ Host Invite Guest Flow (NEW)")
        invite_data = {"ticket_price": 3500}
        response = self.session.post(f"{self.base_url}/api/mentor/leads/{self.test_data['lead_id']}/invite", json=invite_data)
        if response.status_code != 200:
            print(f"❌ Failed to invite guest: {response.status_code}")
            return False
        
        invite_result = response.json()
        self.test_data['invitation_id'] = invite_result['invitation_id']
        print(f"✅ Guest invited successfully, Invitation ID: {self.test_data['invitation_id']}")
        
        # Verify in host invitations
        response = self.session.get(f"{self.base_url}/api/mentor/invitations")
        if response.status_code == 200:
            invitations = response.json()
            found = any(inv.get('invitation_id') == self.test_data['invitation_id'] for inv in invitations)
            print(f"✅ Invitation verified in host dashboard: {found}")
        
        # Step 5: Guest receives invitation (NEW FUNCTIONALITY)
        print("\n5️⃣ Guest Receives Invitation Flow (NEW)")
        success, response = self.login(self.guest_creds)
        if not success:
            print("❌ Failed to login as guest")
            return False
        print("✅ Guest logged in successfully")
        
        # Check invitations
        response = self.session.get(f"{self.base_url}/api/user/invitations")
        if response.status_code != 200:
            print(f"❌ Failed to get user invitations: {response.status_code}")
            return False
        
        invitations = response.json()
        pending_invitation = None
        for inv in invitations:
            if inv.get('invitation_id') == self.test_data['invitation_id'] and inv.get('status') == 'PENDING':
                pending_invitation = inv
                break
        
        if not pending_invitation:
            print("❌ Pending invitation not found")
            return False
        
        print(f"✅ Invitation received with ticket price: ₹{pending_invitation['ticket_price']}")
        
        # Step 6: Guest pays for ticket (NEW FUNCTIONALITY)
        print("\n6️⃣ Guest Ticket Payment Flow (NEW)")
        response = self.session.post(f"{self.base_url}/api/user/invitations/{self.test_data['invitation_id']}/pay")
        if response.status_code != 200:
            print(f"❌ Failed to initiate ticket payment: {response.status_code}")
            return False
        
        payment_result = response.json()
        ticket_demo_code = payment_result['demo_payment_code']
        ticket_payment_id = payment_result['payment_id']
        print(f"✅ Ticket payment initiated, Demo code: {ticket_demo_code}")
        
        # Complete ticket payment
        ticket_payment_data = {
            "demo_payment_code": ticket_demo_code,
            "payment_id": ticket_payment_id
        }
        response = self.session.post(f"{self.base_url}/api/user/ticket-payment-verify", json=ticket_payment_data)
        if response.status_code != 200:
            print(f"❌ Failed to verify ticket payment: {response.status_code}")
            return False
        
        ticket_result = response.json()
        self.test_data['ticket_id'] = ticket_result['ticket_id']
        print(f"✅ Ticket payment verified, Ticket ID: {self.test_data['ticket_id']}")
        
        # Verify ticket creation
        response = self.session.get(f"{self.base_url}/api/user/tickets")
        if response.status_code == 200:
            tickets = response.json()
            found_ticket = None
            for ticket in tickets:
                if ticket.get('ticket_id') == self.test_data['ticket_id']:
                    found_ticket = ticket
                    break
            
            if found_ticket:
                print(f"✅ Ticket created successfully with status: {found_ticket['status']}")
                print(f"   Event: {found_ticket.get('event_title', 'Unknown')}")
                print(f"   Price: ₹{found_ticket.get('ticket_price', 0)}")
            else:
                print("❌ Ticket not found in user tickets")
                return False
        
        print("\n🎉 COMPLETE FLOW SUCCESSFUL!")
        print("=" * 60)
        return True

    def test_key_endpoints(self):
        """Test the key new endpoints individually"""
        print("\n🔍 Testing Key New Endpoints")
        print("=" * 40)
        
        endpoints_tested = []
        
        # Test as host
        success, response = self.login(self.host_creds)
        if success:
            # Test host invitations endpoint
            response = self.session.get(f"{self.base_url}/api/mentor/invitations")
            status = "✅" if response.status_code == 200 else "❌"
            endpoints_tested.append(f"{status} GET /api/mentor/invitations - {response.status_code}")
        
        # Test as guest
        success, response = self.login(self.guest_creds)
        if success:
            # Test guest invitations endpoint
            response = self.session.get(f"{self.base_url}/api/user/invitations")
            status = "✅" if response.status_code == 200 else "❌"
            endpoints_tested.append(f"{status} GET /api/user/invitations - {response.status_code}")
            
            # Test guest tickets endpoint
            response = self.session.get(f"{self.base_url}/api/user/tickets")
            status = "✅" if response.status_code == 200 else "❌"
            endpoints_tested.append(f"{status} GET /api/user/tickets - {response.status_code}")
        
        for endpoint in endpoints_tested:
            print(endpoint)
        
        return True

def main():
    tester = TicketingFlowTester()
    
    print("🚀 The Social Circle - Guest Selection & Ticketing Flow Test")
    print("Backend URL:", tester.base_url)
    print("Testing with real credentials from review request")
    
    # Test complete flow
    flow_success = tester.test_complete_flow()
    
    # Test key endpoints
    endpoint_success = tester.test_key_endpoints()
    
    if flow_success and endpoint_success:
        print("\n🎯 ALL TESTS PASSED! The ticketing flow is working correctly.")
        return 0
    else:
        print("\n❌ Some tests failed.")
        return 1

if __name__ == "__main__":
    exit(main())