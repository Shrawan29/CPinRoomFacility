# QR Code URL Reference Guide

## 🔗 Complete URL Structure

### Guest Portal URLs

#### 1. Guest Login with QR Parameters
```
https://yourdomain.com/guest/login?token=QRTOKEN&room=ROOMNUMBER

Example:
https://yourdomain.com/guest/login?token=room_101_1705832400000&room=101

Parameters:
- token: Unique QR token (e.g., room_101_1705832400000)
- room: Room number for display (e.g., 101)

This is what the QR code contains!
```

#### 2. Guest Login Without Parameters (Manual)
```
https://yourdomain.com/guest/login

User will:
- See login form
- Can manually enter token (if provided by staff)
- Or use fallback page instead
```

#### 3. Guest Dashboard (Protected)
```
https://yourdomain.com/guest/dashboard

Requires:
- Valid guest token in localStorage
- If not authenticated: redirects to /guest/login
```

#### 4. Fallback Access Page
```
https://yourdomain.com/guest/access-fallback

Purpose:
- Manual room number entry
- Manual token entry from staff
- Then redirects to /guest/login with parameters
```

---

## 🎯 Admin URLs

#### 1. QR Code Manager
```
https://yourdomain.com/admin/qr-codes

Access:
- Super Admin only
- Generate QR codes
- Download/Print
- Configure base URL
```

---

## 📋 URL Parameter Reference

### Guest Login Parameters

| Parameter | Type | Example | Required | Purpose |
|-----------|------|---------|----------|---------|
| `token` | String | `room_101_1705832400000` | ✅ Yes | QR authentication token |
| `room` | String/Number | `101` | ❌ No | Room number for display |

### How Parameters Work

```
URL: https://hotel.com/guest/login?token=ABC123&room=101

JavaScript Extraction:
const [searchParams] = useSearchParams();
const token = searchParams.get("token");    // Returns "ABC123"
const room = searchParams.get("room");      // Returns "101"

Form Pre-Population:
setFormData({ qrToken: token });           // Form qrToken = "ABC123"
setRoomNumber(room);                        // Display Room #101
```

---

## 🔄 QR Code URL Generation Process

### Step 1: Admin Generates QR
```
QR Code Manager page opens
↓
Admin selects room 101
↓
Component generates URL:
  baseURL = "https://hotel.com"
  qrToken = "room_101_1705832400000"
  room = "101"
  
  fullURL = https://hotel.com/guest/login?token=room_101_1705832400000&room=101
  
↓
URL encoded into QR code using qrcode library
↓
QR code displayed/downloaded/printed
```

### Step 2: Guest Scans QR
```
Guest scans with camera/lens
↓
QR decoder reads: https://hotel.com/guest/login?token=room_101_1705832400000&room=101
↓
Browser navigates to that URL
↓
Frontend receives URL with parameters
↓
GuestLogin component extracts parameters
↓
Form pre-populated
↓
Guest enters phone and OTP
↓
Login successful
```

---

## 🛠️ Development URLs

### Local Development
```
Guest Login:           http://localhost:5173/guest/login
Guest Login with QR:   http://localhost:5173/guest/login?token=room_101_1705832400000&room=101
Guest Dashboard:       http://localhost:5173/guest/dashboard
Fallback Access:       http://localhost:5173/guest/access-fallback
QR Code Manager:       http://localhost:5173/admin/qr-codes
```

### Production URLs
```
Guest Login:           https://yourdomain.com/guest/login
Guest Login with QR:   https://yourdomain.com/guest/login?token=room_101_1705832400000&room=101
Guest Dashboard:       https://yourdomain.com/guest/dashboard
Fallback Access:       https://yourdomain.com/guest/access-fallback
QR Code Manager:       https://yourdomain.com/admin/qr-codes
```

---

## 🗝️ Token Format Examples

### QR Token Formats
```
Format: room_{roomNumber}_{timestamp}

Examples:
- room_101_1705832400000    (Room 101, Jan 21 2025)
- room_102_1705832450123    (Room 102, different time)
- room_103_1705832500456    (Room 103)
- room_301_1705832550789    (Suite 301)

In Production (Optional Enhancement):
- room_101_abc123def456      (With unique hash)
- qrtoken_abcdef123456       (Custom format)
```

---

## 📱 How URLs Appear in Different Devices

### iOS Safari
```
QR Code → Notification appears
         "Open URL?" → Tap
         → Redirects to:
https://yourdomain.com/guest/login?token=...&room=101
```

### Android Chrome
```
QR Code → Notification appears
         "Visit page" → Tap
         → Redirects to:
https://yourdomain.com/guest/login?token=...&room=101
```

### Google Lens
```
QR Code → Google Lens recognizes
         "Open URL" → Tap
         → Redirects to:
https://yourdomain.com/guest/login?token=...&room=101
```

---

## 🔗 API Endpoints Used by URLs

### When Guest Login Page Loads with Parameters
```
GET /guest/login?token=XXX&room=101

Frontend does:
1. Extract parameters from URL
2. Auto-populate form
3. Wait for guest action

Then guest enters phone:
POST /guest/send-otp
{
  qrToken: "room_101_1705832400000",
  phone: "+91XXXXXXXXXX"
}

Then guest enters OTP:
POST /guest/verify-otp
{
  qrToken: "room_101_1705832400000",
  phone: "+91XXXXXXXXXX",
  otp: "123456",
  deviceId: "device_12345"
}
```

---

## 🎨 URL Customization Examples

### Example 1: Simple Format
```
Base: https://hotel.com
Pattern: /guest/login?token={token}&room={room}
Result: https://hotel.com/guest/login?token=ABC123&room=101
```

