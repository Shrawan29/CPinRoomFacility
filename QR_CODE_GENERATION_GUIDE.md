# QR Code Generation Guide

## What Changed

### Before (Old System)
- QR code contained a temporary token
- Token lasted only 5 minutes
- Token was server-generated and stored
- Complex redirect flow

### After (New System)  
- QR code contains the room number directly
- No expiration (room is permanent)
- Simple validation only
- Direct login flow

---

## How to Create QR Codes

### Option 1: Online QR Generator (Recommended for Testing)

1. Go to [QR Code Generator](https://www.qr-code-generator.com/)
2. Select **URL** type
3. Enter this URL (replace `101` with your room number):
   ```
   http://localhost:3000/qr/scan/101
   ```
4. For production, use your actual domain:
   ```
   https://your-domain.com/qr/scan/101
   ```
5. Download as PNG or print

### Option 2: Using Command Line (Linux/Mac)

```bash
# Install qrcode package (if not installed)
npm install -g qrcode-terminal

# Generate QR for room 101 (localhost)
qrcode "http://localhost:3000/qr/scan/101"

# Generate QR for room 101 (production)
qrcode "https://api.yourdomain.com/qr/scan/101"
```

### Option 3: Batch Generate with Script

**Windows PowerShell**:
```powershell
# Create QR codes for all rooms
for ($i = 101; $i -le 105; $i++) {
    $url = "http://localhost:3000/qr/scan/$i"
    Write-Host "Generating QR for room $i..."
    # Use your favorite online service or CLI tool
}
```

**Linux/Mac Bash**:
```bash
#!/bin/bash
for room in {101..105}; do
    echo "Generating QR for room $room..."
    qrcode "http://localhost:3000/qr/scan/$room" > room_$room.txt
done
```

### Option 4: Using Node.js Package

Install QR code generator:
```bash
npm install qrcode
```

Create `generateQR.js`:
```javascript
const QRCode = require('qrcode');
const fs = require('fs');

const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

async function generateQRs() {
  for (let room = 101; room <= 105; room++) {
    const url = `${baseUrl}/qr/scan/${room}`;
    const filename = `qr_room_${room}.png`;
    
    await QRCode.toFile(filename, url, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.95,
      width: 300,
      margin: 1
    });
    
    console.log(`✅ QR code saved: ${filename}`);
  }
}

generateQRs().catch(console.error);
```

Run it:
```bash
node generateQR.js
```

---

## QR Code Specifications

### URL Format
```
https://api.yourdomain.com/qr/scan/{roomNumber}
```

### Parameters
- `roomNumber`: Must be a valid room number in database (e.g., 101, 102, etc.)

### Response
- **If valid room**: Redirects to `/guest/login?room={roomNumber}`
- **If invalid room**: Redirects to `/guest/access-fallback?reason=invalid-room`
- **If server error**: Redirects to `/guest/access-fallback?reason=server-error`

---

## QR Code Design Tips

### Visual Design
- **Size**: 300x300px minimum for phone cameras
- **Margin**: Use at least 4 modules (typically 1cm white border)
- **Contrast**: High contrast (black on white)
- **Error Correction**: High (Level H) - survives 30% damage
- **Colors**: Black code, white background

### Placement
- **Location**: Near room door, at eye level, protected from damage
- **Lighting**: Well-lit area, no glare
- **Accessibility**: Easy reach for guests with mobile devices
- **Protection**: Consider lamination or protective cover

### Testing
- Test with multiple QR scanner apps (Android, iOS)
- Verify focus distance (usually 6-15 inches)
- Check in different lighting conditions

---

## Verification

After printing/displaying QR codes:

### 1. Test Scan
```bash
# Scan the QR code with your phone
# Should redirect to: http://localhost:3000/guest/login?room=101
```

### 2. Verify Backend Routes
```bash
curl http://localhost:3000/qr/scan/101
# Should show a redirect response
```

### 3. Check Database
```bash
# Verify room exists
curl http://localhost:3000/debug/rooms
```

---

## Troubleshooting QR Codes

| Issue | Solution |
|-------|----------|
| QR won't scan | Increase contrast, ensure black on white |
| Redirects to error page | Check room number is valid in database |
| Wrong URL encoded in QR | Regenerate QR with correct URL |
| Login page doesn't load | Verify FRONTEND_URL environment variable |
| "Invalid room" error | Run `node scripts/seedRooms.js` to create rooms |

---

## URL Configuration

### Local Development
```
http://localhost:3000/qr/scan/101
```
(Frontend will be at `http://localhost:5173`)

### Production (Railway/Vercel)
```
https://api.yourdomain.com/qr/scan/101
```
(Frontend will be at `https://yourdomain.com`)

**Make sure `FRONTEND_URL` environment variable is set correctly** to ensure redirects work!

---

## Room Numbers

### Default Rooms (if using seedRooms.js)
- 101, 102, 103, 104, 105

### Custom Rooms
Add to database:
```bash
# Admin endpoint to create rooms
# Or run: node scripts/seedRooms.js
```

---

## Example QR Codes

### Room 101
```
URL: http://localhost:3000/qr/scan/101
```

### Room 102
```
URL: http://localhost:3000/qr/scan/102
```

### Room 103
```
URL: http://localhost:3000/qr/scan/103
```

---

## Future Enhancements

- [ ] Add room images in QR metadata
- [ ] Include room amenities/features
- [ ] Add hotel contact info
- [ ] Multi-language support
- [ ] Night mode for displays
- [ ] Dynamic QR updates

---

**Quick Start**: Use [qr-code-generator.com](https://www.qr-code-generator.com/) to create your first QR code!
