# The Social Circle - Complete Testing Flow Guide

## 🔑 Testing Credentials

### Admin Account
```
Email: admin@thesocialcircle.in
Password: admin123
Dashboard: https://your-app.com/admin/dashboard
```

### Host Account (Approved)
```
Email: mentor@leadbridge.com
Password: mentor123
Dashboard: https://your-app.com/mentor/dashboard
```

### Guest Account
```
Email: user@leadbridge.com
Password: user123
Dashboard: https://your-app.com/user/dashboard
```

---

## 📱 Complete User Flows

### FLOW 1: Guest Journey (Attendee)

#### Step 1: Browse Events (No Login Required)
1. Open homepage: `https://your-app.com`
2. **You should see:**
   - "The Social Circle" logo with "S" icon
   - Hero section: "Real Connections. Curated Dinners."
   - Badge: "LAUNCHING IN DELHI NCR"
   - Stats: "+120 Professionals Joined"
3. Scroll down to **"Featured Experiences"** section
4. **Events are visible without login** - you can see:
   - Event title
   - Host name
   - Price per person
   - Available slots
   - Duration
   - Category

#### Step 2: View Event Details
1. Click on any event card (e.g., "Web Development Masterclass")
2. **You should see:**
   - Full event description
   - Host information
   - Date and time
   - Duration
   - Price
   - Available slots
   - "Apply to Dinner" button

#### Step 3: Apply to Event (Requires Login)
1. Click **"Apply to Dinner"** button
2. **You will be redirected to Login page** (if not logged in)
3. Options:
   - **Login** if you have an account
   - **Sign Up** to create new account

#### Step 4: Sign Up as Guest
1. Click **"Sign Up"** or navigate to `/signup`
2. Fill the form:
   ```
   Full Name: Test Guest
   Email: testguest@example.com
   Password: test123
   I want to: Attend Dinners (Guest)
   ```
3. Click **"Sign Up with Email"**
4. **You should see:**
   - Success message
   - Email sent notification
5. **Check your email** (if Resend API key is configured)
   - Subject: "Verify Your Social Circle Account"
   - Click verification link
6. After verification, you're redirected to login

#### Step 5: Login as Guest
1. Navigate to `/login`
2. Enter credentials:
   ```
   Email: testguest@example.com
   Password: test123
   ```
3. Click **"Login with Email"**
4. **Redirected to:** `/user/dashboard`

#### Step 6: Apply to Event (After Login)
1. Navigate back to homepage: Click "The Social Circle" logo
2. Click on an event
3. Click **"Apply to Dinner"**
4. **Fill Application Form:**
   ```
   Full Name: Test Guest (pre-filled)
   Email: testguest@example.com (pre-filled)
   Phone: +919876543210
   Message: "I'm interested in networking with fellow founders!"
   ```
5. Click **"Apply Now"**
6. **You should see:**
   - Success toast: "Application submitted successfully"
   - Email confirmation (if configured)

#### Step 7: Check Application Status
1. Navigate to **Guest Dashboard**: `/user/dashboard`
2. **You should see:**
   - Section: "My Applications"
   - Your application with status:
     - **"Pending Review"** (yellow icon, spinning)
     - **"Verified"** (green checkmark) - after admin verification
     - **"Mentor Connected"** (blue checkmark) - after host purchases
   - Event title
   - Application date

---

### FLOW 2: Admin Journey (Platform Manager)

#### Step 1: Admin Login
1. Navigate to `/login`
2. Enter admin credentials:
   ```
   Email: admin@thesocialcircle.in
   Password: admin123
   ```
3. Click **"Login with Email"**
4. **Redirected to:** `/admin/dashboard`

#### Step 2: Admin Dashboard Overview
**You should see:**
- **Analytics Cards:**
  - Total Users
  - Total Mentors (Hosts)
  - Total Leads (Applications)
  - Total Revenue

- **Three Tabs:**
  1. Mentors (Host verification)
  2. Leads (Application verification)
  3. Users (All users list)

#### Step 3: Verify Guest Application
1. Click **"Leads"** tab
2. **You should see** list of all applications:
   - Guest name
   - Email
   - Phone
   - Message
   - Event title
   - Verification status badge:
     - Yellow: "PENDING"
     - Green: "VERIFIED"
     - Blue: "PURCHASED"
     - Red: "REJECTED"

