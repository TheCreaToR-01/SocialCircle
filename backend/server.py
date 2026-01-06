from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, Response, Cookie
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import razorpay
import httpx
from enum import Enum
import re
import resend
import asyncio
import secrets

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

razorpay_client = razorpay.Client(auth=(os.environ.get('RAZORPAY_KEY_ID', ''), os.environ.get('RAZORPAY_KEY_SECRET', '')))

resend.api_key = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:3000')

class Role(str, Enum):
    USER = "USER"
    MENTOR = "MENTOR"
    ADMIN = "ADMIN"

class LeadStatus(str, Enum):
    PENDING = "PENDING"
    VERIFIED = "VERIFIED"
    PURCHASED = "PURCHASED"
    REJECTED = "REJECTED"

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    email: str
    name: str
    picture: Optional[str] = None
    role: Role
    email_verified: bool = False
    created_at: datetime

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    name: str
    role: Role

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class SessionRequest(BaseModel):
    session_id: str

class MentorProfile(BaseModel):
    model_config = ConfigDict(extra="ignore")
    mentor_id: str
    user_id: str
    bio: Optional[str] = None
    expertise: List[str] = []
    experience: Optional[str] = None
    verification_status: str = "PENDING"
    created_at: datetime

class MentorProfileUpdate(BaseModel):
    bio: Optional[str] = None
    expertise: Optional[List[str]] = None
    experience: Optional[str] = None

class Event(BaseModel):
    model_config = ConfigDict(extra="ignore")
    event_id: str
    mentor_id: str
    title: str
    description: str
    category: str
    event_datetime: datetime
    duration: int
    available_slots: int
    price_per_lead: float
    created_at: datetime

class EventCreate(BaseModel):
    title: str
    description: str
    category: str
    event_datetime: datetime
    duration: int
    available_slots: int
    price_per_lead: float

class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    event_datetime: Optional[datetime] = None
    duration: Optional[int] = None
    available_slots: Optional[int] = None
    price_per_lead: Optional[float] = None

class BookingCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    message: Optional[str] = None

class Lead(BaseModel):
    model_config = ConfigDict(extra="ignore")
    lead_id: str
    event_id: str
    user_id: str
    name: str
    email: str
    phone: str
    message: Optional[str] = None
    status: LeadStatus
    verification_status: str
    purchased_by: Optional[str] = None
    payment_id: Optional[str] = None
    created_at: datetime

class Payment(BaseModel):
    model_config = ConfigDict(extra="ignore")
    payment_id: str
    mentor_id: str
    lead_id: str
    razorpay_order_id: str
    razorpay_payment_id: Optional[str] = None
    amount: float
    status: str
    created_at: datetime

class VerifyLeadRequest(BaseModel):
    status: str
    reason: Optional[str] = None

class VerifyMentorRequest(BaseModel):
    status: str
    reason: Optional[str] = None

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def validate_email(email: str) -> bool:
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_phone(phone: str) -> bool:
    pattern = r'^[0-9]{10,15}$'
    return re.match(pattern, phone.replace('+', '').replace('-', '').replace(' ', '')) is not None

async def send_email_async(to_email: str, subject: str, html_content: str):
    """Send email using Resend API (async wrapper)"""
    if not resend.api_key or resend.api_key == '':
        logger.warning("Resend API key not configured, skipping email")
        return None
    
    params = {
        "from": SENDER_EMAIL,
        "to": [to_email],
        "subject": subject,
        "html": html_content
    }
    
    try:
        email = await asyncio.to_thread(resend.Emails.send, params)
        logger.info(f"Email sent to {to_email}: {email.get('id')}")
        return email
    except Exception as e:
        logger.error(f"Failed to send email to {to_email}: {str(e)}")
        return None

def generate_verification_token() -> str:
    """Generate secure random token for email verification"""
    return secrets.token_urlsafe(32)

