# Guest QR Code Authentication System

## Overview
Guests scan QR codes placed in their rooms using Google Lens, which redirects them to the guest login portal. Each room has a unique QR code containing:
- Room number
- Unique authentication token
- Guest portal URL

## How It Works

### 1. **QR Code Generation** (Admin Side)
- Navigate to `/admin/qr-codes`
- Configure the base URL (production URL)
- Select rooms and download/print QR codes
- Place QR codes in each room (wall, TV stand, desk, etc.)

### 2. **Guest Login Flow**
1. Guest scans QR code with Google Lens (or any QR scanner)
2. Browser opens guest portal with pre-filled data:
   - `token` - Room authentication token
   - `room` - Room number
3. Guest enters phone number
4. Guest receives OTP via phone
5. Guest enters OTP and gets logged in

### 3. **URL Structure**
```
https://yourdomain.com/guest/login?token=QRTOKEN&room=101
```

**Parameters:**
- `token` - Unique QR token for the room
- `room` - Room number (optional, for display)

## Setup Instructions

### Backend Configuration
1. Update the QR token generation in the backend (currently uses `room_{roomNumber}_{timestamp}`)
2. Store tokens in `QRToken` model for validation
3. Ensure `/guest/send-otp` endpoint validates the token

### Frontend Configuration
1. Update `baseURL` in QR Code Manager (`/admin/qr-codes`)
   - Development: `http://localhost:5173`
   - Production: `https://yourdomain.com`

2. QR codes are generated with this URL format:
   ```
   {baseURL}/guest/login?token={qrToken}&room={roomNumber}
   ```

### Installation
```bash
cd frontend
npm install qrcode
npm install
npm run dev
```

## Files Created

### Components
- `QRCodeGenerator.jsx` - Generates and displays QR codes
- `GuestProtectedRoute.jsx` - Protects guest routes

### Pages
- `GuestLogin.jsx` - Login page (updated to handle URL params)
- `GuestDashboard.jsx` - Guest dashboard
- `QRCodeManager.jsx` - Admin page to manage QR codes
- `MenuBrowse.jsx` - Menu browsing and ordering

### Services
- `guest.service.js` - API calls for guest operations

### Context
- `GuestAuthContext.jsx` - Guest authentication state management

## Guest Login Flow (Step by Step)

```
QR Scan → URL with token/room → Load GuestLogin page
   ↓
Pre-filled token from URL param
   ↓
Guest enters phone number → Send OTP
   ↓
Guest enters 6-digit OTP → Verify
   ↓
Success → Redirect to GuestDashboard
   ↓
Browse menu → Add to cart → Place order
```

## API Endpoints Used

### Authentication
- `POST /guest/send-otp` - Send OTP to phone
- `POST /guest/verify-otp` - Verify OTP and create session

### Dashboard
- `GET /guest/dashboard` - Get guest info

### Orders
- `POST /guest/orders` - Place new order
- `GET /guest/orders` - Get guest's orders

### Menu
- `GET /menu/guest` - Get available menu items

## Production Deployment

### Step 1: Generate QR Codes
1. Login as Super Admin
2. Go to `/admin/qr-codes`
3. Set base URL to `https://yourdomain.com`
4. Generate QR codes for all rooms
5. Print or export QR codes
6. Place in rooms

### Step 2: Guest Access
1. Guest scans QR with Google Lens
2. Browser redirects to your domain with guest login
3. Guest authenticates with phone + OTP
4. Guest can order room service

## Customization

### Change QR Code Size
Edit `QRCodeGenerator.jsx`:
```javascript
QRCode.toCanvas(canvasRef.current, loginURL, {
  width: 300,  // Change this value
  margin: 2,
})
```

### Add Custom Branding
Modify print/download templates in `QRCodeGenerator.jsx`

### Multiple QR Codes
Generate different QR codes for:
- Room service
- WiFi access
- Billing
- Emergency

## Security Considerations

1. **Token Validation**: Backend validates QR token before OTP
2. **OTP Verification**: Phone number must match active stay
3. **Session Expiration**: Guest sessions auto-expire
4. **HTTPS Only**: Always use HTTPS in production
5. **Token Rotation**: Regenerate tokens periodically

## Troubleshooting

### QR Code Not Scanning
- Ensure good lighting
- QR code size at least 2x2 cm
- Use high-quality print

### Wrong Room Displayed
- Check URL parameters in QR code
- Regenerate QR code for that room

### OTP Not Received
- Verify phone number
- Check SMS gateway configuration
- Ensure active stay exists

## Future Enhancements

- [ ] Bulk QR code generation for all rooms
- [ ] QR code templates with branding
- [ ] Automatic QR code regeneration schedule
- [ ] QR code usage analytics
- [ ] Multiple authentication methods (Biometric, Card)
- [ ] QR code expiration management

---

**Last Updated:** January 21, 2026