3. Find the application from "Test Guest" (status: PENDING)
4. Click **"Verify"** button (green)
5. **Result:**
   - Success message: "Lead verification updated"
   - Status changes to "VERIFIED"
   - Badge turns green
   - **Email sent to guest** (if configured)

#### Step 4: Approve Host (If Needed)
1. Click **"Mentors"** tab
2. **You should see** list of all hosts with:
   - Name
   - Email
   - Bio
   - Expertise tags
   - Verification status
3. If any host has status "PENDING":
   - Click **"Approve"** button (green with checkmark)
   - Success message
   - Status changes to "APPROVED"
   - **Email sent to host** (if configured)
   - Host can now create events

#### Step 5: View Platform Analytics
1. Stay on Admin Dashboard
2. Top cards show:
   ```
   Total Users: 150
   Total Mentors: 25
   Total Leads: 300
   Total Revenue: ₹50,000
   ```
3. These update in real-time as activities happen

---

### FLOW 3: Host Journey (Event Organizer)

#### Step 1: Host Login
1. Navigate to `/login`
2. Enter host credentials:
   ```
   Email: mentor@leadbridge.com
   Password: mentor123
   ```
3. Click **"Login with Email"**
4. **Redirected to:** `/mentor/dashboard`

#### Step 2: Host Dashboard Overview
**You should see:**

**Top Stats (4 cards):**
1. **Total Events**: Number of events created
2. **Verified Leads**: Applications ready to unlock
3. **Purchased Leads**: Applications you've paid for
4. **Total Spent**: Money spent on unlocking leads

**Three Tabs:**
1. **Profile** - Update bio, expertise, experience
2. **Events** - Manage your experiences
3. **Leads** - View and unlock applications

#### Step 3: Update Host Profile
1. Click **"Profile"** tab
2. **Fill the form:**
   ```
   Bio: "Startup founder and tech enthusiast. Hosting dinners to connect Delhi's startup ecosystem."
   
   Expertise (comma-separated): "Entrepreneurship, Technology, Startups, Networking"
   
   Experience: "Founded 2 startups, angel investor, love connecting interesting people over great food."
   ```
3. Click **"Update Profile"**
4. Success message: "Profile updated"

#### Step 4: Create New Event
1. Click **"Events"** tab
2. Click **"Create Event"** button (top right, blue)
3. **Modal opens** with form
4. **Fill Event Details:**
   ```
   Event Title: "Startup Founders Dinner - Gurgaon"
   
   Description: "Join fellow startup founders for an intimate dinner at a cozy restaurant in Cyber Hub, Gurgaon. Let's discuss fundraising, team building, product development, and the startup journey over great food and conversations."
   
   Category: "Professional Networking"
   
   Date & Time: Select future date (e.g., 7 days from now)
   
   Duration (min): 180  (3 hours)
   
   Slots: 10  (max guests)
   
   Price/Lead (₹): 2000  (what guests will pay per ticket)
   ```
5. Click **"Create Event"**
6. **Result:**
   - Success toast: "Event created successfully"
   - Modal closes
   - Event appears in your events list

#### Step 5: View Your Events
Still in **Events** tab, you should see:
- **Event Card** with:
  - Event title
  - Description (truncated)
  - Date, duration, slots, price
  - Two action buttons:
    - **Edit** (pencil icon)
    - **Delete** (trash icon, red)

**To Edit Event:**
1. Click **Edit** button
2. Modal opens with pre-filled data
3. Make changes
4. Click **"Update Event"**

**To Delete Event:**
1. Click **Delete** button
2. Confirmation prompt: "Are you sure?"
3. Click OK
4. Event removed

#### Step 6: View Guest Applications (Leads)
1. Click **"Leads"** tab
2. **You should see** list of all verified applications for your events:

**Each Lead Card Shows:**
```
┌─────────────────────────────────────────┐
│ Startup Founders Dinner - Gurgaon      │ [Badge: VERIFIED]
│                                         │
│ 🔒 Contact details hidden until purchase│
│                                         │
│ Created: Jan 7, 2025                   │
│ Price: ₹299                            │
│                                         │
│         [Purchase (₹299) Button]       │
└─────────────────────────────────────────┘
```

**Status Badges:**
- **Blue "VERIFIED"**: Ready to unlock
- **Green "PURCHASED"**: You've already unlocked this

**Important:** Contact details (name, email, phone, message) are **hidden** until you purchase the lead.

---

