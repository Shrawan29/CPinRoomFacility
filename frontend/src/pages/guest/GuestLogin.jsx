import { useState, useEffect } from "react";
import GuestLuxuryTheme from "../../components/guest/GuestLuxuryTheme";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useGuestAuth } from "../../context/GuestAuthContext";
import { guestLoginByLastName } from "../../services/guest.service";

export default function GuestLogin() {
  const navigate = useNavigate();
  const { login } = useGuestAuth();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    lastName: "",
    roomNumber: "",
    password: "",
  });

  useEffect(() => {
    const roomFromUrl = searchParams.get("room") || searchParams.get("roomNumber");
    if (roomFromUrl) {
      setFormData((prev) => ({ ...prev, roomNumber: roomFromUrl }));
    }
  }, [searchParams]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const guest = await guestLoginByLastName(formData.roomNumber, formData.lastName, formData.password);
      if (guest) {
        login(guest);
        const redirect = searchParams.get("redirect") || "/guest/dashboard";
        navigate(redirect);
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <GuestLuxuryTheme>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500;600&display=swap');

        /* Reset html/body to prevent any scroll */
        html, body, #root {
          height: 100%;
          width: 100%;
          margin: 0;
          padding: 0;
          overflow: hidden;
        }

        .gl-root {
          position: fixed;
          inset: 0;
          background: #faf8f6;
          display: flex;
          flex-direction: column;
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
          /* Scale everything to fit any phone screen */
        }

        /* Top rose band — fixed pixel height so it never shifts */
        .gl-topband {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 44%;
          background: var(--rose, #c0606a);
          border-radius: 0 0 40px 40px;
          z-index: 0;
          flex-shrink: 0;
        }

        .gl-topband::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E");
          background-size: 150px;
          opacity: 0.35;
          pointer-events: none;
        }

        /* Full-screen flex column: header + card + footer all in viewport */
        .gl-layout {
          position: relative;
          z-index: 1;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0 20px;
          box-sizing: border-box;
          gap: 0;
        }

        /* ── Header ───────────────────────────────── */
        .gl-header {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          margin-bottom: 24px;
          flex-shrink: 0;
        }

        .gl-logo-ring {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: rgba(255,255,255,0.18);
          border: 1.5px solid rgba(255,255,255,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(8px);
          margin-bottom: 2px;
        }

        .gl-logo-icon {
          font-size: 24px;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.15));
        }

        .gl-hotel-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.75);
        }

        .gl-welcome {
          font-family: 'Cormorant Garamond', serif;
          font-size: 32px;
          font-weight: 600;
          color: #fff;
          line-height: 1.1;
          text-align: center;
          letter-spacing: -0.01em;
          margin: 4px 0 0;
        }

        .gl-sub {
          font-size: 13px;
          font-weight: 300;
          color: rgba(255,255,255,0.72);
          text-align: center;
        }

        /* ── Card ─────────────────────────────────── */
        .gl-card {
          width: 100%;
          background: #fff;
          border-radius: 24px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06);
          padding: 24px 20px 24px;
          box-sizing: border-box;
          flex-shrink: 0;
        }

        .gl-error {
          background: #fff5f5;
          border: 1px solid #fecaca;
          border-radius: 10px;
          padding: 10px 14px;
          color: #dc2626;
          font-size: 12.5px;
          font-weight: 500;
          text-align: center;
          margin-bottom: 16px;
          animation: gl-shake 0.3s ease;
        }

        @keyframes gl-shake {
          0%,100%{transform:translateX(0)}
          25%{transform:translateX(-4px)}
          75%{transform:translateX(4px)}
        }

        .gl-field-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
          margin-bottom: 14px;
        }

        .gl-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #6b7280;
        }

        .gl-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .gl-input {
          width: 100%;
          height: 48px;
          border: 1.5px solid #e5e7eb;
          border-radius: 12px;
          padding: 0 16px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14.5px;
          font-weight: 400;
          color: #1f2937;
          background: #fafafa;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          box-sizing: border-box;
          -webkit-appearance: none;
        }

        .gl-input:focus {
          border-color: var(--rose, #c0606a);
          background: #fff;
          box-shadow: 0 0 0 3px rgba(192,96,106,0.12);
        }

        .gl-input.has-icon {
          padding-right: 48px;
        }

        .gl-eye-btn {
          position: absolute;
          right: 14px;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          color: #9ca3af;
          display: flex;
          align-items: center;
          transition: color 0.2s;
          -webkit-tap-highlight-color: transparent;
        }
        .gl-eye-btn:active { color: var(--rose, #c0606a); }

        .gl-hint {
          font-size: 11px;
          color: #9ca3af;
          font-weight: 400;
          padding-left: 2px;
        }
        .gl-hint code {
          font-family: 'DM Sans', monospace;
          background: #f3f4f6;
          padding: 1px 5px;
          border-radius: 4px;
          font-size: 10.5px;
          color: #6b7280;
        }

        .gl-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #e5e7eb, transparent);
          margin: 6px 0 16px;
        }

        .gl-btn {
          width: 100%;
          height: 50px;
          background: var(--rose, #c0606a);
          color: #fff;
          border: none;
          border-radius: 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: 0.03em;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(192,96,106,0.35);
          transition: transform 0.15s, box-shadow 0.15s;
          -webkit-tap-highlight-color: transparent;
        }

        .gl-btn:active {
          transform: scale(0.98);
          box-shadow: 0 2px 8px rgba(192,96,106,0.2);
        }

        .gl-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .gl-btn-inner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .gl-spinner {
          width: 17px;
          height: 17px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: gl-spin 0.7s linear infinite;
          flex-shrink: 0;
        }

        @keyframes gl-spin {
          to { transform: rotate(360deg); }
        }

        /* ── Footer ───────────────────────────────── */
        .gl-footer {
          margin-top: 16px;
          text-align: center;
          flex-shrink: 0;
        }

        .gl-footer-text {
          font-size: 12px;
          color: #9ca3af;
          font-weight: 400;
        }

        /* ── Room badge ───────────────────────────── */
        .gl-room-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #fdf2f3;
          border: 1.5px solid #fbd5d8;
          border-radius: 12px;
          padding: 0 16px;
          height: 48px;
        }

        .gl-room-badge-icon { font-size: 15px; flex-shrink: 0; }
        .gl-room-badge-value {
          font-size: 14.5px;
          font-weight: 600;
          color: var(--rose, #c0606a);
          flex: 1;
        }
        .gl-room-badge-lock { font-size: 13px; color: #f9a8b0; flex-shrink: 0; }
      `}</style>

      <div className="gl-root">
        {/* Background top band */}
        <div className="gl-topband" />

        {/* Centered layout wrapper */}
        <div className="gl-layout">

          {/* Header */}
          <header className="gl-header">
            <div className="gl-logo-ring">
              <span className="gl-logo-icon">🏨</span>
            </div>
            <p className="gl-hotel-name">In-Room Facility</p>
            <h1 className="gl-welcome">Welcome Back</h1>
            <p className="gl-sub">Sign in to access your room services</p>
          </header>

          {/* Card */}
          <div className="gl-card">
            {error && (
              <div className="gl-error">{error}</div>
            )}

            <form onSubmit={handleLogin} noValidate>
              {/* Room Number */}
              {formData.roomNumber ? (
                <div className="gl-field-group">
                  <label className="gl-label">Room Number</label>
                  <div className="gl-room-badge">
                    <span className="gl-room-badge-icon">🔑</span>
                    <span className="gl-room-badge-value">{formData.roomNumber}</span>
                    <span className="gl-room-badge-lock">🔒</span>
                  </div>
                </div>
              ) : null}

              {/* Last Name */}
              <div className="gl-field-group">
                <label className="gl-label">Last Name</label>
                <div className="gl-input-wrap">
                  <input
                    type="text"
                    className="gl-input"
                    placeholder="e.g. Johnson"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    autoFocus
                    autoComplete="family-name"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="gl-field-group">
                <label className="gl-label">Password</label>
                <div className="gl-input-wrap">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="gl-input has-icon"
                    placeholder="roomno_LastName"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="gl-eye-btn"
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
                <span className="gl-hint">Format: <code>roomno_LastName</code></span>
              </div>

              <div className="gl-divider" />

              <button
                type="submit"
                className="gl-btn"
                disabled={loading}
              >
                <span className="gl-btn-inner">
                  {loading ? (
                    <>
                      <span className="gl-spinner" />
                      Signing in…
                    </>
                  ) : (
                    "Sign In"
                  )}
                </span>
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="gl-footer">
            <p className="gl-footer-text">Need help? Contact the front desk 📞</p>
          </div>

        </div>
      </div>
    </GuestLuxuryTheme>
  );
}