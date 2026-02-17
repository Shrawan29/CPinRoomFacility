import { useLocation, useNavigate } from "react-router-dom";

export default function GuestAccessFallback() {
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const reason = String(params.get("reason") || "");
  const isNoGuest = reason === "no-guest-registered";

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div className="w-full max-w-md rounded-2xl shadow-lg p-8 bg-white">
        {/* ICON */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">📱</div>
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            Scan QR Code
          </h1>
        </div>

        {/* MAIN MESSAGE */}
        <div className="text-center mb-8">
          {isNoGuest ? (
            <p className="text-base mb-4" style={{ color: "var(--text-primary)" }}>
              No guest registered for this room.
            </p>
          ) : (
            <p className="text-base mb-4" style={{ color: "var(--text-primary)" }}>
              Please use your phone camera or a QR code scanner (e.g. Google Lens) to scan the QR code placed in your room.
            </p>
          )}

          <div
            className="p-4 rounded-lg mb-4"
            style={{ backgroundColor: "var(--bg-secondary)" }}
          >
            <p
              className="text-sm font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {isNoGuest ? "🛎️ Need help?" : "🔍 Look for the QR code:"}
            </p>
            {isNoGuest ? (
              <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
                Please contact reception to complete check-in.
              </p>
            ) : (
              <>
                <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
                  • On the wall in your room
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  • On the table or desk
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  • Near the entrance
                </p>
              </>
            )}
          </div>
        </div>

        {/* HELP SECTION */}
        <div
          className="p-4 rounded-lg border-l-4 mb-8"
          style={{
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            borderColor: "var(--brand)",
          }}
        >
          <p
            className="text-sm font-semibold mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            🆘 Can't login in?
          </p>
          <p
            className="text-sm"
            style={{ color: "var(--text-muted)" }}
          >
            Please contact the reception desk. They will assist you.
          </p>
          <p
            className="text-xs mt-2 font-semibold"
            style={{ color: "var(--brand)" }}
          >
            Dial 0 from your room phone
          </p>
        </div>

        {/* SAFE SPACE */}
        <div className="h-4" />
      </div>
    </div>
  );
}