def create_verification_email(name: str, verification_link: str) -> str:
    """Create HTML email for account verification"""
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <tr>
                            <td style="background: linear-gradient(135deg, #064E3B 0%, #065F46 100%); padding: 40px; text-align: center; border-radius: 8px 8px 0 0;">
                                <h1 style="color: #ffffff; margin: 0; font-size: 28px;">LeadBridge</h1>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 40px;">
                                <h2 style="color: #064E3B; margin-top: 0;">Welcome to LeadBridge, {name}!</h2>
                                <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                                    Thank you for signing up. Please verify your email address to activate your account and start connecting with mentors.
                                </p>
                                <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                    <tr>
                                        <td align="center">
                                            <a href="{verification_link}" style="background-color: #064E3B; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                                                Verify Email Address
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                                <p style="color: #6B7280; font-size: 14px; line-height: 1.6;">
                                    If the button doesn't work, copy and paste this link into your browser:<br>
                                    <a href="{verification_link}" style="color: #064E3B; word-break: break-all;">{verification_link}</a>
                                </p>
                                <p style="color: #6B7280; font-size: 14px; line-height: 1.6; margin-top: 30px;">
                                    This link will expire in 24 hours for security reasons.
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td style="background-color: #F3F4F6; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
                                <p style="color: #6B7280; font-size: 12px; margin: 0;">
                                    © 2025 LeadBridge. All rights reserved.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """

def create_booking_confirmation_email(user_name: str, event_title: str, event_date: str) -> str:
    """Create HTML email for booking confirmation"""
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <tr>
                            <td style="background: linear-gradient(135deg, #064E3B 0%, #065F46 100%); padding: 40px; text-align: center; border-radius: 8px 8px 0 0;">
                                <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Booking Confirmed!</h1>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 40px;">
                                <h2 style="color: #064E3B; margin-top: 0;">Hi {user_name},</h2>
                                <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                                    Your booking has been successfully submitted and is now under review.
                                </p>
                                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F3F4F6; border-radius: 6px; padding: 20px; margin: 20px 0;">
                                    <tr>
                                        <td>
                                            <p style="margin: 0 0 10px 0; color: #6B7280; font-size: 14px;"><strong>Event:</strong></p>
                                            <p style="margin: 0 0 15px 0; color: #064E3B; font-size: 16px; font-weight: bold;">{event_title}</p>
                                            <p style="margin: 0 0 10px 0; color: #6B7280; font-size: 14px;"><strong>Date:</strong></p>
                                            <p style="margin: 0; color: #374151; font-size: 14px;">{event_date}</p>
                                        </td>
                                    </tr>
                                </table>
                                <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                                    Your contact details will be verified and shared with the mentor. You'll receive a notification once the mentor reviews your booking.
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td style="background-color: #F3F4F6; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
                                <p style="color: #6B7280; font-size: 12px; margin: 0;">
                                    © 2025 LeadBridge. All rights reserved.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """

def create_mentor_approval_email(mentor_name: str, status: str) -> str:
    """Create HTML email for mentor approval/rejection"""
    is_approved = status == "APPROVED"
    title = "Application Approved!" if is_approved else "Application Update"
    message = "Congratulations! Your mentor application has been approved." if is_approved else "Thank you for your interest. Unfortunately, your mentor application was not approved at this time."
    
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <tr>
                            <td style="background: linear-gradient(135deg, #064E3B 0%, #065F46 100%); padding: 40px; text-align: center; border-radius: 8px 8px 0 0;">
                                <h1 style="color: #ffffff; margin: 0; font-size: 28px;">{title}</h1>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 40px;">
                                <h2 style="color: #064E3B; margin-top: 0;">Hi {mentor_name},</h2>
                                <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                                    {message}
                                </p>
                                {('<p style="color: #374151; font-size: 16px; line-height: 1.6;">You can now create events and start receiving verified leads from potential students!</p>' if is_approved else '')}
                            </td>
                        </tr>
                        <tr>
                            <td style="background-color: #F3F4F6; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
                                <p style="color: #6B7280; font-size: 12px; margin: 0;">
                                    © 2025 LeadBridge. All rights reserved.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """

def create_lead_notification_email(mentor_name: str, event_title: str, lead_count: int) -> str:
    """Create HTML email for new lead notification to mentor"""
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0;">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <tr>
                            <td style="background: linear-gradient(135deg, #064E3B 0%, #065F46 100%); padding: 40px; text-align: center; border-radius: 8px 8px 0 0;">
                                <h1 style="color: #ffffff; margin: 0; font-size: 28px;">New Verified Lead!</h1>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 40px;">
                                <h2 style="color: #064E3B; margin-top: 0;">Hi {mentor_name},</h2>
                                <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                                    Great news! You have {lead_count} new verified lead(s) for your event:
                                </p>
                                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F3F4F6; border-radius: 6px; padding: 20px; margin: 20px 0;">
                                    <tr>
                                        <td>
                                            <p style="margin: 0; color: #064E3B; font-size: 18px; font-weight: bold;">{event_title}</p>
                                        </td>
                                    </tr>
                                </table>
                                <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                                    Visit your dashboard to purchase and access the lead's contact details.
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td style="background-color: #F3F4F6; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
                                <p style="color: #6B7280; font-size: 12px; margin: 0;">
                                    © 2025 LeadBridge. All rights reserved.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """

