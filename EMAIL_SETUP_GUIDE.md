# Email Verification System - Setup Guide

## ✅ Email Verification System Implemented

The LeadBridge platform now includes a comprehensive email verification system using **Resend**.

---

## 📧 Features Implemented

### 1. **Account Email Verification**
- New users receive verification email upon registration
- Email contains secure verification link (24-hour expiry)
- Users must click link to verify their email address
- Beautiful HTML email template with branding

### 2. **Booking Confirmation Emails**
- Users receive instant email when they book an event
- Includes event details (title, date, time)
- Professional HTML template

### 3. **Lead Notification Emails**
- Mentors receive email when new verified leads are available
- Shows event name and number of new leads
- Prompts mentor to check dashboard

### 4. **Mentor Approval Emails**
- Mentors receive email when admin approves/rejects application
- Different templates for approval vs rejection
- Professional and encouraging messaging

---

## 🔑 Getting Your Resend API Key

### Step 1: Sign Up for Resend

1. Go to [https://resend.com](https://resend.com)
2. Click "Get Started" or "Sign Up"
3. Register with your email address
4. Verify your email

### Step 2: Get API Key

1. Log in to Resend Dashboard
2. Navigate to **API Keys** section
3. Click **"Create API Key"**
4. Give it a name (e.g., "LeadBridge Production")
5. Select permissions: **"Sending access"**
6. Click **"Create"**
7. Copy the API key (starts with `re_...`)
   - ⚠️ **Important**: Save it immediately! You won't see it again.

### Step 3: Add API Key to Backend

```bash
# Edit the backend .env file
nano /app/backend/.env

# Add your Resend API key
RESEND_API_KEY=re_your_actual_api_key_here
SENDER_EMAIL=onboarding@resend.dev
```

**Note**: In development/testing mode, Resend only sends emails to verified email addresses. You need to verify your test email in Resend dashboard.

### Step 4: Verify Your Test Email (Important!)

1. Go to Resend Dashboard → **Domains**
2. In testing mode, add your test email to **"Verified Emails"**
3. Click **"Add Email"**
4. Enter your test email (e.g., your personal email)
5. Check your inbox and verify the email
6. Now Resend can send emails to this address

### Step 5: Restart Backend

```bash
sudo supervisorctl restart backend
```

---

## 🧪 Testing Email Verification

### Test 1: Account Registration with Email Verification

```bash
# Test user registration
curl -X POST "https://networkhub-11.preview.emergentagent.com/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-verified-email@example.com",
    "password": "test123",
    "name": "Test User",
    "role": "USER"
  }'

# Expected response:
{
  "user_id": "user_xxx",
  "email": "your-verified-email@example.com",
  "name": "Test User",
  "role": "USER",
  "email_verified": false,
  "message": "Registration successful! Please check your email to verify your account."
}

# Check your email inbox for verification email
```

### Test 2: Email Verification Flow

1. **Register a new account** on the frontend
2. **Check your email** (the one verified in Resend)
3. **Click verification link** in email
4. Should redirect to `/verify-email?token=...`
5. Page should show success message
6. After 3 seconds, redirects to login

### Test 3: Booking Confirmation Email

```bash
# 1. Login as user
# 2. Book an event
# 3. Check email for booking confirmation

# The booking confirmation includes:
# - Event title
# - Event date and time
# - Verification status message
```

### Test 4: Mentor Approval Email

```bash
# 1. Login as admin
# 2. Approve a pending mentor
# 3. Mentor receives approval email

# Or via API:
curl -X PUT "https://networkhub-11.preview.emergentagent.com/api/admin/mentors/{mentor_id}/verify" \
  -H "Content-Type: application/json" \
  -H "Cookie: session_token=YOUR_ADMIN_TOKEN" \
  -d '{"status": "APPROVED"}'
```

---

## 📝 Email Templates

All emails use beautiful HTML templates with:
- LeadBridge branding (Deep Emerald Green gradient)
- Responsive design
- Clear call-to-action buttons
- Professional typography
- Mobile-friendly layout

### Email Types:

1. **Verification Email**
   - Subject: "Verify Your LeadBridge Account"
   - CTA: "Verify Email Address" button
   - 24-hour expiry notice

2. **Booking Confirmation**
   - Subject: "Booking Confirmed - LeadBridge"
   - Event details card
   - Next steps information

3. **Mentor Approval**
   - Subject: "Application Approved - LeadBridge"
   - Congratulations message
   - Next steps for creating events

4. **Lead Notification**
   - Subject: "New Verified Lead - LeadBridge"
   - Event name
   - Number of leads
   - Dashboard CTA

---

## 🔧 Configuration

### Environment Variables

**Backend (`/app/backend/.env`):**
```env
RESEND_API_KEY=re_your_api_key_here
SENDER_EMAIL=onboarding@resend.dev
FRONTEND_URL=https://networkhub-11.preview.emergentagent.com
```

**Important Notes:**
- `SENDER_EMAIL`: Use `onboarding@resend.dev` for testing
- For production: Set up custom domain in Resend
- `FRONTEND_URL`: Used for verification link generation

---

## 🚀 Production Setup

### Using Custom Domain for Emails

1. **Add Domain in Resend**
   - Go to Resend Dashboard → Domains
   - Click "Add Domain"
   - Enter your domain (e.g., `leadbridge.com`)
   - Follow DNS setup instructions

2. **Update Sender Email**
   ```bash
   SENDER_EMAIL=noreply@leadbridge.com
   ```

3. **Increase Sending Limits**
   - Free tier: 100 emails/day
   - Paid plans: Unlimited emails
   - Pricing: $20/month for 50k emails

---

## 🔍 Troubleshooting

### Issue: Emails Not Sending

**Check 1: API Key Configured**
```bash
cat /app/backend/.env | grep RESEND_API_KEY
```

**Check 2: Backend Logs**
```bash
tail -50 /var/log/supervisor/backend.err.log | grep -i "email"
```

**Check 3: Test Email Verified in Resend**
- Resend (free tier) only sends to verified emails
- Verify your test email in Resend dashboard

**Check 4: API Key Valid**
- Test with curl:
```bash
curl -X POST 'https://api.resend.com/emails' \
  -H 'Authorization: Bearer re_your_api_key' \
  -H 'Content-Type: application/json' \
  -d '{"from": "onboarding@resend.dev", "to": ["test@example.com"], "subject": "Test", "html": "<p>Test</p>"}'
```

### Issue: Verification Link Expired

- Verification tokens expire after 24 hours
- User needs to request new verification email
- Future enhancement: Add "Resend Verification Email" feature

### Issue: Email Goes to Spam

**Solutions:**
1. Set up custom domain with proper DNS records
2. Add SPF, DKIM, DMARC records (Resend provides these)
3. Avoid spam trigger words
4. Use plain text alternative (already implemented)

---

## 📊 Email Analytics

Resend provides:
- Delivery status
- Open rates
- Click rates
- Bounce tracking
- Spam complaints

Access via Resend Dashboard → Analytics

---

## 💰 Pricing

### Resend Pricing (as of 2025):

- **Free Tier**: 
  - 100 emails/day
  - 3,000 emails/month
  - Perfect for testing and MVP

- **Pro Plan** ($20/month):
  - 50,000 emails/month
  - $1 per additional 1,000 emails
  - Custom domains
  - Priority support

- **Enterprise**:
  - Custom pricing
  - Dedicated IP
  - 99.99% SLA

**Recommendation**: Start with free tier, upgrade when hitting limits.

---

## ✅ Implementation Checklist

- [x] Install Resend SDK
- [x] Configure environment variables
- [x] Implement email sending utility
- [x] Add verification token generation
- [x] Create verification endpoint
- [x] Design HTML email templates
- [x] Update registration flow
- [x] Add booking confirmation emails
- [x] Add mentor approval emails
- [x] Add lead notification emails
- [x] Create verify email frontend page
- [x] Update user model with email_verified field
- [x] Test email delivery

---

## 🔮 Future Enhancements

### Phase 1 (Next)
- [ ] Resend verification email feature
- [ ] Email preferences/unsubscribe
- [ ] Welcome email series for new users
- [ ] Weekly digest emails for mentors

### Phase 2
- [ ] Password reset via email
- [ ] Event reminder emails (24 hours before)
- [ ] Lead purchase receipts
- [ ] Monthly analytics emails

### Phase 3
- [ ] Email templates customization in admin panel
- [ ] A/B testing for email subject lines
- [ ] Advanced email analytics dashboard
- [ ] SMS notifications (via Twilio)

---

## 📞 Support

**Resend Documentation**: https://resend.com/docs
**Resend Status Page**: https://status.resend.com
**Support Email**: support@resend.com

**LeadBridge Support**: 
- Check logs: `/var/log/supervisor/backend.err.log`
- Backend code: `/app/backend/server.py`
- Email templates: Lines 184-390 in server.py

---

## 🎉 Summary

Your LeadBridge platform now has:
✅ Professional email verification system
✅ Automated booking confirmations
✅ Mentor approval notifications
✅ Lead alert emails
✅ Beautiful HTML templates
✅ Production-ready Resend integration

**Next Step**: Get your Resend API key and add it to `/app/backend/.env`!

---

*Last Updated: January 5, 2026*
