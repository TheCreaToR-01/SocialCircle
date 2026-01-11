#!/usr/bin/env python3

import requests
import json
from datetime import datetime

def test_pass_lead_endpoint():
    """Test the pass lead endpoint specifically"""
    base_url = "https://networkhub-11.preview.emergentagent.com"
    session = requests.Session()
    session.headers.update({'Content-Type': 'application/json'})
    
    # Test credentials
    admin_creds = {"email": "admin@thesocialcircle.in", "password": "admin123"}
    mentor_creds = {"email": "chef.rajiv@thesocialcircle.in", "password": "host123"}
    user_creds = {"email": "amit.tech@gmail.com", "password": "guest123"}
    
    print("🔍 Testing Pass Lead Endpoint Flow...")
    
    # Step 1: Login as mentor to get their events
    print("Step 1: Getting mentor events...")
    response = session.post(f"{base_url}/api/auth/login", json=mentor_creds)
    if response.status_code != 200:
        print(f"❌ Failed to login as mentor: {response.status_code}")
        return False
    
    # Get mentor events
    response = session.get(f"{base_url}/api/mentor/events")
    if response.status_code != 200 or not response.json():
        print(f"❌ Failed to get mentor events: {response.status_code}")
        return False
    
    mentor_events = response.json()
    test_event = mentor_events[0]  # Use first event from this mentor
    test_event_id = test_event["event_id"]
    print(f"✅ Using mentor event: {test_event_id} - {test_event.get('title')}")
    
    # Step 2: Login as guest and create a lead
    print("Step 2: Creating lead as guest...")
    response = session.post(f"{base_url}/api/auth/login", json=user_creds)
    if response.status_code != 200:
        print(f"❌ Failed to login as guest: {response.status_code}")
        return False
    
    # Create booking
    timestamp = datetime.now().strftime('%H%M%S')
    booking_data = {
        "name": f"Pass Test User {timestamp}",
        "email": f"passtest{timestamp}@example.com",
        "phone": "9876543210",
        "message": "Test application for pass functionality"
    }
    
    response = session.post(f"{base_url}/api/events/{test_event_id}/book", json=booking_data)
    if response.status_code != 200:
        print(f"❌ Failed to create booking: {response.status_code}")
        print(f"Response: {response.text}")
        return False
    
    result = response.json()
    lead_id = result.get('lead_id')
    print(f"✅ Created lead: {lead_id}")
    
    # Step 3: Login as admin and verify lead
    print("Step 3: Verifying lead as admin...")
    response = session.post(f"{base_url}/api/auth/login", json=admin_creds)
    if response.status_code != 200:
        print(f"❌ Failed to login as admin: {response.status_code}")
        return False
    
    verify_data = {"status": "VERIFIED"}
    response = session.put(f"{base_url}/api/admin/leads/{lead_id}/verify", json=verify_data)
    if response.status_code != 200:
        print(f"❌ Failed to verify lead: {response.status_code}")
        print(f"Response: {response.text}")
        return False
    
    print(f"✅ Verified lead: {lead_id}")
    
    # Step 4: Login as mentor and purchase lead
    print("Step 4: Purchasing lead as mentor...")
    response = session.post(f"{base_url}/api/auth/login", json=mentor_creds)
    if response.status_code != 200:
        print(f"❌ Failed to login as mentor: {response.status_code}")
        return False
    
    # Check if lead is available for purchase
    response = session.get(f"{base_url}/api/mentor/leads")
    if response.status_code != 200:
        print(f"❌ Failed to get mentor leads: {response.status_code}")
        return False
    
    leads = response.json()
    target_lead = None
    for lead in leads:
        if lead.get('lead_id') == lead_id and lead.get('status') == 'VERIFIED':
            target_lead = lead
            break
    
    if not target_lead:
        print(f"❌ Lead not found in mentor leads or not verified")
        print(f"Available leads: {[l.get('lead_id') + ':' + l.get('status') for l in leads]}")
        return False
    
    # Purchase the lead
    response = session.post(f"{base_url}/api/mentor/leads/{lead_id}/purchase")
    if response.status_code != 200:
        print(f"❌ Failed to purchase lead: {response.status_code}")
        print(f"Response: {response.text}")
        return False
    
    purchase_result = response.json()
    demo_payment_code = purchase_result.get('demo_payment_code')
    payment_id = purchase_result.get('payment_id')
    print(f"✅ Initiated purchase: {payment_id}")
    
    # Complete payment
    payment_verify_data = {
        "demo_payment_code": demo_payment_code,
        "payment_id": payment_id
    }
    response = session.post(f"{base_url}/api/mentor/payment-verify", json=payment_verify_data)
    if response.status_code != 200:
        print(f"❌ Failed to complete payment: {response.status_code}")
        print(f"Response: {response.text}")
        return False
    
    print(f"✅ Completed payment for lead: {lead_id}")
    
    # Step 5: Test the PASS endpoint
    print("Step 5: Testing PASS endpoint...")
    response = session.post(f"{base_url}/api/mentor/leads/{lead_id}/pass")
    if response.status_code != 200:
        print(f"❌ Failed to pass lead: {response.status_code}")
        print(f"Response: {response.text}")
        return False
    
    pass_result = response.json()
    print(f"✅ Pass endpoint successful: {pass_result}")
    
    # Step 6: Verify lead status changed
    print("Step 6: Verifying lead status...")
    response = session.get(f"{base_url}/api/mentor/leads")
    if response.status_code != 200:
        print(f"❌ Failed to get leads after pass: {response.status_code}")
        return False
    
    leads = response.json()
    passed_lead = None
    for lead in leads:
        if lead.get('lead_id') == lead_id:
            passed_lead = lead
            break
    
    if passed_lead and passed_lead.get('status') == 'PASSED':
        print(f"✅ Lead status correctly changed to PASSED")
        return True
    else:
        print(f"❌ Lead status not changed correctly. Current status: {passed_lead.get('status') if passed_lead else 'Lead not found'}")
        return False

if __name__ == "__main__":
    success = test_pass_lead_endpoint()
    if success:
        print("\n🎉 Pass Lead Endpoint Test PASSED!")
    else:
        print("\n💥 Pass Lead Endpoint Test FAILED!")