async def get_current_user(request: Request, session_token: Optional[str] = Cookie(None), authorization: Optional[str] = None) -> User:
    token = session_token
    if not token and authorization:
        if authorization.startswith("Bearer "):
            token = authorization.replace("Bearer ", "")
    
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    session_doc = await db.user_sessions.find_one({"session_token": token}, {"_id": 0})
    if not session_doc:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    expires_at = session_doc["expires_at"]
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    
    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="Session expired")
    
    user_doc = await db.users.find_one({"user_id": session_doc["user_id"]}, {"_id": 0})
    if not user_doc:
        raise HTTPException(status_code=401, detail="User not found")
    
    return User(**user_doc)

async def require_role(user: User, allowed_roles: List[Role]):
    if user.role not in allowed_roles:
        raise HTTPException(status_code=403, detail="Insufficient permissions")

@api_router.post("/auth/register")
async def register(data: RegisterRequest):
    existing = await db.users.find_one({"email": data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = f"user_{uuid.uuid4().hex[:12]}"
    password_hash = hash_password(data.password)
    verification_token = generate_verification_token()
    
    user_doc = {
        "user_id": user_id,
        "email": data.email,
        "name": data.name,
        "password_hash": password_hash,
        "role": data.role.value,
        "email_verified": False,
        "verification_token": verification_token,
        "verification_token_expires": datetime.now(timezone.utc) + timedelta(hours=24),
        "created_at": datetime.now(timezone.utc)
    }
    
    await db.users.insert_one(user_doc)
    
    if data.role == Role.MENTOR:
        mentor_id = f"mentor_{uuid.uuid4().hex[:12]}"
        mentor_doc = {
            "mentor_id": mentor_id,
            "user_id": user_id,
            "verification_status": "PENDING",
            "created_at": datetime.now(timezone.utc)
        }
        await db.mentors.insert_one(mentor_doc)
    
    # Send verification email
    verification_link = f"{FRONTEND_URL}/verify-email?token={verification_token}"
    html_content = create_verification_email(data.name, verification_link)
    await send_email_async(data.email, "Verify Your LeadBridge Account", html_content)
    
    session_token = f"session_{uuid.uuid4().hex}"
    session_doc = {
        "user_id": user_id,
        "session_token": session_token,
        "expires_at": datetime.now(timezone.utc) + timedelta(days=7),
        "created_at": datetime.now(timezone.utc)
    }
    await db.user_sessions.insert_one(session_doc)
    
    response = JSONResponse(content={
        "user_id": user_id,
        "email": data.email,
        "name": data.name,
        "role": data.role.value,
        "email_verified": False,
        "message": "Registration successful! Please check your email to verify your account."
    })
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
        max_age=7*24*60*60
    )
    return response

@api_router.post("/auth/login")
async def login(data: LoginRequest):
    user_doc = await db.users.find_one({"email": data.email}, {"_id": 0})
    if not user_doc or not verify_password(data.password, user_doc.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    session_token = f"session_{uuid.uuid4().hex}"
    session_doc = {
        "user_id": user_doc["user_id"],
        "session_token": session_token,
        "expires_at": datetime.now(timezone.utc) + timedelta(days=7),
        "created_at": datetime.now(timezone.utc)
    }
    await db.user_sessions.insert_one(session_doc)
    
    response = JSONResponse(content={
        "user_id": user_doc["user_id"],
        "email": user_doc["email"],
        "name": user_doc["name"],
        "role": user_doc["role"]
    })
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
        max_age=7*24*60*60
    )
    return response

@api_router.post("/auth/session")
async def exchange_session(data: SessionRequest):
    async with httpx.AsyncClient() as http_client:
        response = await http_client.get(
            "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
            headers={"X-Session-ID": data.session_id}
        )
        if response.status_code != 200:
            raise HTTPException(status_code=400, detail="Invalid session")
        
        session_data = response.json()
    
    existing_user = await db.users.find_one({"email": session_data["email"]}, {"_id": 0})
    
    if existing_user:
        user_id = existing_user["user_id"]
        await db.users.update_one(
            {"user_id": user_id},
            {"$set": {"name": session_data["name"], "picture": session_data["picture"]}}
        )
    else:
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        user_doc = {
            "user_id": user_id,
            "email": session_data["email"],
            "name": session_data["name"],
            "picture": session_data.get("picture"),
            "role": "USER",
            "created_at": datetime.now(timezone.utc)
        }
        await db.users.insert_one(user_doc)
    
    session_token = session_data["session_token"]
    session_doc = {
        "user_id": user_id,
        "session_token": session_token,
        "expires_at": datetime.now(timezone.utc) + timedelta(days=7),
        "created_at": datetime.now(timezone.utc)
    }
    await db.user_sessions.insert_one(session_doc)
    
    user_doc = await db.users.find_one({"user_id": user_id}, {"_id": 0})
    response = JSONResponse(content={
        "user_id": user_doc["user_id"],
        "email": user_doc["email"],
        "name": user_doc["name"],
        "role": user_doc["role"],
        "picture": user_doc.get("picture")
    })
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
        max_age=7*24*60*60
    )
    return response

