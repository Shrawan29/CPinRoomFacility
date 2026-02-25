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

        .gl-root {
          min-height: 100vh;
          width: 100%;
          max-width: 430px;
          margin: 0 auto;
          background: #faf8f6;
          display: flex;
          flex-direction: column;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* Decorative top band */
        .gl-topband {
          width: 100%;
          height: 52%;
          background: var(--rose, #c0606a);
          position: absolute;
          top: 0; left: 0;
          border-radius: 0 0 48px 48px;
          z-index: 0;
        }

        /* Soft noise texture overlay */
        .gl-topband::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E");
          background-size: 150px;
          opacity: 0.4;
          pointer-events: none;
        }

        .gl-header {
          position: relative;
          z-index: 1;
          padding: 56px 24px 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .gl-logo-ring {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: rgba(255,255,255,0.18);
          border: 1.5px solid rgba(255,255,255,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(8px);
        }

        .gl-logo-icon {
          font-size: 28px;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.15));
        }

        .gl-hotel-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 13px;
          font-weight: 400;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.75);
          margin-top: 2px;
        }

        .gl-welcome {
          font-family: 'Cormorant Garamond', serif;
          font-size: 36px;
          font-weight: 600;
          color: #fff;
          line-height: 1.15;
          text-align: center;
          margin-top: 20px;
          letter-spacing: -0.01em;
        }

        .gl-sub {
          font-size: 13.5px;
          font-weight: 300;
          color: rgba(255,255,255,0.72);
          text-align: center;
          letter-spacing: 0.01em;
        }

        /* The main floating card */
        .gl-card {
          position: relative;
          z-index: 2;
          background: #fff;
          border-radius: 28px;
          box-shadow: 0 8px 40px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06);
          margin: 32px 20px 0;
          padding: 28px 24px 32px;
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .gl-error {
          background: #fff5f5;
          border: 1px solid #fecaca;
          border-radius: 12px;
          padding: 11px 14px;
          color: #dc2626;
          font-size: 13px;
          font-weight: 500;
          text-align: center;
          margin-bottom: 20px;
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
          gap: 6px;
          margin-bottom: 18px;
        }

        .gl-label {
          font-size: 12px;
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
          height: 52px;
          border: 1.5px solid #e5e7eb;
          border-radius: 14px;
          padding: 0 16px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
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
          box-shadow: 0 0 0 3.5px rgba(192,96,106,0.12);
        }

        .gl-input:disabled {
          background: #f3f4f6;
          color: #9ca3af;
          cursor: not-allowed;
          border-color: #e5e7eb;
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
        .gl-eye-btn:hover { color: var(--rose, #c0606a); }

        .gl-hint {
          font-size: 11.5px;
          color: #9ca3af;
          font-weight: 400;
          padding-left: 2px;
        }
        .gl-hint code {
          font-family: 'DM Sans', monospace;
          background: #f3f4f6;
          padding: 1px 5px;
          border-radius: 4px;
          font-size: 11px;
          color: #6b7280;
        }

        .gl-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #e5e7eb, transparent);
          margin: 4px 0 22px;
        }

        .gl-btn {
          width: 100%;
          height: 54px;
          background: var(--rose, #c0606a);
          color: #fff;
          border: none;
          border-radius: 16px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: 0.03em;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(192,96,106,0.35);
          transition: transform 0.15s, box-shadow 0.15s, background 0.2s;
          -webkit-tap-highlight-color: transparent;
          position: relative;
          overflow: hidden;
          margin-top: 6px;
        }

        .gl-btn:active {
          transform: scale(0.98);
          box-shadow: 0 2px 8px rgba(192,96,106,0.25);
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
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: gl-spin 0.7s linear infinite;
        }

        @keyframes gl-spin {
          to { transform: rotate(360deg); }
        }

        /* Footer area */
        .gl-footer {
          position: relative;
          z-index: 1;
          padding: 20px 20px 36px;
          text-align: center;
        }

        .gl-footer-text {
          font-size: 12px;
          color: #9ca3af;
          font-weight: 400;
        }

        /* Room number locked badge */
        .gl-room-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #fdf2f3;
          border: 1.5px solid #fbd5d8;
          border-radius: 14px;
          padding: 0 16px;
          height: 52px;
        }

        .gl-room-badge-icon {
          font-size: 16px;
          flex-shrink: 0;
        }

        .gl-room-badge-value {
          font-size: 15px;
          font-weight: 600;
          color: var(--rose, #c0606a);
          flex: 1;
        }

        .gl-room-badge-lock {
          font-size: 13px;
          color: #f9a8b0;
          flex-shrink: 0;
        }
      `}</style>

      <div className="gl-root">
        {/* Background top band */}
        <div className="gl-topband" />

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
    </GuestLuxuryTheme>
  );
}