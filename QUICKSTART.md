# Guest QR Code Login - Quick Start Guide

## 🚀 For Developers

### Install Dependencies
```bash
cd frontend
npm install qrcode
npm install
```

### Run Development Server
```bash
npm run dev
```

### Access Points
- **Guest Login**: http://localhost:5173/guest/login
- **Guest Dashboard**: http://localhost:5173/guest/dashboard
- **QR Code Manager**: http://localhost:5173/admin/qr-codes
- **Fallback Access**: http://localhost:5173/guest/access-fallback

---

## 📱 For Guests

### How to Access Room Service

#### Method 1: Scan QR Code (Easiest)
1. Find QR code in your room
2. Open your phone camera
3. Point at QR code and wait for notification
4. Tap notification to open room service
5. Enter your phone number
6. Enter OTP sent to your phone
7. Done! Browse menu and order

#### Method 2: Google Lens
1. Open Google Lens or Google Photos
2. Point camera at QR code
3. Tap the link that appears
4. Enter your phone number
5. Enter OTP
6. Start ordering!

#### Method 3: No QR Scanner
1. Call reception desk
2. Ask for your room's QR token
3. Visit your room service link or ask staff
4. Enter your room number
5. Enter the token provided
6. Enter your phone number
7. Enter OTP
8. Start ordering!

---

## 🏨 For Hotel Staff

### Setup QR Codes

#### Step 1: Login as Super Admin
```
Username: [super admin email]
Password: [password]
```

#### Step 2: Navigate to QR Manager
```
Go to: Admin Dashboard → QR Code Manager
Or: /admin/qr-codes
```

#### Step 3: Configure
- Set Base URL: `https://yourdomain.com`
- Select rooms or generate all
- Click "Generate"

#### Step 4: Print/Download
- Click "Print" to print immediately
- Click "Download" to save as PNG

#### Step 5: Place in Rooms
- Print on 8cm × 8cm stickers
- Place on:
  - Room entrance door
  - TV stand
  - Bedside table
  - Bathroom mirror
  - Welcome card

---

## 🔧 Admin Features

### QR Code Manager
Location: `/admin/qr-codes` (Super Admin only)

**Features:**
- Generate QR codes for individual rooms
- Batch generate for multiple rooms
- Download as PNG files
- Print with room labels
- Change base URL
- View generated URLs

**How to Use:**
1. Select room from list
2. Click "Generate"
3. Choose "Print" or "Download"
4. Place in room

---

## 📊 Guest Experience

### Step-by-Step Login Process

```
1. SCAN QR CODE
   └─ Open camera or lens
   └─ Point at QR code
   └─ Tap notification

2. GUEST LOGIN PAGE LOADS
   └─ Room number pre-filled
   └─ QR token pre-filled
   └─ Ready for phone number

3. ENTER PHONE
   └─ Type: +91 XXXXX XXXXX
   └─ Click: Send OTP

4. RECEIVE OTP
   └─ SMS arrives with 6-digit code
   └─ Valid for 5 minutes

5. ENTER OTP
   └─ Type 6-digit code
   └─ Click: Verify & Login

6. SUCCESS!
   └─ Session created
   └─ Redirected to dashboard

7. BROWSE & ORDER
   └─ View menu items
   └─ Add to cart
   └─ Review order
   └─ Place order
```

---

## 🎯 Key Features

✅ **No Registration Needed**
- Guest just scans QR
- Enter phone number
- Verify with OTP
- Ready to use

✅ **Each Room Unique**
- Different QR for each room
- Pre-fills room number
- Prevents cross-room access
- Better security

✅ **Fast & Easy**
- QR scans automatically
- Phone + OTP takes 2 minutes
- Instant menu access
- One-tap ordering

✅ **Secure**
- Phone verification
- OTP authentication
- Session management
- HTTPS encryption

✅ **Multiple Access Methods**
- QR scanner apps
- Google Lens (recommended)
- Phone camera
- Manual fallback

---

## ❓ FAQ

### Q: What if the QR code doesn't scan?
**A:** Try:
- Clean the QR code
- Improve lighting
- Try different camera app
- Use Google Lens
- Call reception for manual token

### Q: What if I don't receive OTP?
**A:** 
- Check phone number is correct
- Check signal strength
- Wait 2 minutes
- Call reception to resend
- Ask staff to manually verify

### Q: Can I share my QR code?
**A:** No, each room has unique code. Sharing allows others to access your room service.

### Q: How long is my session?
**A:** 24 hours from login. You'll need to login again after checkout.

### Q: Can I use someone else's QR?
**A:** No, phone number must match the booking.

### Q: What if I lost my phone?
**A:** Call reception. They can verify your booking manually.

### Q: Is my order saved?
**A:** Yes! You can view order history in "My Orders" tab.

### Q: Can I edit my order?
**A:** Contact the kitchen directly or ask staff.

### Q: What payment methods?
**A:** Charge to room bill (managed by hotel).

---

## 📞 Support Contacts

**Guest Issues:**
- Reception: ext. 0
- Room Service: ext. 100
- Tech Support: ext. 200

**Admin Issues:**
- IT Team: admin@hotel.com
- System Admin: support@hotel.com

---

## 🔒 Security Tips

**For Guests:**
- Don't share QR codes
- Logout before checking out
- Don't share OTP with others
- Use secure WiFi only

**For Staff:**
- Generate new QR codes quarterly
- Monitor failed login attempts
- Verify guest phone matches booking
- Update base URL for new domains

**For Admins:**
- Use HTTPS in production
- Keep qrcode package updated
- Monitor authentication logs
- Enable rate limiting

---

**Version:** 1.0
**Last Updated:** January 21, 2026
**Status:** Production Ready