@api_router.get("/auth/me")
async def get_me(request: Request, session_token: Optional[str] = Cookie(None), authorization: Optional[str] = None):
    user = await get_current_user(request, session_token, authorization)
    return user

@api_router.post("/auth/logout")
async def logout(user: User = Depends(get_current_user), session_token: Optional[str] = Cookie(None)):
    if session_token:
        await db.user_sessions.delete_one({"session_token": session_token})
    response = JSONResponse(content={"message": "Logged out"})
    response.delete_cookie("session_token", path="/")
    return response

@api_router.get("/events")
async def get_events():
    events = await db.events.find({}, {"_id": 0}).to_list(1000)
    for event in events:
        if isinstance(event['event_datetime'], str):
            event['event_datetime'] = datetime.fromisoformat(event['event_datetime'])
        if isinstance(event['created_at'], str):
            event['created_at'] = datetime.fromisoformat(event['created_at'])
        
        mentor = await db.mentors.find_one({"mentor_id": event["mentor_id"]}, {"_id": 0})
        if mentor and mentor.get("verification_status") == "APPROVED":
            user = await db.users.find_one({"user_id": mentor["user_id"]}, {"_id": 0})
            event["mentor_name"] = user.get("name", "Unknown")
    
    return [e for e in events if e.get("mentor_name")]

@api_router.get("/events/{event_id}")
async def get_event(event_id: str):
    event = await db.events.find_one({"event_id": event_id}, {"_id": 0})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    if isinstance(event['event_datetime'], str):
        event['event_datetime'] = datetime.fromisoformat(event['event_datetime'])
    if isinstance(event['created_at'], str):
        event['created_at'] = datetime.fromisoformat(event['created_at'])
    
    mentor = await db.mentors.find_one({"mentor_id": event["mentor_id"]}, {"_id": 0})
    if mentor:
        user = await db.users.find_one({"user_id": mentor["user_id"]}, {"_id": 0})
        event["mentor_name"] = user.get("name", "Unknown")
        event["mentor_bio"] = mentor.get("bio", "")
        event["mentor_expertise"] = mentor.get("expertise", [])
    
    return event

@api_router.post("/events/{event_id}/book")
async def book_event(event_id: str, data: BookingCreate, user: User = Depends(get_current_user)):
    await require_role(user, [Role.USER])
    
    event = await db.events.find_one({"event_id": event_id})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    if event.get("available_slots", 0) <= 0:
        raise HTTPException(status_code=400, detail="No slots available")
    
    is_valid_email = validate_email(data.email)
    is_valid_phone = validate_phone(data.phone)
    
    verification_status = "AUTO_VERIFIED" if (is_valid_email and is_valid_phone) else "PENDING"
    
    lead_id = f"lead_{uuid.uuid4().hex[:12]}"
    lead_doc = {
        "lead_id": lead_id,
        "event_id": event_id,
        "user_id": user.user_id,
        "name": data.name,
        "email": data.email,
        "phone": data.phone,
        "message": data.message,
        "status": LeadStatus.VERIFIED.value if verification_status == "AUTO_VERIFIED" else LeadStatus.PENDING.value,
        "verification_status": verification_status,
        "created_at": datetime.now(timezone.utc)
    }
    await db.leads.insert_one(lead_doc)
    
    await db.events.update_one(
        {"event_id": event_id},
        {"$inc": {"available_slots": -1}}
    )
    
    return {"lead_id": lead_id, "message": "Booking successful"}

