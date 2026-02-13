# Guest Authentication Migration Guide

## Overview
The system has been completely redesigned to remove OTP-based authentication and ActiveStay admin management. Guests now log in directly using their name and a password format of `guestname_roomno`.

## What Changed

### 1. **Backend - Model Changes**

#### New: `GuestCredential` Model
- **File**: `Backend/src/models/GuestCredential.js`
- **Purpose**: Stores guest login credentials (name, room number, password hash)
- **Fields**:
  - `guestName`: Display name for the guest
  - `roomNumber`: Room they're assigned to
  - `passwordHash`: Hashed password (format: `guestname_roomno`)
  - `status`: ACTIVE or INACTIVE

#### Updated: `GuestSession` Model
- **File**: `Backend/src/models/GuestSession.js`
- **Removed**: `phone`, `deviceId` fields
- **Added**: `guestName` field
- **Updated**: `expiresAt` extended to 7 days (from 2 days)

#### Deprecated: `GuestOTP` & `ActiveStay` Models
- No longer used
- Can be archived/deleted after migration

### 2. **Backend - Controller Changes**

#### `guestAuth.controller.js`
- **New Endpoint**: `POST /guest/auth/login`
  - Accepts: `guestName`, `roomNumber`, `password`
  - Validates guest credentials against `GuestCredential` model
  - Creates session in `GuestSession` model

- **Deprecated Endpoints**: 
  - `POST /guest/auth/send-otp` (returns 410 Gone)
  - `POST /guest/auth/verify-otp` (returns 410 Gone)

#### `qr.controller.js`
- **Before**: Generated temporary QR tokens with 5-min expiry
- **After**: Validates room exists and redirects directly to login page
- **QR Flow**:
  1. Guest scans QR code with room number
  2. Backend validates room exists
  3. Redirects to: `/guest/login?room=101`

### 3. **Backend - Middleware Changes**

#### `guestAuth.middleware.js`
- **Before**: Checked ActiveStay status and phone number
- **After**: Only validates session exists and hasn't expired
- **Context**: Sets `req.guest.guestName` and `req.guest.roomNumber`

### 4. **Frontend - Service Changes**

#### `guest.service.js`
- **New Function**: `guestLogin(guestName, roomNumber, password)`
- **Deprecated Functions**: `sendGuestOTP()`, `verifyGuestOTP()`

#### `GuestLogin.jsx` Page
- **Before**: Two-step OTP flow
- **After**: Single-form login with name and password
- **Form Fields**:
  - Guest Name (text input)
  - Password (password input)
  - Room Number (pre-filled from QR scan)
- **Password Hint**: Shows `guestname_roomno` format

### 5. **Database - New Routes**

```
POST /guest/auth/login
  Body: {
    guestName: "Guest_101",
    roomNumber: "101", 
    password: "guest_101_101"
  }
  Response: {
    token: "session_id",
    guest: { guestName, roomNumber }
  }
```

## Setup Instructions

### Step 1: Install Dependencies
```bash
cd Backend
npm install
```

### Step 2: Seed Guest Credentials
```bash
# Create credentials for all rooms
node scripts/seedGuestCredentials.js
```

This script will:
- Create one guest credential per room
- Guest name: `Guest_{roomNumber}` (e.g., `Guest_101`)
- Password: `guest_{roomnumber}_{roomnumber}` (e.g., `guest_101_101`)
- All credentials start in ACTIVE status

### Step 3: Verify Setup
```bash
# Check debug endpoints
curl http://localhost:3000/debug/guest-credentials
curl http://localhost:3000/debug/rooms
```

## QR Code Generation

### Old Flow (Deprecated)
```
QR Code → Scanned → Token Generated → 5-min expiry → Login with Phone + OTP
```

### New Flow
```
QR Code → Scanned → Room Validated → Redirects to Login with Room Number
```

### QR Code URL Format
- **Old**: `https://api.example.com/qr/scan/{roomNumber}` → Generated token
- **New**: `https://api.example.com/qr/scan/{roomNumber}` → Redirects to `/guest/login?room={roomNumber}`

The QR code itself should encode the room number directly:
```
QR encodes: https://api.example.com/qr/scan/101
Backend redirects to: http://frontend.com/guest/login?room=101
```

## Guest Login Flow

### Step 1: Scan QR Code
- Guest opens camera/QR scanner
- Scans QR code (contains room number)

### Step 2: Backend Processes QR
- Backend validates room exists in `Room` collection
- Redirects to frontend login page with room number

### Step 3: Enter Credentials
- Guest enters their name (e.g., `Guest_101`)
- Guest enters password (e.g., `guest_101_101`)
- Frontend sends to `/guest/auth/login`

### Step 4: Create Session
- Backend validates credentials against `GuestCredential`
- Creates session record in `GuestSession`
- Returns session token
- Guest is logged in for 7 days

## Migration Checklist

- [ ] Run `seedGuestCredentials.js` to populate guest credentials
- [ ] Test QR scanning with room number
- [ ] Test guest login with sample credentials
- [ ] Verify session token is stored in localStorage
- [ ] Test guest dashboard access
- [ ] Test order placement (uses `roomNumber` from session)
- [ ] Archive/backup `ActiveStay` collection
- [ ] Optional: Delete deprecated OTP-related models and scripts

## Troubleshooting

### "Invalid guest name or room number"
- Check `GuestCredential` collection has the guest
- Verify room number matches exactly
- Run `node scripts/seedGuestCredentials.js` again if needed

### "Invalid password"
- Ensure password format is correct: `guestname_roomno` (lowercase)
- Default credentials follow pattern: `guest_101_101` for room 101

### "Invalid or expired QR token" (Old Error)
- This error no longer occurs
- Old QR tokens can be ignored/archived

### QR Redirect Not Working
- Verify room number in QR code matches database
- Check `FRONTEND_URL` environment variable
- Ensure `/debug/rooms` shows the room numbers

## API Endpoints Reference

### Public Endpoints
- `POST /guest/auth/login` - Guest login with credentials
- `GET /qr/scan/:roomNumber` - QR code redirect

### Protected Endpoints (Require `x-guest-session` header)
- `GET /guest/dashboard` - Get guest session info
- `POST /guest/orders` - Place order
- `GET /guest/orders` - Get guest's orders

### Debug Endpoints (Development Only)
- `GET /debug/guest-credentials` - List all guest credentials
- `GET /debug/guest-sessions` - List active sessions
- `GET /debug/rooms` - List all rooms
- `GET /health` - Server health check

## Environment Variables

No new environment variables added. Existing variables still apply:
- `MONGO_URI` - MongoDB connection string
- `FRONTEND_URL` - Frontend URL for redirects
- `PORT` - Server port
- `JWT_SECRET` - For admin authentication (unchanged)

## Notes for Room Data from Hotel Database

When you're ready to pull guest and room data from the hotel database:

1. **Room Data**: Currently uses local `Room` model
   - Update QR controller to query from hotel.rooms collection
   - Update seed script to fetch from hotel database

2. **Guest Data**: Currently uses `GuestCredential` model
   - Can fetch guests from hotel.guests or similar
   - Password hash still stored in `GuestCredential` for security

3. **Configuration**: Add connection string for hotel database if separate

## Future Enhancements

- [ ] Fetch room data from hotel database instead of local Room model
- [ ] Add guest data management endpoint
- [ ] Implement password reset functionality
- [ ] Add login history/auditing
- [ ] Support multiple guests per room
- [ ] Add check-in/check-out timestamps to credentials

---

**Last Updated**: February 13, 2026
**Status**: Live System
