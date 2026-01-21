import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

/**
 * Component to generate and display QR codes for each room
 * QR codes contain room-specific URLs that redirect to guest login
 * Usage: Pass roomNumber and baseURL as props
 */
export default function QRCodeGenerator({ roomNumber, baseURL = "http://localhost:5173" }) {
  const canvasRef = useRef(null);
  const [qrGenerated, setQrGenerated] = useState(false);

  useEffect(() => {
    if (!roomNumber || !canvasRef.current) return;

    // QR code points to the backend endpoint that generates a token
    // Backend: /qr/scan/:roomNumber will generate a token and the guest will be redirected to /guest/login?token=XXX&room=101
    const apiBaseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const qrCodeURL = `${apiBaseURL}/qr/scan/${roomNumber}`;

    // Generate QR code
    QRCode.toCanvas(canvasRef.current, qrCodeURL, {
      width: 300,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    })
      .then(() => {
        setQrGenerated(true);
      })
      .catch((err) => {
        console.error("Error generating QR code:", err);
      });
  }, [roomNumber]);

  const downloadQRCode = () => {
    if (!canvasRef.current) return;

    const link = document.createElement("a");
    link.href = canvasRef.current.toDataURL("image/png");
    link.download = `room_${roomNumber}_qr.png`;
    link.click();
  };

  const printQRCode = () => {
    if (!canvasRef.current) return;

    const printWindow = window.open("", "", "width=400,height=500");
    const img = canvasRef.current.toDataURL("image/png");

    printWindow.document.write(`
      <html>
        <head>
          <title>QR Code - Room ${roomNumber}</title>
          <style>
            body { display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #f5f5f5; }
            div { text-align: center; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            img { max-width: 400px; margin: 20px 0; }
            h2 { margin: 0 0 10px; color: #333; }
            p { margin: 5px 0; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div>
            <h2>Room ${roomNumber}</h2>
            <p>Scan this QR code to access room service</p>
            <img src="${img}" />
            <p style="margin-top: 30px; font-size: 12px; color: #999;">Guest Room Service Portal</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-4 text-center">Room #{roomNumber}</h2>
        <p className="text-gray-600 mb-6 text-center text-sm">
          Scan this QR code with Google Lens to access room service
        </p>

        {qrGenerated && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-600 text-sm">✓ QR Code Generated Successfully</p>
          </div>
        )}

        <canvas
          ref={canvasRef}
          className="mx-auto mb-6 border-2 border-gray-200 rounded"
        />

        <div className="flex gap-3 justify-center">
          <button
            onClick={downloadQRCode}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
          >
            ⬇️ Download
          </button>
          <button
            onClick={printQRCode}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
          >
            🖨️ Print
          </button>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 mb-2">
            <strong>Generated URL:</strong>
          </p>
          <p className="text-xs text-blue-600 break-all font-mono">
            http://localhost:5173/guest/login?token=room_{roomNumber}...
          </p>
        </div>
      </div>
    </div>
  );
}