@api_router.get("/user/bookings")
async def get_user_bookings(user: User = Depends(get_current_user)):
    await require_role(user, [Role.USER])
    
    leads = await db.leads.find({"user_id": user.user_id}, {"_id": 0}).to_list(1000)
    for lead in leads:
        if isinstance(lead.get('created_at'), str):
            lead['created_at'] = datetime.fromisoformat(lead['created_at'])
        event = await db.events.find_one({"event_id": lead["event_id"]}, {"_id": 0})
        if event:
            lead["event_title"] = event.get("title", "Unknown")
    
    return leads

@api_router.get("/mentor/profile")
async def get_mentor_profile(user: User = Depends(get_current_user)):
    await require_role(user, [Role.MENTOR])
    
    mentor = await db.mentors.find_one({"user_id": user.user_id}, {"_id": 0})
    if not mentor:
        raise HTTPException(status_code=404, detail="Mentor profile not found")
    
    return mentor

@api_router.put("/mentor/profile")
async def update_mentor_profile(data: MentorProfileUpdate, user: User = Depends(get_current_user)):
    await require_role(user, [Role.MENTOR])
    
    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")
    
    await db.mentors.update_one(
        {"user_id": user.user_id},
        {"$set": update_data}
    )
    
    return {"message": "Profile updated"}

@api_router.get("/mentor/events")
async def get_mentor_events(user: User = Depends(get_current_user)):
    await require_role(user, [Role.MENTOR])
    
    mentor = await db.mentors.find_one({"user_id": user.user_id}, {"_id": 0})
    if not mentor:
        raise HTTPException(status_code=404, detail="Mentor profile not found")
    
    events = await db.events.find({"mentor_id": mentor["mentor_id"]}, {"_id": 0}).to_list(1000)
    for event in events:
        if isinstance(event['event_datetime'], str):
            event['event_datetime'] = datetime.fromisoformat(event['event_datetime'])
        if isinstance(event['created_at'], str):
            event['created_at'] = datetime.fromisoformat(event['created_at'])
    
    return events

@api_router.post("/mentor/events")
async def create_event(data: EventCreate, user: User = Depends(get_current_user)):
    await require_role(user, [Role.MENTOR])
    
    mentor = await db.mentors.find_one({"user_id": user.user_id}, {"_id": 0})
    if not mentor:
        raise HTTPException(status_code=404, detail="Mentor profile not found")
    
    if mentor.get("verification_status") != "APPROVED":
        raise HTTPException(status_code=403, detail="Mentor not verified")
    
    event_id = f"event_{uuid.uuid4().hex[:12]}"
    event_doc = {
        "event_id": event_id,
        "mentor_id": mentor["mentor_id"],
        **data.model_dump(),
        "created_at": datetime.now(timezone.utc)
    }
    await db.events.insert_one(event_doc)
    
    return {"event_id": event_id, "message": "Event created"}

@api_router.put("/mentor/events/{event_id}")
async def update_event(event_id: str, data: EventUpdate, user: User = Depends(get_current_user)):
    await require_role(user, [Role.MENTOR])
    
    mentor = await db.mentors.find_one({"user_id": user.user_id}, {"_id": 0})
    event = await db.events.find_one({"event_id": event_id})
    
    if not event or event.get("mentor_id") != mentor.get("mentor_id"):
        raise HTTPException(status_code=404, detail="Event not found")
    
    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    if update_data:
        await db.events.update_one({"event_id": event_id}, {"$set": update_data})
    
    return {"message": "Event updated"}