### Example 2: With Subdomain
```
Base: https://guest.hotel.com
Pattern: /login?token={token}&room={room}
Result: https://guest.hotel.com/login?token=ABC123&room=101
```

### Example 3: With Path Prefix
```
Base: https://hotel.com/services/rooms
Pattern: /guest/login?token={token}&room={room}
Result: https://hotel.com/services/rooms/guest/login?token=ABC123&room=101
```

### Example 4: With Port (Development)
```
Base: http://localhost:3000
Pattern: /guest/login?token={token}&room={room}
Result: http://localhost:3000/guest/login?token=ABC123&room=101
```

---

## 🔐 URL Security Considerations

### ✅ Safe
```
✓ HTTPS protocol (production)
✓ Token in URL (single-use)
✓ Phone verified backend
✓ OTP required for login
✓ Token expires in DB
```

### ⚠️ Important Notes
```
⚠️ Token visible in URL (but single-use only)
⚠️ Room number visible in URL (acceptable, it's display only)
⚠️ Don't use sensitive data in URL (we don't)
⚠️ Always use HTTPS in production
⚠️ Tokens expire quickly
```

### 🔒 How It's Secure Despite Token in URL
```
1. Token is single-use only
   - Marked as "used" after OTP verification
   - Can't be reused even if leaked

2. Backend validates everything
   - Checks token validity
   - Checks phone matches booking
   - Requires OTP verification
   - Creates session only after all checks pass

3. Additional protections
   - Phone must match active stay
   - OTP required (not in URL)
   - Session expires in 24 hours
   - Device ID tracking
   - HTTPS encrypts URL transmission
```

---

## 📊 URL Parameter Usage Examples

### Scenario 1: Normal Guest Login
```
1. Guest scans QR code in room
   QR contains: https://hotel.com/guest/login?token=room_101_1705832400000&room=101

2. URL loads with parameters
   - token: room_101_1705832400000 ← Backend will validate
   - room: 101 ← Just for display

3. Frontend code:
   const token = searchParams.get("token");
   const room = searchParams.get("room");
   
   setFormData({ qrToken: token });
   setRoomNumber(room);
   
4. Guest sees:
   "🏨 Room Service"
   "Room #101"
   [Phone input field]
   [Send OTP button]
```

### Scenario 2: Direct Navigation (No QR)
```
1. Guest visits: https://hotel.com/guest/login
   (No parameters)

2. Frontend code:
   const token = searchParams.get("token");  // null
   
   if (!token) {
     // Start with empty form
     setStep("qr"); // Or show fallback option
   }

3. Guest options:
   a) Can scan QR manually
   b) Can use fallback method
   c) Can try direct entry
```

### Scenario 3: Using Fallback Method
```
1. Guest visits: https://hotel.com/guest/access-fallback

2. Guest enters:
   - Room: 101
   - Token (from reception): room_101_1705832400000

3. Frontend redirects to:
   https://hotel.com/guest/login?token=room_101_1705832400000&room=101

4. Same as Scenario 1 from here
```

---

## 🧪 Testing URLs

### Test Case 1: Valid QR URL
```
URL: http://localhost:5173/guest/login?token=room_101_1705832400000&room=101
Expected: 
- Form pre-populated with room 101
- Ready for phone input
- Token stored in component state
Status: ✅ Pass
```

### Test Case 2: Missing Room Parameter
```
URL: http://localhost:5173/guest/login?token=room_101_1705832400000
Expected:
- Form still works with token
- Room number not displayed
- Phone input ready
Status: ✅ Pass
```

### Test Case 3: Missing Token Parameter
```
URL: http://localhost:5173/guest/login?room=101
Expected:
- Room displayed but can't proceed
- User needs token
- Can use fallback method
Status: ✅ Pass
```

### Test Case 4: No Parameters
```
URL: http://localhost:5173/guest/login
Expected:
- Empty form
- User can manually scan
- Can use fallback method
Status: ✅ Pass
```

### Test Case 5: Invalid Token Format
```
URL: http://localhost:5173/guest/login?token=invalid&room=101
Expected:
- Form pre-fills with token
- Backend will reject on OTP send
- Error message shown
Status: ✅ Pass
```

---

## 📐 URL Encoding (Important for Special Characters)

### Characters in URLs
```
Raw Token: room_101_@#$%^&*(
Encoded: room_101_%40%23%24%25%5E%26%2A%28

But our tokens are simple, so this isn't an issue:
room_101_1705832400000
→ No encoding needed (alphanumerics, underscore, hyphen are safe)
```

### URL Encoding Chart (if needed)
```
! → %21
@ → %40
# → %23
$ → %24
% → %25
^ → %5E
& → %26
* → %2A
( → %28
) → %29
```

---

## 🎯 Final URL Reference Summary

```
┌──────────────────────────────────────────────────────┐
│         COMPLETE GUEST PORTAL URL STRUCTURE          │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Main URL:                                           │
│  https://yourdomain.com/guest/login                 │
│                                                      │
│  With QR Parameters (what QR codes contain):        │
│  https://yourdomain.com/guest/login                 │
│    ?token=room_101_1705832400000                    │
│    &room=101                                         │
│                                                      │
│  Dashboard (after login):                           │
│  https://yourdomain.com/guest/dashboard             │
│                                                      │
│  Fallback Access:                                    │
│  https://yourdomain.com/guest/access-fallback       │
│                                                      │
│  Admin QR Manager:                                   │
│  https://yourdomain.com/admin/qr-codes              │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

**Last Updated:** January 21, 2026
**Version:** 1.0
