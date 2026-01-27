import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

export default function QRCodeGenerator({ roomNumber }) {
  const canvasRef = useRef(null);
  const logoCanvasRef = useRef(null);
  const [qrURL, setQrURL] = useState("");
  const [qrGenerated, setQrGenerated] = useState(false);

  useEffect(() => {
    if (!roomNumber || !canvasRef.current) return;

    // reset state when room changes
    setQrGenerated(false);

    // IMPORTANT: backend base URL (no trailing slash)
    const API_BASE =
      (import.meta.env.VITE_API_URL ||
        "http://localhost:5000")
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
      .then(() => {
        // Add logo to center of QR code
        addLogoToQR();
        setQrGenerated(true);
      })
      .catch((err) => console.error("QR Error:", err));

  }, [roomNumber]);

  const addLogoToQR = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    const drawLogoWithBackground = (image) => {
      // Logo size (20% of QR code - smaller to ensure QR remains scannable)
      const logoSize = canvas.width * 0.2;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const bgSize = logoSize + 16;
      const bgX = centerX - bgSize / 2;
      const bgY = centerY - bgSize / 2;
      
      // Draw circular white background
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(centerX, centerY, bgSize / 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw border around background
      ctx.strokeStyle = "#CCCCCC";
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw logo centered
      ctx.drawImage(
        image,
        centerX - logoSize / 2,
        centerY - logoSize / 2,
        logoSize,
        logoSize
      );
    };
    
    // Load logo image
    const logo = new Image();
    logo.crossOrigin = "anonymous";
    logo.src = "/logo.png";
    
    logo.onload = () => {
      drawLogoWithBackground(logo);
    };
    
    logo.onerror = () => {
      // Fallback: use vite.svg if logo.png not found
      const fallbackLogo = new Image();
      fallbackLogo.crossOrigin = "anonymous";
      fallbackLogo.src = "/vite.svg";
      
      fallbackLogo.onload = () => {
        drawLogoWithBackground(fallbackLogo);
      };
    };
  };

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
        <style>
          body {
            text-align: center;
            font-family: sans-serif;
            padding: 20px;
          }
          .logo {
            width: 120px;
            margin: 0 auto 16px;
            display: block;
          }
          .qr {
            width: 260px;
            margin-top: 10px;
          }
        </style>
      </head>
      <body>
        <!-- LOGO -->
        <img src="/logo.png" class="logo" />

        <h2>Room ${roomNumber}</h2>
        <p>Scan to access room services</p>

        <img src="${img}" class="qr" />
      </body>
    </html>
  `);

    win.document.close();
    win.focus();
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