### FLOW 4: Host Purchases Lead (CRITICAL FLOW)

#### Step 1: Initiate Purchase
1. In **Leads** tab, find a **VERIFIED** lead
2. Click **"Purchase (₹299)"** button

#### Step 2: Demo Payment Gateway
**A browser prompt appears:**

```
╔════════════════════════════════════════╗
║     Demo Payment Gateway               ║
║                                        ║
║  Amount: ₹299                         ║
║                                        ║
║  Your payment code is: DEMO5A3F21     ║
║                                        ║
║  Enter the code above to complete     ║
║  payment:                             ║
║                                        ║
║  [________________]  [OK]  [Cancel]   ║
╚════════════════════════════════════════╝
```

**What You See:**
- Amount to pay: ₹299
- Unique payment code: **DEMO5A3F21** (changes each time)
- Input field to enter the code

#### Step 3: Complete Payment
1. **Copy** the payment code: `DEMO5A3F21`
2. **Paste** it in the input field
3. Click **OK**

**What Happens:**
- Frontend sends code to backend
- Backend verifies code matches
- Payment status → COMPLETED
- Lead status → PURCHASED

#### Step 4: Payment Success
**You should see:**
1. **Success Toast:** "Lead purchased successfully! Check your email for lead details."
2. **Lead Card Updates Automatically:**
   ```
   ┌─────────────────────────────────────────┐
   │ Startup Founders Dinner - Gurgaon      │ [Badge: PURCHASED ✓]
   │                                         │
   │ ✅ Name: Test Guest                    │
   │ ✅ Email: testguest@example.com        │
   │ ✅ Phone: +919876543210                │
   │ ✅ Message: "I'm interested in..."     │
   │                                         │
   │ Created: Jan 7, 2025                   │
   │ Price: ₹299 (PAID)                     │
   └─────────────────────────────────────────┘
   ```

3. **Email Sent to Host** (if Resend configured):
   - Subject: "Lead Purchase Receipt - Startup Founders Dinner"
   - Contains:
     - Event title
     - Lead details (name, email, phone, message)
     - Amount paid: ₹299
     - Payment code: DEMO5A3F21
     - Receipt for records

#### Step 5: What Host Can Do Now
**With unlocked lead details, host can:**
1. **Contact the guest** via email or phone
2. **Accept or decline** the guest for the event
3. **Curate the final guest list** (typically 8-12 people)
4. **Send event details** to accepted guests
5. **Request ticket payment** from guests (₹2,000 per ticket)

---

### FLOW 5: Guest Receives Update

#### When Host Unlocks Application:
1. **Guest Dashboard** updates automatically
2. Application status changes:
   - From: "Verified" (green checkmark)
   - To: "Mentor Connected" (blue checkmark)

3. **Guest sees message:**
   ```
   ✓ The host has purchased your lead and will contact you soon!
   ```

4. **Guest receives email** (if configured):
   - Subject: "Your Application Update"
   - Host has reviewed your profile
   - Expect contact from host soon
   - Event reminder

#### When Host Accepts Guest:
1. Host contacts guest directly (email/phone)
2. Host sends payment link for ticket
3. Guest pays ₹2,000 (event ticket price)
4. Guest receives event confirmation
5. After event: Both leave reviews

---

## 🧪 Step-by-Step Testing Script

### Test 1: Complete Guest-to-Host Flow

```bash
# Test the entire flow end-to-end

# 1. Browse events without login
Open: https://your-app.com
✓ Events visible
✓ Click event → details shown

# 2. Apply to event (triggers login)
Click "Apply to Dinner"
✓ Redirected to /login

# 3. Register as guest
Go to /signup
Email: testflow@example.com
Password: test123
Role: Attend Dinners (Guest)
✓ Registration success
✓ Email verification sent

# 4. Login as admin
/login
Email: admin@thesocialcircle.in
Password: admin123
✓ Admin dashboard loads

# 5. Verify the application
Admin Dashboard → Leads tab
Find testflow@example.com application
Click "Verify"
✓ Status → VERIFIED

# 6. Login as host
Logout → Login
Email: mentor@leadbridge.com
Password: mentor123
✓ Host dashboard loads

# 7. View verified lead
Host Dashboard → Leads tab
✓ See VERIFIED lead
✓ Contact details HIDDEN

# 8. Purchase lead (DEMO PAYMENT)
Click "Purchase (₹299)"
✓ Prompt appears with code (e.g., DEMO5A3F21)
Copy and paste code
Click OK
✓ Success message
✓ Lead status → PURCHASED
✓ Contact details NOW VISIBLE
✓ Email received (check inbox)

# 9. Verify email contains lead details
Open email
✓ Subject: "Lead Purchase Receipt"
✓ Contains: name, email, phone, message
✓ Payment code shown
✓ Amount: ₹299

# 10. Check guest dashboard
Login as testflow@example.com
Go to /user/dashboard
✓ Application status: "Mentor Connected"
✓ Message: "Host has purchased your lead"
```

