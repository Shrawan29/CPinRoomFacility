import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

export default function QRCodeGenerator({ roomNumber }) {
  const canvasRef = useRef(null);
  const [qrURL, setQrURL] = useState("");
  const [qrGenerated, setQrGenerated] = useState(false);

  useEffect(() => {
    if (!roomNumber || !canvasRef.current) return;

    // reset state when room changes
    setQrGenerated(false);

    // IMPORTANT: backend base URL (no trailing slash)
    const API_BASE =
      (import.meta.env.VITE_API_URL ||
        "https://c-pin-room-facility.vercel.app")
        .replace(/\/$/, "");

    // QR MUST point to backend, not frontend
    const qrCodeURL = `${API_BASE}/qr/scan/${roomNumber}`;
    setQrURL(qrCodeURL);

    QRCode.toCanvas(canvasRef.current, qrCodeURL, {
      width: 280,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    })
      .then(() => setQrGenerated(true))
      .catch((err) => console.error("QR Error:", err));

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

    const win = window.open("", "", "width=400,height=500");
    if (!win) {
      alert("Please allow popups to print QR");
      return;
    }

    const img = canvasRef.current.toDataURL("image/png");

    win.document.write(`
      <html>
        <head>
          <title>Room ${roomNumber}</title>
        </head>
        <body style="text-align:center;font-family:sans-serif">
          <h2>Room ${roomNumber}</h2>
          <p>Scan to access room services</p>
          <img src="${img}" style="width:260px" />
        </body>
      </html>
    `);

    win.document.close();
    win.print();
  };

  return (
    <div className="flex justify-center p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">

        <h2 className="text-xl font-bold mb-2">
          Room #{roomNumber}
        </h2>

        <p className="text-sm text-gray-600 mb-4">
          Scan with phone camera to access services
        </p>

        {qrGenerated && (
          <p className="text-green-600 text-sm mb-2">
            ✓ QR Generated
          </p>
        )}

        <canvas
          ref={canvasRef}
          className="mx-auto mb-4 border rounded"
        />

        <div className="flex gap-3 justify-center">
          <button
            onClick={downloadQRCode}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Download
          </button>

          <button
            onClick={printQRCode}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Print
          </button>
        </div>

        <p className="text-xs mt-4 break-all text-gray-500">
          {qrURL}
        </p>
      </div>
    </div>
  );
}
