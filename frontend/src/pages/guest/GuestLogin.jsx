import { useState, useEffect } from "react";
import GuestLuxuryTheme from "../../components/guest/GuestLuxuryTheme";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useGuestAuth } from "../../context/GuestAuthContext";
import { guestLoginByLastName } from "../../services/guest.service";
import logo from "../../assets/logo.png";

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
      const guest = await guestLoginByLastName(
        formData.roomNumber,
        formData.lastName,
        formData.password
      );
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

      {/* ── Root: fixed viewport, no scroll, warm cream bg ── */}
      <div className="fixed inset-0 bg-[#F6EADB] flex flex-col overflow-hidden">

        {/* ── Top gradient band ── */}
        <div className="absolute top-0 left-0 right-0 h-[42%] bg-gradient-to-br from-[#A4005D] to-[#C44A87] rounded-b-[44px] z-0" />

        {/* ── Main centered column ── */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-5 box-border">

          {/* ── HEADER ── */}
          <div className="flex flex-col items-center w-full mb-6 flex-shrink-0">

            {/* Logo */}
            <img
              src={logo}
              alt="In-Room Facility Logo"
              className="w-24 h-24 object-contain brightness-0 invert drop-shadow-[0_4px_16px_rgba(255,255,255,0.25)] mb-2"
            />

            {/* Brand */}
            <p className="text-[10px] font-medium tracking-[0.28em] uppercase text-white/65 mb-1">
              In-Room Facility
            </p>

            {/* Subtext */}
            <p className="text-[13px] font-light text-white/60 text-center mt-0.5">
              Sign in to access your room services
            </p>
          </div>

          {/* ── CARD ── */}
          <div className="w-full bg-[#EFE1CF] rounded-[26px] border border-[#A4005D]/10 shadow-[0_12px_40px_rgba(164,0,93,0.13),0_2px_8px_rgba(0,0,0,0.06)] px-5 py-6 flex-shrink-0">

            {/* Error banner */}
            {error && (
              <div className="bg-[#A4005D]/10 border border-[#A4005D]/25 rounded-xl px-4 py-2.5 mb-4 text-[#A4005D] text-[12.5px] font-medium text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} noValidate>

              {/* Room Number badge — only if auto-filled from URL */}
              {formData.roomNumber && (
                <div className="flex flex-col gap-1.5 mb-4">
                  <label className="text-[10.5px] font-semibold tracking-[0.10em] uppercase text-[#6B6B6B]">
                    Room Number
                  </label>
                  <div className="flex items-center gap-2 bg-[#A4005D]/[0.07] border border-[#A4005D]/20 rounded-[13px] px-4 h-12">
                    <span className="text-[15px] flex-shrink-0">🔑</span>
                    <span className="flex-1 text-[14.5px] font-semibold text-[#A4005D]">
                      {formData.roomNumber}
                    </span>
                    <span className="text-[13px] text-[#C44A87] flex-shrink-0">🔒</span>
                  </div>
                </div>
              )}

              {/* Last Name */}
              <div className="flex flex-col gap-1.5 mb-4">
                <label className="text-[10.5px] font-semibold tracking-[0.10em] uppercase text-[#6B6B6B]">
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Johnson"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  autoFocus
                  autoComplete="family-name"
                  className="w-full h-12 bg-[#F6EADB] border border-[#A4005D]/15 rounded-[13px] px-4 text-[14.5px] text-[#1F1F1F] placeholder:text-[#6B6B6B]/50 outline-none focus:border-[#A4005D] focus:ring-[3px] focus:ring-[#A4005D]/10 transition-all appearance-none"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5 mb-1">
                <label className="text-[10.5px] font-semibold tracking-[0.10em] uppercase text-[#6B6B6B]">
                  Password
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="roomno_LastName"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    autoComplete="current-password"
                    className="w-full h-12 bg-[#F6EADB] border border-[#A4005D]/15 rounded-[13px] px-4 pr-12 text-[14.5px] text-[#1F1F1F] placeholder:text-[#6B6B6B]/50 outline-none focus:border-[#A4005D] focus:ring-[3px] focus:ring-[#A4005D]/10 transition-all appearance-none"
                  />
                  {/* Eye toggle */}
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3.5 text-[#6B6B6B] active:text-[#A4005D] flex items-center transition-colors"
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
                <p className="text-[11px] text-[#6B6B6B] mt-0.5 pl-0.5">
                  Format:{" "}
                  <code className="bg-[#A4005D]/[0.08] text-[#A4005D] text-[10.5px] px-1.5 py-px rounded">
                    roomno_LastName
                  </code>
                </p>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-[#A4005D]/20 to-transparent my-4" />

              {/* Sign In button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-[50px] bg-gradient-to-r from-[#A4005D] to-[#C44A87] text-white text-[15px] font-semibold tracking-wide rounded-[14px] shadow-[0_4px_18px_rgba(164,0,93,0.35)] active:scale-[0.98] active:shadow-[0_2px_8px_rgba(164,0,93,0.2)] disabled:opacity-65 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-[17px] h-[17px] border-2 border-white/35 border-t-white rounded-full animate-spin flex-shrink-0" />
                    Signing in…
                  </>
                ) : (
                  "Sign In"
                )}
              </button>

            </form>
          </div>

          {/* ── FOOTER ── */}
          <p className="mt-4 text-[12px] text-[#6B6B6B] text-center flex-shrink-0">
            Need help? Contact the front desk 📞
          </p>

        </div>
      </div>

    </GuestLuxuryTheme>
  );
}