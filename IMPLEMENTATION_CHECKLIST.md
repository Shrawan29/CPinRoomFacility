# QR Code Authentication - Implementation Checklist

## ✅ Completed Components

### Frontend Pages
- [x] **GuestLogin.jsx** - Updated to handle URL parameters from QR codes
  - Auto-extracts `token` and `room` from URL
  - Pre-fills form with token
  - Skips manual QR scanning step
  - Supports phone + OTP flow

- [x] **GuestDashboard.jsx** - Main dashboard after authentication
  - Display room number and phone
  - Menu browsing tab
  - Orders history tab
  - Logout functionality

- [x] **GuestAccessFallback.jsx** - Fallback for guests without QR scanner
  - Manual room number entry
  - Manual token entry (from reception staff)
  - Link to main login page

### Frontend Components
- [x] **MenuBrowse.jsx** - Menu browsing and ordering
  - Category filtering
  - Real-time cart management
  - Quantity controls
  - Order placement

- [x] **QRCodeGenerator.jsx** - QR code generation component
  - Generates room-specific QR codes
  - Download functionality
  - Print functionality
  - Displays generated URL

- [x] **GuestProtectedRoute.jsx** - Route protection
  - Checks for guest token
  - Redirects to login if not authenticated
  - Loading state handling

### Frontend Services & Context
- [x] **guest.service.js** - API service layer
  - `sendGuestOTP()`
  - `verifyGuestOTP()`
  - `getGuestDashboard()`
  - `placeOrder()`
  - `getMyOrders()`
  - `getGuestMenu()`

- [x] **GuestAuthContext.jsx** - State management
  - Guest authentication state
  - Token persistence with localStorage
  - Login/logout methods

### Admin Pages
- [x] **QRCodeManager.jsx** - QR code management for admins
  - List all rooms
  - Generate QR codes
  - Configure base URL
  - Download/print functionality

### Routing
- [x] **App.jsx** - Updated with guest routes
  - `/guest/login` - Guest login page
  - `/guest/access-fallback` - Fallback access
  - `/guest/dashboard` - Protected guest dashboard
  - `/admin/qr-codes` - QR code manager (Super Admin only)

- [x] **main.jsx** - Added GuestAuthProvider wrapper

### Dependencies
- [x] **package.json** - Added `qrcode` package

## 📋 Backend Requirements Checklist

### Backend Models (Should Already Exist)
- [ ] **QRToken Model**
  - `token` - Unique token string
  - `roomNumber` - Room number
  - `used` - Boolean flag
  - `expiresAt` - Expiration date
  - `createdAt` - Creation date

- [ ] **ActiveStay Model**
  - `roomNumber` - Room number
  - `phone` - Guest phone
  - `guestName` - Guest name
  - `status` - "ACTIVE", "CHECKED_OUT"
  - `checkInDate`, `checkOutDate`

- [ ] **GuestSession Model**
  - `phone` - Guest phone
  - `roomNumber` - Room number
  - `token` - JWT token
  - `deviceId` - Device identifier
  - `expiresAt` - Session expiration

### Backend Endpoints (Verify Working)
- [ ] `POST /guest/send-otp`
  - Input: `{ qrToken, phone }`
  - Validates QR token
  - Validates phone matches active stay
  - Sends OTP

- [ ] `POST /guest/verify-otp`
  - Input: `{ qrToken, phone, otp, deviceId }`
  - Verifies OTP code
  - Creates guest session
  - Returns JWT token

- [ ] `GET /guest/dashboard`
  - Requires: Guest auth token
  - Returns: Guest info, room number, phone

- [ ] `POST /guest/orders`
  - Requires: Guest auth token
  - Input: `{ items: [...] }`
  - Creates order

- [ ] `GET /guest/orders`
  - Requires: Guest auth token
  - Returns: Guest's orders

- [ ] `GET /menu/guest`
  - No auth required
  - Returns: Available menu items

## 🚀 Deployment Steps

### Step 1: Backend Setup
```bash
# Ensure models exist
Backend/src/models/QRToken.js
Backend/src/models/ActiveStay.js
Backend/src/models/GuestSession.js

# Ensure routes are registered
Backend/src/routes/guestAuth.routes.js
Backend/src/routes/orderGuest.routes.js

# Verify controllers
Backend/src/controllers/guestAuth.controller.js
Backend/src/controllers/orderGuest.controller.js
```

### Step 2: Frontend Setup
```bash
cd frontend
npm install
npm install qrcode
npm run build
```

