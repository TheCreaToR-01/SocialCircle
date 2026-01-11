#!/usr/bin/env python3

import requests
import json

def debug_events_and_mentors():
    """Debug events and mentors to understand the relationship"""
    base_url = "https://networkhub-11.preview.emergentagent.com"
    session = requests.Session()
    session.headers.update({'Content-Type': 'application/json'})
    
    admin_creds = {"email": "admin@thesocialcircle.in", "password": "admin123"}
    mentor_creds = {"email": "chef.rajiv@thesocialcircle.in", "password": "host123"}
    
    print("🔍 Debugging Events and Mentors...")
    
    # Login as admin
    response = session.post(f"{base_url}/api/auth/login", json=admin_creds)
    if response.status_code != 200:
        print(f"❌ Failed to login as admin: {response.status_code}")
        return
    
    # Get all events
    response = session.get(f"{base_url}/api/events")
    if response.status_code == 200:
        events = response.json()
        print(f"📅 Found {len(events)} events:")
        for event in events:
            print(f"  - {event.get('event_id')}: {event.get('title')} (mentor: {event.get('mentor_id')})")
    else:
        print(f"❌ Failed to get events: {response.status_code}")
        return
    
    # Get all mentors
    response = session.get(f"{base_url}/api/admin/mentors")
    if response.status_code == 200:
        mentors = response.json()
        print(f"\n👨‍🏫 Found {len(mentors)} mentors:")
        for mentor in mentors:
            print(f"  - {mentor.get('mentor_id')}: {mentor.get('user_id')} (status: {mentor.get('verification_status')})")
    else:
        print(f"❌ Failed to get mentors: {response.status_code}")
        return
    
    # Login as the test mentor and check their profile
    response = session.post(f"{base_url}/api/auth/login", json=mentor_creds)
    if response.status_code == 200:
        print(f"\n✅ Logged in as mentor")
        
        # Get mentor profile
        response = session.get(f"{base_url}/api/mentor/profile")
        if response.status_code == 200:
            profile = response.json()
            print(f"🏷️ Mentor profile: {profile.get('mentor_id')} (status: {profile.get('verification_status')})")
            
            # Get mentor events
            response = session.get(f"{base_url}/api/mentor/events")
            if response.status_code == 200:
                mentor_events = response.json()
                print(f"📅 Mentor has {len(mentor_events)} events:")
                for event in mentor_events:
                    print(f"  - {event.get('event_id')}: {event.get('title')}")
            else:
                print(f"❌ Failed to get mentor events: {response.status_code}")
        else:
            print(f"❌ Failed to get mentor profile: {response.status_code}")
    else:
        print(f"❌ Failed to login as mentor: {response.status_code}")

if __name__ == "__main__":
    debug_events_and_mentors()