@api_router.delete("/mentor/events/{event_id}")
async def delete_event(event_id: str, user: User = Depends(get_current_user)):
    await require_role(user, [Role.MENTOR])
    
    mentor = await db.mentors.find_one({"user_id": user.user_id}, {"_id": 0})
    event = await db.events.find_one({"event_id": event_id})
    
    if not event or event.get("mentor_id") != mentor.get("mentor_id"):
        raise HTTPException(status_code=404, detail="Event not found")
    
    await db.events.delete_one({"event_id": event_id})
    return {"message": "Event deleted"}

@api_router.get("/mentor/leads")
async def get_mentor_leads(user: User = Depends(get_current_user)):
    await require_role(user, [Role.MENTOR])
    
    mentor = await db.mentors.find_one({"user_id": user.user_id}, {"_id": 0})
    if not mentor:
        raise HTTPException(status_code=404, detail="Mentor profile not found")
    
    events = await db.events.find({"mentor_id": mentor["mentor_id"]}, {"_id": 0}).to_list(1000)
    event_ids = [e["event_id"] for e in events]
    
    leads = await db.leads.find({"event_id": {"$in": event_ids}, "status": {"$in": ["VERIFIED", "PURCHASED"]}}, {"_id": 0}).to_list(1000)
    
    for lead in leads:
        if isinstance(lead.get('created_at'), str):
            lead['created_at'] = datetime.fromisoformat(lead['created_at'])
        event = await db.events.find_one({"event_id": lead["event_id"]}, {"_id": 0})
        if event:
            lead["event_title"] = event.get("title", "Unknown")
            lead["price_per_lead"] = event.get("price_per_lead", 0)
        
        if lead.get("status") != "PURCHASED":
            lead.pop("email", None)
            lead.pop("phone", None)
            lead.pop("message", None)
    
    return leads

@api_router.post("/mentor/leads/{lead_id}/purchase")
async def purchase_lead(lead_id: str, user: User = Depends(get_current_user)):
    await require_role(user, [Role.MENTOR])
    
    lead = await db.leads.find_one({"lead_id": lead_id}, {"_id": 0})
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    if lead.get("status") == "PURCHASED":
        raise HTTPException(status_code=400, detail="Lead already purchased")
    
    if lead.get("status") != "VERIFIED":
        raise HTTPException(status_code=400, detail="Lead not verified yet")
    
    event = await db.events.find_one({"event_id": lead["event_id"]}, {"_id": 0})
    mentor = await db.mentors.find_one({"user_id": user.user_id}, {"_id": 0})
    
    if event.get("mentor_id") != mentor.get("mentor_id"):
        raise HTTPException(status_code=403, detail="Not authorized")
    
    amount = int(event.get("price_per_lead", 0) * 100)
    
    razorpay_order = razorpay_client.order.create({
        "amount": amount,
        "currency": "INR",
        "payment_capture": 1
    })
    
    payment_id = f"payment_{uuid.uuid4().hex[:12]}"
    payment_doc = {
        "payment_id": payment_id,
        "mentor_id": mentor["mentor_id"],
        "lead_id": lead_id,
        "razorpay_order_id": razorpay_order["id"],
        "amount": event.get("price_per_lead", 0),
        "status": "CREATED",
        "created_at": datetime.now(timezone.utc)
    }
    await db.payments.insert_one(payment_doc)
    
    return {
        "order_id": razorpay_order["id"],
        "amount": amount,
        "currency": "INR",
        "key": os.environ.get('RAZORPAY_KEY_ID', '')
    }

@api_router.post("/mentor/payment-verify")
async def verify_payment(request: Request, user: User = Depends(get_current_user)):
    await require_role(user, [Role.MENTOR])
    
    body = await request.json()
    razorpay_payment_id = body.get("razorpay_payment_id")
    razorpay_order_id = body.get("razorpay_order_id")
    razorpay_signature = body.get("razorpay_signature")
    
    try:
        razorpay_client.utility.verify_payment_signature({
            'razorpay_order_id': razorpay_order_id,
            'razorpay_payment_id': razorpay_payment_id,
            'razorpay_signature': razorpay_signature
        })
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid payment signature")
    
    payment = await db.payments.find_one({"razorpay_order_id": razorpay_order_id}, {"_id": 0})
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    await db.payments.update_one(
        {"payment_id": payment["payment_id"]},
        {"$set": {"razorpay_payment_id": razorpay_payment_id, "status": "COMPLETED"}}
    )
    
    mentor = await db.mentors.find_one({"user_id": user.user_id}, {"_id": 0})
    await db.leads.update_one(
        {"lead_id": payment["lead_id"]},
        {"$set": {"status": "PURCHASED", "purchased_by": mentor["mentor_id"], "payment_id": payment["payment_id"]}}
    )
    
    lead = await db.leads.find_one({"lead_id": payment["lead_id"]}, {"_id": 0})
    return {"message": "Payment verified", "lead": lead}