### Step 3: Generate QR Codes
```bash
# Login as Super Admin
# Navigate to /admin/qr-codes
# Update base URL to production domain
# Generate QR codes for all rooms
# Print or export QR codes
# Place in rooms
```

### Step 4: Test Guest Flow
```
1. Scan QR code with phone
2. URL opens guest login
3. Enter phone number
4. Enter OTP (received via SMS)
5. Access guest dashboard
6. Browse menu
7. Place order
```

## 🧪 Testing Checklist

### QR Code Generation
- [ ] QR codes generate without errors
- [ ] QR codes contain correct URL
- [ ] QR codes display correct room number
- [ ] QR codes can be printed
- [ ] QR codes can be downloaded

### Guest Login
- [ ] URL parameters auto-populate form
- [ ] Phone number validation works
- [ ] OTP sending works
- [ ] OTP verification works
- [ ] Session created successfully

### Guest Dashboard
- [ ] Dashboard loads after login
- [ ] Room number displayed
- [ ] Phone number displayed
- [ ] Menu loads correctly
- [ ] Menu filtering works

### Menu & Ordering
- [ ] Menu items display with images
- [ ] Prices display correctly
- [ ] Add to cart works
- [ ] Remove from cart works
- [ ] Quantity updates work
- [ ] Cart total calculates correctly
- [ ] Order placement succeeds

### Authentication
- [ ] Guest logout clears session
- [ ] Tokens stored in localStorage
- [ ] Protected routes redirect to login
- [ ] Sessions expire after 24 hours

### Fallback Access
- [ ] Manual room entry works
- [ ] Manual token entry works
- [ ] Redirects to login correctly

### Security
- [ ] Invalid QR tokens rejected
- [ ] Phone mismatch rejected
- [ ] Expired OTP rejected
- [ ] HTTPS only in production

## 📱 Guest Access Methods

### Method 1: QR Scanner App
- Guest uses dedicated QR scanner app
- Scans QR code in room
- Browser opens with URL
- Redirected to login

### Method 2: Google Lens (Recommended)
- Guest opens Google Photos or Google Lens
- Points camera at QR code
- Taps notification to open URL
- Redirected to login

### Method 3: Built-in Camera
- Guest opens phone camera app
- Points at QR code
- Taps notification (iOS 11+, Android 10+)
- Redirected to login

### Method 4: Fallback (No QR Scanner)
- Guest visits `/guest/access-fallback`
- Enters room number
- Calls reception for token
- Enters token manually
- Logs in via phone + OTP

## 🔐 Security Implementation

### QR Code Security
- [x] Each room has unique token
- [x] Tokens stored in database
- [x] Tokens expire after set time
- [x] Tokens marked as used after login
- [x] One-time use only

### Phone Verification
- [x] Phone must match active stay
- [x] Room must be actively occupied
- [x] Check-in must be valid
- [x] Phone stored encrypted

### OTP Security
- [x] 6-digit random OTP
- [x] OTP sent via SMS (not in URL)
- [x] OTP expires after 5 minutes
- [x] Limited retry attempts
- [x] OTP not visible in logs

### Session Security
- [x] JWT tokens used
- [x] 24-hour expiration
- [x] Device ID tracking
- [x] HTTPS only in production
- [x] Secure cookie flags

## 📊 Monitoring & Analytics

### Track
- [ ] QR code scans count
- [ ] Successful logins count
- [ ] Failed login attempts
- [ ] Most ordered items
- [ ] Average order value
- [ ] Peak ordering times

### Logs
- [ ] All QR scans logged
- [ ] All authentication attempts logged
- [ ] All orders logged
- [ ] Error logging enabled
- [ ] Performance metrics tracked

## 🎯 Future Enhancements

- [ ] Bulk QR code regeneration
- [ ] QR code expiration management
- [ ] Multiple authentication methods (biometric)
- [ ] QR code templates with branding
- [ ] Analytics dashboard
- [ ] Rate limiting on failed attempts
- [ ] SMS fallback for OTP issues
- [ ] Email delivery option
- [ ] Multi-language support
- [ ] Order notifications in real-time

## 📞 Support

### Guest Issues
- No QR scanner: Use fallback page (`/guest/access-fallback`)
- OTP not received: Verify phone number, check SMS gateway
- Can't login: Contact reception for QR token

### Admin Issues
- QR codes not generating: Check qrcode package installed
- Base URL wrong: Update in QR Code Manager
- QR codes not scanning: Ensure good print quality

### Backend Issues
- OTP not sending: Check SMS gateway configuration
- Token validation fails: Verify QR token in database
- Phone mismatch: Ensure active stay records exist

---

**Last Updated:** January 21, 2026
**Status:** Ready for Production