### Test 2: Host Creates Event Flow

```bash
# 1. Login as host
/login
Email: mentor@leadbridge.com
Password: mentor123

# 2. Create event
Host Dashboard → Events tab
Click "Create Event"
Fill form:
  Title: "Test Event"
  Description: "Test description"
  Category: "Professional Networking"
  Date: Tomorrow
  Duration: 120
  Slots: 10
  Price: 1500
Click "Create Event"
✓ Event created
✓ Appears in events list

# 3. Verify event is public
Logout
Go to homepage
✓ New event visible in Featured Experiences
```

### Test 3: Multiple Lead Purchases

```bash
# Host can purchase multiple leads

# 1. Create 3 guest applications (use admin to verify all)
# 2. Login as host
# 3. Go to Leads tab
# 4. Purchase Lead 1:
   - Click Purchase → Code: DEMO123ABC
   - Enter code → Success
   - Email sent
# 5. Purchase Lead 2:
   - Click Purchase → Code: DEMO456DEF (different code!)
   - Enter code → Success
   - Email sent
# 6. Purchase Lead 3:
   - Click Purchase → Code: DEMO789GHI
   - Enter code → Success
   - Email sent

# Verify:
✓ All 3 leads show status: PURCHASED
✓ All 3 emails received with different codes
✓ Host dashboard "Total Spent" updates: ₹897 (₹299 × 3)
```

---

## 📧 Email Flow Summary

### Emails Sent During Complete Flow:

1. **Guest Signs Up**
   - To: Guest email
   - Subject: "Verify Your Social Circle Account"
   - Action: Click verification link

2. **Guest Applies to Event**
   - To: Guest email
   - Subject: "Application Confirmed - The Social Circle"
   - Content: Booking details, next steps

3. **Admin Verifies Application**
   - To: Guest email
   - Subject: "Your Application is Verified!"
   - Content: Application approved, waiting for host

4. **Host Gets New Verified Lead**
   - To: Host email
   - Subject: "New Verified Lead - The Social Circle"
   - Content: New application available, login to view

5. **Host Purchases Lead (MOST IMPORTANT)**
   - To: Host email
   - Subject: "Lead Purchase Receipt - [Event Title]"
   - Content:
     ```
     Lead Details:
     Name: Test Guest
     Email: testguest@example.com
     Phone: +919876543210
     Message: "I'm interested in..."
     
     Payment:
     Amount Paid: ₹299
     Payment Code: DEMO5A3F21
     Date: Jan 7, 2025
     ```

6. **Host Approval Notification**
   - To: Host email
   - Subject: "Application Approved - The Social Circle"
   - Content: You've been approved as a host

---

## 🔍 Testing Checklist

### Public Access (No Login)
- [ ] Homepage loads
- [ ] Events visible in Featured Experiences section
- [ ] Event cards show all details
- [ ] Click event → detail page loads
- [ ] "Apply to Dinner" button visible
- [ ] Click apply → redirects to login

### Guest Flow
- [ ] Can sign up with email
- [ ] Email verification email sent
- [ ] Can verify email via link
- [ ] Can login after verification
- [ ] Can apply to events
- [ ] Application appears in guest dashboard
- [ ] Application status updates correctly

### Admin Flow
- [ ] Admin can login
- [ ] Admin dashboard loads
- [ ] Can view all applications
- [ ] Can verify applications
- [ ] Can approve/reject hosts
- [ ] Analytics update correctly

### Host Flow
- [ ] Host can login
- [ ] Host dashboard loads
- [ ] Can update profile
- [ ] Can create events
- [ ] Can edit/delete events
- [ ] Can view verified leads
- [ ] Contact details hidden for VERIFIED leads
- [ ] Can purchase leads (demo payment)
- [ ] Demo payment code prompt appears
- [ ] Entering correct code works
- [ ] Entering wrong code shows error
- [ ] After purchase: contact details visible
- [ ] Email receipt received
- [ ] Dashboard stats update