@api_router.get("/admin/users")
async def get_all_users(user: User = Depends(get_current_user)):
    await require_role(user, [Role.ADMIN])
    
    users = await db.users.find({}, {"_id": 0, "password_hash": 0}).to_list(1000)
    return users

@api_router.get("/admin/mentors")
async def get_all_mentors(user: User = Depends(get_current_user)):
    await require_role(user, [Role.ADMIN])
    
    mentors = await db.mentors.find({}, {"_id": 0}).to_list(1000)
    for mentor in mentors:
        user_doc = await db.users.find_one({"user_id": mentor["user_id"]}, {"_id": 0})
        mentor["name"] = user_doc.get("name", "Unknown")
        mentor["email"] = user_doc.get("email", "Unknown")
    
    return mentors

@api_router.put("/admin/mentors/{mentor_id}/verify")
async def verify_mentor(mentor_id: str, data: VerifyMentorRequest, user: User = Depends(get_current_user)):
    await require_role(user, [Role.ADMIN])
    
    mentor = await db.mentors.find_one({"mentor_id": mentor_id})
    if not mentor:
        raise HTTPException(status_code=404, detail="Mentor not found")
    
    await db.mentors.update_one(
        {"mentor_id": mentor_id},
        {"$set": {"verification_status": data.status}}
    )
    
    return {"message": "Mentor verification updated"}

@api_router.get("/admin/leads")
async def get_all_leads(user: User = Depends(get_current_user)):
    await require_role(user, [Role.ADMIN])
    
    leads = await db.leads.find({}, {"_id": 0}).to_list(1000)
    for lead in leads:
        if isinstance(lead.get('created_at'), str):
            lead['created_at'] = datetime.fromisoformat(lead['created_at'])
        event = await db.events.find_one({"event_id": lead["event_id"]}, {"_id": 0})
        if event:
            lead["event_title"] = event.get("title", "Unknown")
    
    return leads

@api_router.put("/admin/leads/{lead_id}/verify")
async def verify_lead(lead_id: str, data: VerifyLeadRequest, user: User = Depends(get_current_user)):
    await require_role(user, [Role.ADMIN])
    
    lead = await db.leads.find_one({"lead_id": lead_id})
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    update_data = {
        "status": data.status,
        "verification_status": "MANUAL_VERIFIED" if data.status == "VERIFIED" else "REJECTED"
    }
    
    await db.leads.update_one(
        {"lead_id": lead_id},
        {"$set": update_data}
    )
    
    log_doc = {
        "log_id": f"log_{uuid.uuid4().hex[:12]}",
        "lead_id": lead_id,
        "verified_by": user.user_id,
        "status": data.status,
        "reason": data.reason,
        "timestamp": datetime.now(timezone.utc)
    }
    await db.verification_logs.insert_one(log_doc)
    
    return {"message": "Lead verification updated"}

@api_router.get("/admin/analytics")
async def get_analytics(user: User = Depends(get_current_user)):
    await require_role(user, [Role.ADMIN])
    
    total_users = await db.users.count_documents({"role": "USER"})
    total_mentors = await db.mentors.count_documents({})
    total_events = await db.events.count_documents({})
    total_leads = await db.leads.count_documents({})
    verified_leads = await db.leads.count_documents({"status": "VERIFIED"})
    purchased_leads = await db.leads.count_documents({"status": "PURCHASED"})
    
    payments = await db.payments.find({"status": "COMPLETED"}, {"_id": 0}).to_list(1000)
    total_revenue = sum(p.get("amount", 0) for p in payments)
    
    return {
        "total_users": total_users,
        "total_mentors": total_mentors,
        "total_events": total_events,
        "total_leads": total_leads,
        "verified_leads": verified_leads,
        "purchased_leads": purchased_leads,
        "total_revenue": total_revenue
    }

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
