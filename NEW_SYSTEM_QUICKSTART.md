# New Guest Authentication System - Quick Setup

## What Was Changed (High Level)

✅ **Removed**:
- OTP (One-Time Password) system
- Phone-based authentication  
- `ActiveStay` admin managementmodel
- Guest number field (not needed)

✅ **Added**:
- Simple username/password login
- `GuestCredential` model for storing login info
- Password format: `guestname_roomno` (auto-generated)
- Direct QR code → Room number mapping

---

## How to Test This System

### 1. Install & Run Backend

```bash
cd Backend
npm install
npm run dev
```

### 2. Seed Guest Credentials

In a new terminal:
```bash
cd Backend
node scripts/seedGuestCredentials.js
```

**Output should look like**:
```
✅ Guest credentials seeded successfully for 5 rooms

📝 Sample Credentials:
   Room 101: Guest_101 / guest_101_101
   Room 102: Guest_102 / guest_102_102
   Room 103: Guest_103 / guest_103_103
```

### 3. Verify Database (Optional)

```bash
# Check guests were created
curl http://localhost:3000/debug/guest-credentials

# Check rooms exist
curl http://localhost:3000/debug/rooms
```

### 4. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:5173`

---

## Test Guest Login

### Scenario 1: Via QR Code (Full Flow)

1. **Generate QR Code** containing room number:
   - Encode this URL in QR: `http://localhost:3000/qr/scan/101`
   
2. **Scan QR Code** in guest app:
   - Guest camera → Scan QR → Browser opens link
   - Backend validates room → Redirects to login page
   - URL becomes: `http://localhost:5173/guest/login?room=101`

3. **Enter Login Credentials**:
   - Guest Name: `Guest_101`
   - Password: `guest_101_101`
   - Click "Login to Room Service"

4. **Verify Success**:
   - Should redirect to `/guest/dashboard`
   - Session token stored in localStorage
   - Can now browse menu, place orders, etc.

### Scenario 2: Direct URL Test

If you don't have a QR code ready:

1. **Go directly to login URL**:
   ```
   http://localhost:5173/guest/login?room=101
   ```

2. **Enter credentials**:
   - Guest Name: `Guest_101`
   - Password: `guest_101_101`

3. **Select menu and place order** to verify full flow

### Scenario 3: Test Different Room Numbers

Try different room numbers (101-105 by default):
- Guest_102 / guest_102_102
- Guest_103 / guest_103_103
- etc.

---

## What Each New File Does

### Backend Models
- **`GuestCredential.js`**: Stores guest login credentials  
- **Updated `GuestSession.js`**: Session management (removed phone field)

### Backend Routes
- **New `/guest/auth/login`**: Guest login endpoint

### Backend Controllers  
- **Updated `guestAuth.controller.js`**: New login logic, deprecated OTP endpoints
- **Updated `qr.controller.js`**: QR scan validation (no token generation)

### Backend Middleware
- **Updated `guestAuth.middleware.js`**: Session validation (simplified)

### Backend Scripts
- **`seedGuestCredentials.js`**: Creates guest credentials for all rooms

### Frontend Pages
- **Updated `GuestLogin.jsx`**: New form (name + password, no OTP steps)

### Frontend Services
- **Updated `guest.service.js`**: New login function

### Frontend Routes
- **QR redirect URL**: `/guest/login?room={roomNumber}`

---

## Default Test Credentials

Room 101:
```
Name: Guest_101
Pass: guest_101_101
```

Room 102:
```
Name: Guest_102
Pass: guest_102_102
```

Room 103:
```
Name: Guest_103
Pass: guest_103_103
```

Room 104:
```
Name: Guest_104
Pass: guest_104_104
```

Room 105:
```
Name: Guest_105
Pass: guest_105_105
```

---

## Debugging Endpoints

All at `http://localhost:3000`:

```bash
# Check guest credentials in database
GET /debug/guest-credentials

# Check active sessions
GET /debug/guest-sessions

# Check all rooms
GET /debug/rooms

# Server health
GET /health
```

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Seed script not found" | Make sure you're in `Backend` directory when running `node scripts/seedGuestCredentials.js` |
| Login fails - "Invalid guest name" | Check the exact guest name. Should be `Guest_101` (capital G) |
| Login fails - "Invalid password" | Password must be lowercase. E.g., `guest_101_101` not `Guest_101_101` |
| Credentials not showing up | Run the seed script again or check MongoDB connection |
| QR redirect not working | Make sure `FRONTEND_URL` env variable is set correctly |
| Can't access guest dashboard | Verify session token in localStorage: `localStorage.getItem('guest_session')` |

---

## File Reference

### Backend New/Changed Files
- `Backend/src/models/GuestCredential.js` - NEW
- `Backend/src/controllers/guestAuth.controller.js` - MODIFIED
- `Backend/src/models/GuestSession.js` - MODIFIED
- `Backend/src/routes/guestAuth.routes.js` - MODIFIED
- `Backend/src/controllers/qr.controller.js` - MODIFIED
- `Backend/src/middleware/guestAuth.middleware.js` - MODIFIED
- `Backend/src/index.js` - MODIFIED (imports + debug routes)
- `Backend/scripts/seedGuestCredentials.js` - NEW

### Frontend New/Changed Files
- `frontend/src/pages/guest/GuestLogin.jsx` - MODIFIED
- `frontend/src/services/guest.service.js` - MODIFIED

### Documentation
- `MIGRATION_GUIDE.md` - COMPREHENSIVE GUIDE
- `NEW_SYSTEM_QUICKSTART.md` - THIS FILE

---

## Next Steps

After testing everything works:

1. ✅ Verify all test cases pass
2. ✅ Test on production-like environment
3. ✅ Clean up debug endpoints (optional)
4. ✅ Archive old OTP/ActiveStay models
5. ✅ Update any external integrations
6. ✅ Add custom branding to login page
7. ✅ Consider adding password reset functionality

---

**Questions?** Check `MIGRATION_GUIDE.md` for detailed information about architecture and future enhancements.
