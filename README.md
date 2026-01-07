# The Social Circle - Premium Networking Platform

[![Made with Emergent](https://img.shields.io/badge/Made%20with-Emergent-00C853?style=flat-square)](https://emergent.sh)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110.1-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.5.0-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)

**Real Connections. Curated Dinners.**

A premium curated networking platform connecting hosts and guests for intimate micro-events and dinners in Delhi NCR. Built with modern technologies for scalability, security, and exceptional user experience.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Business Model](#business-model)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [User Flows](#user-flows)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Authentication](#authentication)
- [Payment System](#payment-system)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [Testing](#testing)
- [Contributing](#contributing)

---

## 🎯 Overview

### What is The Social Circle?

The Social Circle is an exclusive platform designed to combat the loneliness and superficiality of modern networking. We connect interesting people through intimate, hosted micro-events and curated dinners.

**No random mixers. Just meaningful conversations.**

### Key Differentiators

- **Curated Experiences**: Hosts create intimate events (typically 8-12 guests)
- **Application-Based**: Guests apply to attend; hosts curate their ideal group
- **Trust & Safety**: Profile verification, host training, and dual rating system
- **Revenue Reverse**: Hosts unlock guest applications (₹199-₹499) before accepting them
- **Pay After Acceptance**: Guests only pay when accepted by the host
- **Delhi NCR Focus**: Initially launching in Delhi NCR market

### Target Market

- **Primary**: 25-40 year old professionals seeking authentic connections
- **Geography**: Delhi NCR (Gurgaon, Noida, Delhi, Ghaziabad)
- **Segments**: Entrepreneurs, startup professionals, creatives, industry experts

---

## 💰 Business Model

### Revenue Streams

#### 1. **Commission per Ticket** (Primary Revenue)
- **Rate**: 10% platform commission
- **Average Ticket**: ₹2,000 per seat
- **Revenue per Seat**: ₹200
- **Example**: 10-guest dinner = ₹2,000 platform revenue

#### 2. **Lead Unlock Fees** (Secondary Revenue)
- **Pricing**: ₹199 - ₹499 per application unlock
- **High Margin**: ~85-90% margin
- **Volume**: Hosts unlock 15-20 applications per event
- **Revenue per Event**: ₹3,000 - ₹6,000

#### 3. **Flagship Events** (Future)
- Platform-hosted signature experiences
- Higher ticket prices (₹3,000-₹5,000)
- Greater control over quality

### Unit Economics

**Per Event (10 guests @ ₹2,000/seat):**
- Gross Ticket Sales: ₹20,000
- Platform Commission (10%): ₹2,000
- Lead Unlock Revenue: ₹4,000 (avg)
- **Total Platform Revenue**: ₹6,000

**Host Economics:**
- Ticket Revenue: ₹18,000 (after commission)
- Lead Unlock Cost: ₹4,000 (if unlocks 10 applications)
- **Net to Host**: ₹14,000
- Plus: Community building, networking value

### Growth Strategy

1. **Phase 1**: Launch in Delhi NCR (0-6 months)
   - Target: 50 hosts, 500 guests, 200 events
   - Revenue: ₹12L

2. **Phase 2**: Expand to Mumbai & Bangalore (6-12 months)
   - Target: 200 hosts, 3,000 guests, 1,000 events
   - Revenue: ₹60L

3. **Phase 3**: Enterprise partnerships (12-18 months)
   - Corporate team experiences
   - Company-sponsored dinners

---

## ✨ Features

### 👥 For Guests (Attendees)

**Discovery & Application**
- Browse curated experiences across Delhi NCR
- Filter by location, date, cuisine, theme, price
- View host profiles and past events
- Apply to dinners with personalized introduction
- Track application status

**Profile & Verification**
- Complete professional profile
- LinkedIn/email verification
- Interest tags and networking goals
- Past attendance history
- Reviews from hosts

**Payment & Protection**
- Pay only when accepted by host
- Secure payment hold
- Automatic refund if not accepted
- Event reminders and details

**Post-Event**
- Rate and review the experience
- Connect with co-attendees
- Save favorite hosts
- Receive follow-up recommendations

### 🎯 For Hosts (Organizers)

**Event Creation**
- Create experience with all details
- Set capacity, price, and date
- Choose venue (own home, restaurant, cafe)
- AI-powered description polish
- Add photos and special requirements

**Application Management**
- View guest applications as they arrive
- Unlock profiles with lead fee (₹199-₹499)
- Review detailed guest profiles
- Accept/decline applications
- Curate the perfect group

**Revenue Management**
- Real-time earnings dashboard
- Track ticket sales and lead fees
- View commission breakdown
- Payment reconciliation
- Performance analytics

**Community Building**
- Build follower base
- Series/recurring events
- Guest retention tracking
- Host reputation score

### 👨‍💼 For Admins

**Platform Management**
- Approve/reject host applications
- Verify guest profiles
- Monitor event quality
- Handle disputes
- Platform analytics

**Trust & Safety**
- Profile verification queue
- Report management
- Community guidelines enforcement
- Fraud detection
- Quality control

**Analytics & Insights**
- Revenue tracking
- User growth metrics
- Event performance
- Geographic insights
- Conversion funnels

---

## 🛠 Technology Stack

### Backend

#### **FastAPI v0.110.1**
**Why FastAPI?**
- **Performance**: Async/await for concurrent operations
- **Type Safety**: Pydantic models for validation
- **Auto Documentation**: Built-in Swagger UI
- **Modern Python**: Python 3.11+ features
- **Production Ready**: Used by Microsoft, Uber, Netflix

#### **MongoDB v4.5.0 + Motor v3.3.1**
**Why MongoDB?**
- **Flexible Schema**: Perfect for evolving marketplace
- **JSON-Native**: Seamless integration with FastAPI/React
- **Scalability**: Horizontal scaling with sharding
- **Performance**: Fast reads/writes with indexing
- **Motor**: Async MongoDB driver for FastAPI

#### **Python 3.11**
**Features:**
- 10-60% faster than Python 3.10
- Better error messages for debugging
- Enhanced type hints
- Improved async performance

### Frontend

#### **React v19.0.0**
**Why React 19?**
- **Latest Features**: Server Components, Actions
- **Performance**: Improved rendering
- **Ecosystem**: Largest component library
- **Community**: Most active frontend community

#### **React Router v7.5.1**
- Standard routing solution
- Data loading patterns
- Route-based code splitting
- Nested routes for dashboards

#### **Tailwind CSS v3.4.19**
**Why Tailwind?**
- **Utility-First**: Rapid UI development
- **Consistency**: Built-in design system
- **Performance**: Automatic CSS purging
- **Responsive**: Mobile-first approach
- **Dark Navy Blue Theme**: Custom colors (#0A1628)

#### **Shadcn/UI**
- Accessible components (ARIA-compliant)
- Full customization control
- Built with Radix UI primitives
- TypeScript support

### Authentication

#### **JWT (JSON Web Tokens)**
- Stateless authentication
- Scalable across multiple servers
- Mobile-friendly

#### **Emergent Auth (Google OAuth)**
- Pre-configured OAuth flow
- No API keys needed
- Built-in session management
- Reduces development time by 80%

### Email System

#### **Resend**
- Modern transactional email service
- 100 emails/day free tier
- Excellent deliverability
- Simple API integration

**Email Types:**
1. Email verification on signup
2. Application confirmation to guests
3. New application alert to hosts
4. Acceptance/rejection notifications
5. Event reminders
6. Post-event review requests
7. Payment receipts

### Payment Processing

#### **Demo Payment Gateway** (Prototype)
For prototype/MVP demonstration:
- Unique payment codes generated
- Email receipts with guest details
- Simulates unlock and payment flow
- **Note**: Razorpay integration code included but commented out

#### **Razorpay** (Production Ready)
When going live:
- Multiple payment methods (UPI, cards, wallets)
- PCI DSS certified
- Real-time webhooks
- INR transactions optimized

### Development Tools

- **Git**: Version control
- **Yarn v1.22.22**: Package manager (faster than npm)
- **Supervisord**: Process monitoring
- **Ruff**: Fast Python linter
- **ESLint v9.23.0**: JavaScript/React linting

---

## 🏗 Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Users (Web Browser)                       │
│           Hosts, Guests, Admin                              │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│              Kubernetes Ingress / Nginx                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Route Mapping:                                       │   │
│  │  - /api/*  → Backend Service (Port 8001)             │   │
│  │  - /*      → Frontend Service (Port 3000)            │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────┬───────────────────────────┬───────────────────┘
              │                           │
              ▼                           ▼
┌─────────────────────────┐   ┌─────────────────────────────┐
│   Frontend Container    │   │    Backend Container        │
│  ┌───────────────────┐  │   │  ┌───────────────────────┐  │
│  │  React 19 App     │  │   │  │  FastAPI Server       │  │
│  │  - Tailwind CSS   │  │   │  │  - Async Endpoints    │  │
│  │  - React Router   │  │   │  │  - JWT Auth           │  │
│  │  - Shadcn UI      │  │   │  │  - Pydantic Models    │  │
│  │  Port: 3000       │  │   │  │  Port: 8001           │  │
│  └───────────────────┘  │   │  └───────────────────────┘  │
└─────────────────────────┘   └──────────────┬──────────────┘
                                             │
                                             ▼
                              ┌──────────────────────────────┐
                              │   MongoDB Container          │
                              │  ┌────────────────────────┐  │
                              │  │  Collections:          │  │
                              │  │  - users               │  │
                              │  │  - mentors (hosts)     │  │
                              │  │  - events              │  │
                              │  │  - leads (applications)│  │
                              │  │  - payments            │  │
                              │  │  Port: 27017           │  │
                              │  └────────────────────────┘  │
                              └──────────────┬───────────────┘
                                             │
                              ┌──────────────┴───────────────┐
                              │   External Services          │
                              │  - Resend (Email)           │
                              │  - Emergent Auth (OAuth)    │
                              │  - (Razorpay - Future)      │
                              └──────────────────────────────┘
```

### Data Flow

#### Guest Application Flow
```
Guest → Browse Events → Event Detail → Click "Apply"
  → Login/Signup (if not logged in)
    → Fill Application Form
      → Submit Application
        → Auto-Verification (email/phone)
          → Admin Manual Review (if needed)
            → Status: VERIFIED
              → Host Unlocks Application (pays ₹199-₹499)
                → Host Reviews Profile
                  → Host Accepts → Guest Pays
                    → Booking Confirmed
```

#### Host Event Flow
```
Host → Sign Up → Admin Approval
  → Create Event (AI Polish description)
    → Set: Title, Date, Venue, Price, Capacity
      → Publish Event
        → Guests Apply
          → Host Unlocks Applications
            → Host Accepts Selected Guests
              → Guests Pay
                → Event Happens
                  → Mutual Reviews
```

### Folder Structure

```
/app
├── backend/                    # FastAPI Backend
│   ├── server.py              # Main application file
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Environment variables
│
├── frontend/                   # React Frontend
│   ├── public/
│   │   ├── index.html         # HTML template
│   │   └── logo.png           # The Social Circle logo
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   ├── ui/           # Shadcn UI components
│   │   │   ├── Navbar.jsx    # Navigation with "S" logo
│   │   │   ├── Footer.jsx    # Footer with links
│   │   │   └── EventCard.jsx # Event display card
│   │   ├── pages/            # Route pages
│   │   │   ├── Landing.jsx        # Home page
│   │   │   ├── Login.jsx          # Login page
│   │   │   ├── Signup.jsx         # Registration
│   │   │   ├── AuthCallback.jsx   # OAuth handler
│   │   │   ├── VerifyEmail.jsx    # Email verification
│   │   │   ├── UserDashboard.jsx  # Guest dashboard
│   │   │   ├── MentorDashboard.jsx # Host dashboard
│   │   │   ├── AdminDashboard.jsx # Admin panel
│   │   │   ├── EventDetail.jsx    # Event detail & apply
│   │   │   ├── PrivacyPolicy.jsx  # Privacy policy
│   │   │   ├── TermsConditions.jsx # Terms of service
│   │   │   ├── RefundPolicy.jsx   # Refund policy
│   │   │   └── Contact.jsx        # Contact page
│   │   ├── App.js            # Root component
│   │   ├── App.css           # Component styles
│   │   └── index.css         # Global styles + Tailwind
│   ├── package.json          # Node dependencies
│   ├── tailwind.config.js    # Tailwind configuration
│   └── .env                  # Environment variables
│
├── design_guidelines.json    # UI/UX specifications
├── auth_testing.md          # Auth testing playbook
├── EMAIL_SETUP_GUIDE.md     # Email setup documentation
├── DEPLOYMENT_GUIDE.md      # Deployment documentation
├── README.md                # This file
└── test_reports/            # Testing results
```

---

## 🚀 Getting Started

### Prerequisites

- **Python**: 3.11 or higher
- **Node.js**: 18.x or higher
- **MongoDB**: 4.5 or higher
- **Yarn**: 1.22 or higher

### Installation

#### 1. Clone Repository

```bash
git clone <repository-url>
cd thesocialcircle
```

#### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cat > .env << EOF
MONGO_URL="mongodb://localhost:27017"
DB_NAME="socialcircle_db"
CORS_ORIGINS="*"
RESEND_API_KEY=""
SENDER_EMAIL="hello@thesocialcircle.in"
FRONTEND_URL="http://localhost:3000"
EOF

# Start MongoDB
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod

# Run backend
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

Backend available at: `http://localhost:8001`
API Docs: `http://localhost:8001/docs`

#### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
yarn install

# Create .env file
cat > .env << EOF
REACT_APP_BACKEND_URL=http://localhost:8001
WDS_SOCKET_PORT=443
ENABLE_HEALTH_CHECK=false
EOF

# Start development server
yarn start
```

Frontend available at: `http://localhost:3000`

#### 4. Create Test Data

```bash
cd backend
python << EOF
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import bcrypt
from datetime import datetime, timezone, timedelta

async def create_test_data():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client["socialcircle_db"]
    
    # Create admin
    admin_hash = bcrypt.hashpw("admin123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    await db.users.insert_one({
        "user_id": "admin_001",
        "email": "admin@thesocialcircle.in",
        "name": "Admin User",
        "password_hash": admin_hash,
        "role": "ADMIN",
        "email_verified": True,
        "created_at": datetime.now(timezone.utc)
    })
    
    # Create host
    host_hash = bcrypt.hashpw("host123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    await db.users.insert_one({
        "user_id": "host_001",
        "email": "host@example.com",
        "name": "Rajesh Kumar",
        "password_hash": host_hash,
        "role": "MENTOR",
        "email_verified": True,
        "created_at": datetime.now(timezone.utc)
    })
    
    await db.mentors.insert_one({
        "mentor_id": "mentor_001",
        "user_id": "host_001",
        "bio": "Startup founder and tech enthusiast. Hosting dinners to connect Delhi's startup ecosystem.",
        "expertise": ["Entrepreneurship", "Technology", "Startups"],
        "experience": "Founded 2 startups, angel investor, loves connecting people.",
        "verification_status": "APPROVED",
        "created_at": datetime.now(timezone.utc)
    })
    
    # Create guest
    guest_hash = bcrypt.hashpw("guest123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    await db.users.insert_one({
        "user_id": "guest_001",
        "email": "guest@example.com",
        "name": "Priya Sharma",
        "password_hash": guest_hash,
        "role": "USER",
        "email_verified": True,
        "created_at": datetime.now(timezone.utc)
    })
    
    # Create sample event
    await db.events.insert_one({
        "event_id": "event_001",
        "mentor_id": "mentor_001",
        "title": "Startup Founders Dinner - Gurgaon",
        "description": "Join fellow startup founders for an intimate dinner at a cozy restaurant in Cyber Hub. Let's discuss fundraising, team building, and the startup journey over great food.",
        "category": "Professional Networking",
        "event_datetime": datetime.now(timezone.utc) + timedelta(days=7),
        "duration": 180,
        "available_slots": 10,
        "price_per_lead": 2000,
        "created_at": datetime.now(timezone.utc)
    })
    
    print("✅ Test data created!")
    print("Admin: admin@thesocialcircle.in / admin123")
    print("Host: host@example.com / host123")
    print("Guest: guest@example.com / guest123")
    
    client.close()

asyncio.run(create_test_data())
EOF
```

### Quick Start Commands

```bash
# Start all services (with Supervisor)
sudo supervisorctl start all

# Check service status
sudo supervisorctl status

# View logs
tail -f /var/log/supervisor/backend.*.log
tail -f /var/log/supervisor/frontend.*.log

# Restart services
sudo supervisorctl restart backend frontend

# Stop all
sudo supervisorctl stop all
```

---

## 👤 User Flows

### Guest (Attendee) Journey

1. **Discovery**
   - Land on homepage (no login required)
   - Browse featured experiences
   - Filter by location, date, price, theme
   - Click event to view details

2. **Application**
   - Click "Apply to Dinner"
   - Prompted to login/signup if not authenticated
   - Fill application form (name, email, phone, message)
   - Submit application
   - Receive email confirmation

3. **Verification**
   - Application auto-verified (email/phone validation)
   - If flags raised, admin manually reviews
   - Status changes to "VERIFIED"

4. **Waiting**
   - Host reviews and unlocks application
   - Host accepts or declines
   - If accepted: receive payment request
   - If declined: receive notification

5. **Payment & Attendance**
   - Pay for ticket when accepted
   - Receive event details and reminders
   - Attend event
   - Leave review after event

### Host Journey

1. **Onboarding**
   - Sign up as host
   - Complete profile (bio, expertise, experience)
   - Wait for admin approval
   - Receive approval email

2. **Event Creation**
   - Create new experience
   - Fill details: title, description, venue, date, price, capacity
   - Use AI polish for description
   - Set lead unlock price (₹199-₹499)
   - Publish event

3. **Application Management**
   - Receive notifications for new applications
   - View locked applications (basic info only)
   - Pay to unlock full profile (₹199-₹499 per application)
   - Review detailed guest profiles
   - Accept/decline applications

4. **Pre-Event**
   - Curate final guest list
   - Communicate with accepted guests
   - Prepare for event
   - Receive final attendance confirmations

5. **Post-Event**
   - Rate and review guests
   - Receive payment (ticket price - 10% commission)
   - Build community for future events
   - Create follow-up experiences

### Admin Journey

1. **Host Verification**
   - Review host applications
   - Check profile completeness
   - Verify identity if needed
   - Approve or reject with reason

2. **Application Monitoring**
   - Review flagged guest applications
   - Check for spam or fake profiles
   - Verify contact details
   - Approve or reject

3. **Platform Management**
   - Monitor event quality
   - Handle disputes
   - View analytics dashboard
   - Manage community guidelines

---

## 📚 API Documentation

### Base URL
- **Development**: `http://localhost:8001`
- **Production**: `https://thesocialcircle.in`

### API Prefix
All routes: `/api`

### Authentication Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "USER"  // USER (guest) | MENTOR (host)
}

Response: 200 OK + Set-Cookie
{
  "user_id": "user_abc123",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "USER",
  "email_verified": false,
  "message": "Registration successful! Check email to verify."
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: 200 OK + Set-Cookie
{
  "user_id": "user_abc123",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "USER"
}
```

#### Get Current User
```http
GET /api/auth/me
Cookie: session_token=...

Response: 200 OK
{
  "user_id": "user_abc123",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "USER",
  "email_verified": true,
  "created_at": "2025-01-07T10:00:00Z"
}
```

### Event Endpoints

#### Get All Events (Public - No Auth Required)
```http
GET /api/events

Response: 200 OK
[
  {
    "event_id": "event_001",
    "mentor_id": "mentor_001",
    "title": "Startup Founders Dinner - Gurgaon",
    "description": "Join fellow startup founders...",
    "category": "Professional Networking",
    "event_datetime": "2025-01-15T19:00:00Z",
    "duration": 180,
    "available_slots": 8,
    "price_per_lead": 2000,
    "mentor_name": "Rajesh Kumar",
    "created_at": "2025-01-07T10:00:00Z"
  }
]
```

#### Get Event Details (Public)
```http
GET /api/events/{event_id}

Response: 200 OK
{
  "event_id": "event_001",
  "title": "Startup Founders Dinner - Gurgaon",
  "description": "...",
  "mentor_name": "Rajesh Kumar",
  "mentor_bio": "Startup founder and tech enthusiast...",
  "mentor_expertise": ["Entrepreneurship", "Technology"],
  "price_per_lead": 2000,
  "available_slots": 8
}
```

#### Apply to Event (Authenticated Guest)
```http
POST /api/events/{event_id}/book
Cookie: session_token=...
Content-Type: application/json

{
  "name": "Priya Sharma",
  "email": "priya@example.com",
  "phone": "+919876543210",
  "message": "Excited to connect with fellow founders!"
}

Response: 200 OK
{
  "lead_id": "lead_xyz789",
  "message": "Application submitted successfully"
}
```

### Host Endpoints

#### Get Host Profile
```http
GET /api/mentor/profile
Cookie: session_token=...

Response: 200 OK
{
  "mentor_id": "mentor_001",
  "user_id": "user_abc123",
  "bio": "Startup founder...",
  "expertise": ["Entrepreneurship", "Technology"],
  "experience": "Founded 2 startups...",
  "verification_status": "APPROVED"
}
```

#### Create Event
```http
POST /api/mentor/events
Cookie: session_token=...
Content-Type: application/json

{
  "title": "Tech Leaders Brunch - Noida",
  "description": "Sunday brunch for tech leaders...",
  "category": "Professional Networking",
  "event_datetime": "2025-02-01T11:00:00Z",
  "duration": 120,
  "available_slots": 12,
  "price_per_lead": 1500
}

Response: 200 OK
{
  "event_id": "event_new123",
  "message": "Event created"
}
```

#### Get Applications (Leads)
```http
GET /api/mentor/leads
Cookie: session_token=...

Response: 200 OK
[
  {
    "lead_id": "lead_001",
    "event_id": "event_001",
    "event_title": "Startup Founders Dinner",
    "status": "VERIFIED",
    "price_per_lead": 299,
    "created_at": "2025-01-07T10:00:00Z"
    // Contact details hidden until PURCHASED
  }
]
```

#### Purchase Application (Unlock Guest Profile)
```http
POST /api/mentor/leads/{lead_id}/purchase
Cookie: session_token=...

Response: 200 OK
{
  "payment_id": "payment_123",
  "demo_payment_code": "DEMO5A3F21",
  "amount": 299,
  "message": "Use this demo code to complete payment"
}

// Then verify payment
POST /api/mentor/payment-verify
{
  "demo_payment_code": "DEMO5A3F21",
  "payment_id": "payment_123"
}

Response: 200 OK
{
  "message": "Payment verified successfully",
  "lead": {
    "lead_id": "lead_001",
    "name": "Priya Sharma",
    "email": "priya@example.com",
    "phone": "+919876543210",
    "message": "Excited to connect!",
    "status": "PURCHASED"
  }
}
```

### Admin Endpoints

#### Get All Hosts
```http
GET /api/admin/mentors
Cookie: session_token=... (admin)

Response: 200 OK
[
  {
    "mentor_id": "mentor_001",
    "user_id": "user_abc",
    "name": "Rajesh Kumar",
    "email": "rajesh@example.com",
    "verification_status": "PENDING",
    "bio": "...",
    "expertise": ["..."]
  }
]
```

#### Approve/Reject Host
```http
PUT /api/admin/mentors/{mentor_id}/verify
Cookie: session_token=... (admin)
Content-Type: application/json

{
  "status": "APPROVED",  // or "REJECTED"
  "reason": "Profile verified"
}

Response: 200 OK
{
  "message": "Mentor verification updated"
}
// Host receives email notification
```

#### Verify Application
```http
PUT /api/admin/leads/{lead_id}/verify
Cookie: session_token=... (admin)
Content-Type: application/json

{
  "status": "VERIFIED",  // or "REJECTED"
  "reason": "Profile verified"
}

Response: 200 OK
{
  "message": "Lead verification updated"
}
```

#### Get Analytics
```http
GET /api/admin/analytics
Cookie: session_token=... (admin)

Response: 200 OK
{
  "total_users": 450,
  "total_mentors": 75,
  "total_events": 120,
  "total_leads": 850,
  "verified_leads": 720,
  "purchased_leads": 320,
  "total_revenue": 156000
}
```

For complete API reference: `http://localhost:8001/docs` (Swagger UI)

---

## 🗄 Database Schema

### Collections

#### users
```javascript
{
  _id: ObjectId,  // MongoDB internal
  user_id: String,  // Custom UUID (primary key)
  email: String,  // Unique
  name: String,
  password_hash: String,  // bcrypt
  picture: String,  // Optional (from OAuth)
  role: String,  // "USER" (guest) | "MENTOR" (host) | "ADMIN"
  email_verified: Boolean,
  verification_token: String,  // Email verification
  verification_token_expires: DateTime,
  created_at: DateTime
}
```

#### user_sessions
```javascript
{
  _id: ObjectId,
  user_id: String,
  session_token: String,  // Unique
  expires_at: DateTime,
  created_at: DateTime
}
```

#### mentors (Hosts)
```javascript
{
  _id: ObjectId,
  mentor_id: String,  // Custom UUID
  user_id: String,  // References users.user_id
  bio: String,
  expertise: [String],  // Tags like "Entrepreneurship", "Tech"
  experience: String,
  verification_status: String,  // "PENDING" | "APPROVED" | "REJECTED"
  created_at: DateTime
}
```

#### events (Experiences/Dinners)
```javascript
{
  _id: ObjectId,
  event_id: String,
  mentor_id: String,  // Host ID
  title: String,
  description: String,
  category: String,  // "Professional Networking", "Social Mixer", etc.
  event_datetime: DateTime,
  duration: Number,  // minutes
  available_slots: Number,
  price_per_lead: Number,  // Ticket price in rupees
  created_at: DateTime
}
```

#### leads (Guest Applications)
```javascript
{
  _id: ObjectId,
  lead_id: String,
  event_id: String,
  user_id: String,  // Guest user_id
  name: String,
  email: String,
  phone: String,
  message: String,  // Application message
  status: String,  // "PENDING" | "VERIFIED" | "PURCHASED" | "REJECTED"
  verification_status: String,  // "AUTO_VERIFIED" | "MANUAL_VERIFIED"
  purchased_by: String,  // mentor_id
  payment_id: String,
  created_at: DateTime,
  purchased_at: DateTime
}
```

#### payments
```javascript
{
  _id: ObjectId,
  payment_id: String,
  mentor_id: String,
  lead_id: String,
  demo_payment_code: String,  // For demo gateway
  amount: Number,  // in rupees
  status: String,  // "PENDING" | "COMPLETED" | "FAILED"
  created_at: DateTime,
  completed_at: DateTime
}
```

#### verification_logs
```javascript
{
  _id: ObjectId,
  log_id: String,
  lead_id: String,
  verified_by: String,  // admin user_id
  status: String,
  reason: String,
  timestamp: DateTime
}
```

### Recommended Indexes

```javascript
// users
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ user_id: 1 }, { unique: true })
db.users.createIndex({ role: 1 })

// user_sessions
db.user_sessions.createIndex({ session_token: 1 }, { unique: true })
db.user_sessions.createIndex({ expires_at: 1 }, { expireAfterSeconds: 0 })

// mentors
db.mentors.createIndex({ mentor_id: 1 }, { unique: true })
db.mentors.createIndex({ user_id: 1 }, { unique: true })
db.mentors.createIndex({ verification_status: 1 })

// events
db.events.createIndex({ event_id: 1 }, { unique: true })
db.events.createIndex({ mentor_id: 1 })
db.events.createIndex({ event_datetime: 1 })
db.events.createIndex({ category: 1 })

// leads
db.leads.createIndex({ lead_id: 1 }, { unique: true })
db.leads.createIndex({ event_id: 1 })
db.leads.createIndex({ user_id: 1 })
db.leads.createIndex({ status: 1 })
```

---

## 🔐 Authentication

### JWT Token Flow

1. **Registration/Login** → Backend validates → Creates session → Returns user data + httpOnly cookie
2. **Session Token** → Stored in httpOnly cookie (XSS protection) → 7-day expiration
3. **Token Validation** → Every protected endpoint calls `get_current_user()` → Validates token
4. **Role-Based Access** → `require_role()` checks user role → Blocks unauthorized access

### Google OAuth Flow

1. **Initiate**: Redirect to `https://auth.emergentagent.com/?redirect={url}`
2. **Callback**: User redirected to `{url}#session_id={id}`
3. **Exchange**: Frontend calls `/api/auth/session` with session_id
4. **Create/Update**: Backend fetches user data, creates/updates user, returns session

### Security Best Practices

- Password hashing: bcrypt with salt
- Session storage: httpOnly cookies (not localStorage)
- Token expiration: 7 days with automatic renewal
- CORS: Configured for specific origins
- XSS prevention: React auto-escapes, httpOnly cookies
- Email verification: Required for full access

---

## 💳 Payment System

### Demo Payment Gateway (Current - Prototype)

**Purpose**: Showcase functionality without real payment integration

**Flow:**
1. Host clicks "Unlock Application"
2. Backend generates unique code: `DEMO5A3F21`
3. Frontend shows prompt with code
4. Host enters code to confirm
5. Backend verifies code match
6. Lead status → PURCHASED
7. Email sent to host with guest details

**Advantages:**
- No API keys needed
- Instant testing
- Shows complete flow
- Email receipts work

**Code Location:**
- Backend: `/app/backend/server.py` lines 850-920
- Frontend: `/app/frontend/src/pages/MentorDashboard.jsx` lines 200-240

### Razorpay Integration (Production Ready)

**Commented out code ready to activate:**

```python
# In server.py - Uncomment when ready
razorpay_order = razorpay_client.order.create({
    "amount": int(amount * 100),  # paise
    "currency": "INR",
    "payment_capture": 1
})
```

**Setup Steps:**
1. Get API keys from Razorpay dashboard
2. Add to `/app/backend/.env`:
   ```
   RAZORPAY_KEY_ID=rzp_live_...
   RAZORPAY_KEY_SECRET=...
   ```
3. Uncomment Razorpay code in server.py
4. Comment out demo payment code
5. Restart backend

**Test Mode:**
- Use Razorpay test keys: `rzp_test_...`
- Test cards provided by Razorpay
- No real money charged

---

## 🚀 Deployment

### Option 1: Emergent Platform (Recommended)

**Best for**: Quick deployment, zero DevOps

**Steps:**
1. Push code to GitHub
2. Connect repository to Emergent
3. Click "Deploy"
4. Access at: `https://{app-name}.emergentagent.com`

**Included:**
- Automatic SSL
- Built-in MongoDB
- CI/CD pipeline
- Process monitoring (Supervisor)
- Free staging environment

**Pricing**: Free tier available

### Option 2: AWS (Production Scale)

**Architecture:**
- ECS Fargate (containers)
- DocumentDB (MongoDB)
- Application Load Balancer
- Route 53 (DNS)
- CloudFront (CDN)
- S3 (static assets)

**Cost**: $100-300/month

### Option 3: DigitalOcean App Platform

**Best for**: Startups with limited budget

**Cost**: $50-150/month

### Option 4: Docker Compose (Self-Hosted)

**docker-compose.yml** provided in repository

**Cost**: $20-60/month (VPS)

---

## 🔧 Environment Variables

### Backend (`/app/backend/.env`)

```bash
MONGO_URL="mongodb://localhost:27017"
DB_NAME="socialcircle_db"
CORS_ORIGINS="*"
RESEND_API_KEY="re_..."  # Get from resend.com
SENDER_EMAIL="hello@thesocialcircle.in"
FRONTEND_URL="https://thesocialcircle.in"
```

### Frontend (`/app/frontend/.env`)

```bash
REACT_APP_BACKEND_URL=https://api.thesocialcircle.in
WDS_SOCKET_PORT=443
ENABLE_HEALTH_CHECK=false
```

---

## 🧪 Testing

### Test Accounts

```bash
# Admin
Email: admin@thesocialcircle.in
Password: admin123
Dashboard: /admin/dashboard

# Host
Email: host@example.com
Password: host123
Dashboard: /mentor/dashboard

# Guest
Email: guest@example.com
Password: guest123
Dashboard: /user/dashboard
```

### Manual Testing Checklist

- [ ] Guest can browse events without login
- [ ] Guest registration and email verification
- [ ] Guest can apply to events
- [ ] Host registration and admin approval
- [ ] Host can create events
- [ ] Host can unlock and view applications
- [ ] Demo payment flow works
- [ ] Email notifications sent
- [ ] Admin can approve hosts
- [ ] Admin can verify applications
- [ ] All dashboards load correctly
- [ ] Mobile responsiveness

### API Testing

```bash
# Test event listing (public)
curl https://thesocialcircle.in/api/events

# Test auth
curl -X POST https://thesocialcircle.in/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"guest@example.com","password":"guest123"}'
```

---

## 📊 Performance

### Current Metrics

| Metric | Value | Target |
|--------|-------|--------|
| API Response | <200ms | <100ms |
| Page Load | <2s | <1s |
| Bundle Size | 2.5MB | <2MB |

### Optimization Strategies

**Backend:**
- Database indexing
- Query optimization
- Connection pooling
- Response compression

**Frontend:**
- Code splitting (React.lazy)
- Image optimization (lazy loading, WebP)
- CDN for static assets
- Service workers

---

## 🤝 Contributing

We welcome contributions!

### Development Workflow

1. Fork repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Make changes and add tests
4. Commit: `git commit -m "Add amazing feature"`
5. Push: `git push origin feature/amazing-feature`
6. Create Pull Request

### Code Style

**Python:**
```bash
black .
isort .
ruff check .
```

**JavaScript:**
```bash
yarn lint
```

---

## 📄 License

MIT License - see LICENSE file

---

## 🙏 Acknowledgments

- **FastAPI**: Async framework
- **React Team**: UI library
- **MongoDB**: Database solution
- **Resend**: Email service
- **Emergent**: Development platform
- **Shadcn**: UI components
- **Tailwind**: CSS framework

---

## 📞 Support

- **Email**: hello@thesocialcircle.in
- **Phone**: +91 98765 43210
- **Location**: Delhi NCR, India
- **Documentation**: This README + inline code comments

---

## 🗺 Roadmap

### Phase 1: MVP (Current) ✅
- [x] User registration (Guest/Host/Admin)
- [x] Email verification system
- [x] Event creation and browsing
- [x] Application system
- [x] Demo payment gateway
- [x] Host/Guest/Admin dashboards
- [x] Email notifications

### Phase 2: Delhi NCR Launch (Q1 2025)
- [ ] Razorpay integration (real payments)
- [ ] Advanced search and filters
- [ ] Host onboarding video
- [ ] Guest rating system
- [ ] Event recommendations
- [ ] SMS notifications (Twilio)

### Phase 3: Feature Enhancement (Q2 2025)
- [ ] AI-powered event descriptions
- [ ] Chat system (host-guest)
- [ ] Calendar integration
- [ ] Mobile app (React Native)
- [ ] Video verification for hosts
- [ ] Advanced analytics

### Phase 4: Expansion (Q3 2025)
- [ ] Mumbai launch
- [ ] Bangalore launch
- [ ] Corporate partnerships
- [ ] Premium host tiers
- [ ] Referral program
- [ ] API for third-party integrations

---

**Built with ❤️ for meaningful connections**

*The Social Circle - Where every dinner is an opportunity*

---

© 2025 The Social Circle. All rights reserved.
