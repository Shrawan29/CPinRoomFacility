import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useGuestAuth } from "../../context/GuestAuthContext";
import { guestLoginByLastName } from "../../services/guest.service";
import api from "../../services/api";
import logo from "../../assets/logo.png";
import hotelbg from "../../assets/hotel-bg.jpg";

export default function GuestLogin() {
  const navigate = useNavigate();
  const { guest, login, logout, loading: contextLoading } = useGuestAuth();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    lastName: "",
    roomNumber: "",
    password: "",
  });

  // Always logout before login to ensure new session
  useEffect(() => {
    const roomFromUrl = searchParams.get("room") || searchParams.get("roomNumber");
    if (!contextLoading && guest) {
      if (roomFromUrl && guest.roomNumber && String(roomFromUrl) === String(guest.roomNumber)) {
        navigate("/guest/dashboard");
      } else {
        logout();
      }
    }
  }, [guest, contextLoading, navigate, searchParams, logout]);

  // Check if room is occupied when room number is present in URL
  useEffect(() => {
    const checkRoomOccupied = async () => {
      const roomFromUrl = searchParams.get("room") || searchParams.get("roomNumber");
      if (roomFromUrl) {
        setFormData((prev) => ({ ...prev, roomNumber: roomFromUrl }));
        try {
          const res = await api.get(`/rooms/status/${encodeURIComponent(roomFromUrl)}`);
          if (!res.data || res.data.status !== "OCCUPIED") {
            window.location.href = `/guest/access-fallback?reason=no-guest-registered`;
          }
        } catch (err) {
          window.location.href = `/guest/access-fallback?reason=no-guest-registered`;
        }
      }
    };
    checkRoomOccupied();
  }, [searchParams]);

  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFadeIn(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLocalLoading(true);
    setError("");
    try {
      logout();
      const guestData = await guestLoginByLastName(
        formData.roomNumber,
        formData.lastName,
        formData.password
      );
      if (guestData) {
        login(guestData.token, guestData.guest);
        const redirect = searchParams.get("redirect") || "/guest/dashboard";
        navigate(redirect);
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');

        @keyframes heroFade {
          from { opacity:0; transform:translateY(-10px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes blob1 {
          0%,100% { transform:translate(0,0) scale(1); }
          50%      { transform:translate(14px,-12px) scale(1.09); }
        }
        @keyframes blob2 {
          0%,100% { transform:translate(0,0) scale(1); }
          50%      { transform:translate(-12px,14px) scale(1.07); }
        }

        @keyframes waveDraw {
          0%   { stroke-dashoffset: 1400; opacity: 0; }
          5%   { opacity: 1; }
          100% { stroke-dashoffset: 0;    opacity: 1; }
        }
        @keyframes waveGlow {
          0%,100% { opacity: 0.45; }
          50%      { opacity: 0.88; }
        }
        @keyframes waveRace {
          0%   { stroke-dashoffset:  700; }
          100% { stroke-dashoffset: -700; }
        }
        @keyframes waveAura {
          0%,100% { opacity: 0.15; stroke-width: 10; }
          50%      { opacity: 0.28; stroke-width: 15; }
        }
        @keyframes waveRace2 {
          0%   { stroke-dashoffset: -400; }
          100% { stroke-dashoffset:  400; }
        }

        @keyframes cardIn {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }

        .wave-base {
          stroke-dasharray: 1400;
          stroke-dashoffset: 1400;
          animation: waveDraw 2.8s cubic-bezier(0.16,1,0.3,1) 0.2s forwards;
        }
        .wave-glow { opacity: 0; }
        .wave-aura { opacity: 0; }
        .wave-race {
          stroke-dasharray: 130 1270;
          stroke-dashoffset: 700;
          opacity: 0;
        }
        .wave-race2 {
          stroke-dasharray: 60 1340;
          stroke-dashoffset: -400;
          opacity: 0;
        }
        @keyframes delayFadeIn {
          0%   { opacity: 0; }
          100% { opacity: 1; }
        }
        .wave-race  { animation: waveRace  3.2s linear 3.1s infinite, delayFadeIn 0.6s ease 3.0s forwards; }
        .wave-race2 { animation: waveRace2 5.5s linear 3.3s infinite, delayFadeIn 0.7s ease 3.2s forwards; }
        .wave-glow  { animation: waveGlow  4.5s ease-in-out 3.1s infinite, delayFadeIn 0.8s ease 3.0s forwards; }
        .wave-aura  { animation: waveAura  6s ease-in-out 3.1s infinite, delayFadeIn 1s ease 3.0s forwards; }
      `}</style>

      <div style={{
        position: "fixed", inset: 0,
        display: "flex", flexDirection: "column",
        background: "#EFE1CF",
        opacity: fadeIn ? 1 : 0,
        transition: "opacity 0.5s ease",
      }}>
        <div style={{
          position: "relative", overflow: "hidden",
          animation: "heroFade 0.65s cubic-bezier(0.22,1,0.36,1) both",
        }}>
          {/* Hero Background */}
          <img src={hotelbg} alt="Hotel" style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "center top",
          }} />
          
          {/* Overlay gradient */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(170deg, rgba(6,0,3,0.90) 0%, rgba(100,0,50,0.52) 50%, rgba(6,0,3,0.72) 100%)",
          }} />
          
          {/* Decorative blobs */}
          <div style={{
            position: "absolute", top: -50, right: -50, width: 180, height: 180, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(164,0,93,0.22), transparent 65%)",
            animation: "blob1 7s ease-in-out infinite", pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", bottom: 20, left: -40, width: 150, height: 150, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(196,74,135,0.15), transparent 65%)",
            animation: "blob2 9s ease-in-out infinite", pointerEvents: "none",
          }} />

          {/* Hero Content */}
          <div style={{ position: "relative", zIndex: 2, padding: "30px 20px 50px" }}>
            {/* Logo Section */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{
                width: 70, height: 70,
                background: "rgba(255,255,255,0.18)", backdropFilter: "blur(16px)",
                border: "1.5px solid rgba(255,255,255,0.32)", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <img src={logo} alt="Logo" style={{
                  width: 45, height: 45, objectFit: "contain",
                  filter: "brightness(0) invert(1)",
                }} />
              </div>

              <div style={{ textAlign: "center" }}>
                <p style={{
                  fontSize: 10, color: "rgba(255,255,255,0.88)",
                  fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase",
                  textShadow: "0 1px 10px rgba(0,0,0,0.9)",
                  margin: 0, padding: 0,
                }}>
                  Welcome Back
                </p>
                <h1 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 28, fontWeight: 300, fontStyle: "italic",
                  color: "#fff", lineHeight: 1,
                  margin: "6px 0 0", padding: 0,
                  textShadow: "0 2px 16px rgba(0,0,0,0.6)",
                }}>
                  Sign In
                </h1>
              </div>
            </div>
          </div>

          {/* Wave */}
          <div style={{ position: "absolute", bottom: -1, left: 0, right: 0, zIndex: 3, lineHeight: 0 }}>
            <svg viewBox="0 0 430 80" fill="none" preserveAspectRatio="none" style={{ width: "100%", height: 80, display: "block" }}>
              <path d="M0 28 C50 70, 110 76, 175 50 C225 28, 280 10, 340 42 C375 62, 408 62, 430 44 L430 80 L0 80 Z" fill="#EFE1CF" />
              <path className="wave-aura" d="M0 28 C50 70, 110 76, 175 50 C225 28, 280 10, 340 42 C375 62, 408 62, 430 44" fill="none" stroke="url(#wGrad2)" strokeWidth="12" strokeLinecap="round" />
              <path className="wave-base" d="M0 28 C50 70, 110 76, 175 50 C225 28, 280 10, 340 42 C375 62, 408 62, 430 44" fill="none" stroke="url(#wGrad1)" strokeWidth="2.2" strokeLinecap="round" />
              <path className="wave-glow" d="M0 28 C50 70, 110 76, 175 50 C225 28, 280 10, 340 42 C375 62, 408 62, 430 44" fill="none" stroke="url(#wGrad2)" strokeWidth="7" strokeLinecap="round" />
              <path className="wave-race" d="M0 28 C50 70, 110 76, 175 50 C225 28, 280 10, 340 42 C375 62, 408 62, 430 44" fill="none" stroke="url(#wGrad3)" strokeWidth="4" strokeLinecap="round" />
              <path className="wave-race2" d="M0 28 C50 70, 110 76, 175 50 C225 28, 280 10, 340 42 C375 62, 408 62, 430 44" fill="none" stroke="url(#wGrad2)" strokeWidth="5" strokeLinecap="round" />
              <defs>
                <linearGradient id="wGrad1" x1="0" y1="0" x2="430" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="transparent" />
                  <stop offset="12%" stopColor="#A4005D" stopOpacity="0.65" />
                  <stop offset="42%" stopColor="#D44F93" />
                  <stop offset="72%" stopColor="#A4005D" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
                <linearGradient id="wGrad2" x1="0" y1="0" x2="430" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="transparent" />
                  <stop offset="18%" stopColor="#A4005D" stopOpacity="0.22" />
                  <stop offset="50%" stopColor="#D44F93" stopOpacity="0.32" />
                  <stop offset="82%" stopColor="#A4005D" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
                <linearGradient id="wGrad3" x1="0" y1="0" x2="430" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="transparent" />
                  <stop offset="38%" stopColor="#C44A87" stopOpacity="0.7" />
                  <stop offset="52%" stopColor="#ffffff" stopOpacity="1" />
                  <stop offset="66%" stopColor="#C44A87" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Login Form Content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", maxWidth: 430, width: "100%", margin: "0 auto" }}>
          <div style={{ background: "#EFE1CF", padding: "0 20px", width: "100%" }}>
            {/* Form Card */}
            <div style={{
              background: "#fff", borderRadius: 20, padding: "20px 16px",
              border: "1px solid rgba(164,0,93,0.07)",
              boxShadow: "0 2px 14px rgba(164,0,93,0.06)",
              animation: "cardIn 0.55s cubic-bezier(0.22,1,0.36,1) 0.3s both",
            }}>
              {/* Error banner */}
              {error && (
                <div style={{
                  background: "rgba(164,0,93,0.1)", border: "1px solid rgba(164,0,93,0.25)",
                  borderRadius: 12, padding: "12px 14px", marginBottom: 16,
                  color: "#A4005D", fontSize: 12.5, fontWeight: 500, textAlign: "center",
                }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} noValidate>
                {/* Room Number Display */}
                {formData.roomNumber && (
                  <div style={{ marginBottom: 16 }}>
                    <label style={{
                      fontSize: 10.5, fontWeight: 600, letterSpacing: "0.10em",
                      textTransform: "uppercase", color: "#6B6B6B", display: "block", marginBottom: 8,
                    }}>
                      Room Number
                    </label>
                    <div style={{
                      background: "rgba(164,0,93,0.07)", border: "1px solid rgba(164,0,93,0.2)",
                      borderRadius: 13, padding: "0 14px", height: 48,
                      display: "flex", alignItems: "center", gap: 10,
                    }}>
                      <span style={{ fontSize: 15, flexShrink: 0 }}>🔑</span>
                      <span style={{ fontSize: 14.5, fontWeight: 600, color: "#A4005D", flex: 1 }}>
                        {formData.roomNumber}
                      </span>
                      <span style={{ fontSize: 13, color: "#C44A87", flexShrink: 0 }}>🔒</span>
                    </div>
                  </div>
                )}

                {/* Last Name Input */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{
                    fontSize: 10.5, fontWeight: 600, letterSpacing: "0.10em",
                    textTransform: "uppercase", color: "#6B6B6B", display: "block", marginBottom: 8,
                  }}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Johnson"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    autoFocus
                    autoComplete="family-name"
                    style={{
                      width: "100%", height: 48, background: "#F6EADB",
                      border: "1px solid rgba(164,0,93,0.15)", borderRadius: 13,
                      padding: "0 14px", fontSize: 14.5, color: "#1F1F1F",
                      outline: "none", transition: "all 0.2s ease",
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#A4005D"}
                    onBlur={(e) => e.target.style.borderColor = "rgba(164,0,93,0.15)"}
                  />
                </div>

                {/* Password Input */}
                <div style={{ marginBottom: 8 }}>
                  <label style={{
                    fontSize: 10.5, fontWeight: 600, letterSpacing: "0.10em",
                    textTransform: "uppercase", color: "#6B6B6B", display: "block", marginBottom: 8,
                  }}>
                    Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="roomno_LastName"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      autoComplete="current-password"
                      style={{
                        width: "100%", height: 48, background: "#F6EADB",
                        border: "1px solid rgba(164,0,93,0.15)", borderRadius: 13,
                        padding: "0 14px 0 14px", paddingRight: 45, fontSize: 14.5, color: "#1F1F1F",
                        outline: "none", transition: "all 0.2s ease",
                      }}
                      onFocus={(e) => e.target.style.borderColor = "#A4005D"}
                      onBlur={(e) => e.target.style.borderColor = "rgba(164,0,93,0.15)"}
                    />
                    {/* Eye toggle button */}
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      tabIndex={-1}
                      style={{
                        position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                        background: "none", border: "none", cursor: "pointer", color: "#6B6B6B",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "color 0.2s ease",
                      }}
                      onMouseEnter={(e) => e.target.style.color = "#A4005D"}
                      onMouseLeave={(e) => e.target.style.color = "#6B6B6B"}
                    >
                      {showPassword ? (
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>

                  {/* Password hint */}
                  <p style={{
                    fontSize: 11, color: "#6B6B6B", marginTop: 6, marginBottom: 0,
                    padding: "0 4px",
                  }}>
                    Format:{" "}
                    <code style={{
                      background: "rgba(164,0,93,0.08)", color: "#A4005D",
                      fontSize: 10.5, padding: "2px 6px", borderRadius: 4,
                    }}>
                      roomno_LastName
                    </code>
                  </p>
                </div>

                {/* Divider */}
                <div style={{
                  height: 1, background: "linear-gradient(to right, transparent, rgba(164,0,93,0.2), transparent)",
                  margin: "16px 0",
                }} />

                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={localLoading}
                  style={{
                    width: "100%", height: 50,
                    background: localLoading ? "rgba(164,0,93,0.6)" : "linear-gradient(90deg,#A4005D,#C44A87)",
                    color: "#fff", fontSize: 15, fontWeight: 600, letterSpacing: "0.05em",
                    borderRadius: 14, border: "none", cursor: localLoading ? "not-allowed" : "pointer",
                    boxShadow: "0 4px 18px rgba(164,0,93,0.35)",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    transition: "all 0.2s ease",
                    opacity: localLoading ? 0.65 : 1,
                  }}
                  onMouseDown={(e) => !localLoading && (e.target.style.transform = "scale(0.98)")}
                  onMouseUp={(e) => !localLoading && (e.target.style.transform = "scale(1)")}
                >
                  {localLoading ? (
                    <>
                      <span style={{
                        width: 17, height: 17, borderRadius: "50%",
                        border: "2px solid rgba(255,255,255,0.35)", borderTopColor: "#fff",
                        animation: "spin 0.8s linear infinite", flexShrink: 0,
                      }} />
                      Signing in…
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>
            </div>

            {/* Footer */}
            <p style={{
              marginTop: 12, fontSize: 11, color: "#6B6B6B", textAlign: "center",
            }}>
              Need help? Contact the front desk 📞
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}