### Payment Flow (Critical)
- [ ] Purchase button appears for VERIFIED leads
- [ ] Click purchase → prompt appears
- [ ] Unique code generated (e.g., DEMO5A3F21)
- [ ] Enter correct code → success
- [ ] Enter wrong code → error message
- [ ] Cancel payment → no charge
- [ ] After success: lead status → PURCHASED
- [ ] Email sent with lead details
- [ ] Total Spent updates in dashboard

---

## 🐛 Common Issues & Solutions

### Issue 1: Events Not Visible
**Symptom:** Homepage shows "No events available"

**Solution:**
```bash
# Check if events exist in database
mongosh
use socialcircle_db
db.events.find().pretty()

# If no events, create one via host dashboard
# Or use the test data script provided earlier
```

### Issue 2: Demo Payment Not Working
**Symptom:** Clicking "Purchase" does nothing or shows error

**Solution:**
```bash
# Check backend logs
tail -50 /var/log/supervisor/backend.err.log

# Verify backend is running
sudo supervisorctl status backend

# Test payment endpoint manually
curl -X POST "http://localhost:8001/api/mentor/leads/LEAD_ID/purchase" \
  -H "Cookie: session_token=YOUR_TOKEN"
```

### Issue 3: Email Not Received
**Symptom:** No email after registration or purchase

**Solution:**
```bash
# Check if Resend API key is configured
cat /app/backend/.env | grep RESEND_API_KEY

# If empty, emails won't send (this is okay for demo)
# Backend will log: "Resend API key not configured, skipping email"

# To fix: Get API key from resend.com and add to .env
echo 'RESEND_API_KEY=re_your_key_here' >> /app/backend/.env
sudo supervisorctl restart backend
```

### Issue 4: Can't Login
**Symptom:** Login fails with "Invalid credentials"

**Solution:**
```bash
# Verify user exists
mongosh
use socialcircle_db
db.users.findOne({email: "mentor@leadbridge.com"})

# If user doesn't exist, run test data creation script
# Or register via /signup page
```

---

## 📊 Expected Results Summary

### After Complete Flow:

**Guest Dashboard:**
- 1 application listed
- Status: "Mentor Connected" (blue checkmark)
- Message: "Host has purchased your lead"

**Host Dashboard:**
- Stats updated:
  - Total Events: 3-4 events
  - Verified Leads: 0 (all purchased)
  - Purchased Leads: 1+
  - Total Spent: ₹299+
- Leads tab:
  - All purchased leads show full contact details
  - Status badges: Green "PURCHASED"

**Admin Dashboard:**
- Stats updated:
  - Total Users: 150+
  - Total Mentors: 25+
  - Total Leads: 300+
  - Total Revenue: ₹50,000+
- All activities logged

**Emails (if configured):**
- 5-6 emails sent during complete flow
- All contain proper branding
- Lead purchase receipt has full details

---

## 🎯 Key Takeaways

### Demo Payment Gateway:
1. **Purpose**: Showcase functionality without real payment integration
2. **Code Format**: DEMO + 6 random characters (e.g., DEMO5A3F21)
3. **Validation**: Code must match exactly
4. **Result**: Email sent with lead details
5. **Production**: Swap with Razorpay (code ready, just uncomment)

### Lead Unlock Flow:
1. Guest applies → Status: PENDING
2. Admin verifies → Status: VERIFIED
3. Host unlocks (pays ₹299) → Status: PURCHASED
4. Host sees: Name, email, phone, message
5. Host contacts guest directly
6. Guest pays ticket price (₹2000)
7. Both attend event
8. Both leave reviews

### Revenue Model:
- **Lead Unlock**: ₹299 per application (Host pays)
- **Ticket Price**: ₹2000 per seat (Guest pays)
- **Platform Commission**: 10% of ticket (₹200)
- **Host Earnings**: ₹1800 per seat - ₹299 unlock cost

---

## 📞 Need Help?

If any flow doesn't work as described:
1. Check backend/frontend logs
2. Verify services are running: `sudo supervisorctl status`
3. Check browser console for errors (F12)
4. Test API endpoints with curl
5. Verify database has test data

**All flows tested and working as of January 7, 2025**

---

*The Social Circle - Where every dinner is an opportunity*
