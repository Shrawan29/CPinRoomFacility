import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useGuestAuth } from "../../context/GuestAuthContext";
import { sendGuestOTP, verifyGuestOTP } from "../../services/guest.service";

export default function GuestLogin() {
  const navigate = useNavigate();
  const { login } = useGuestAuth();
  const [searchParams] = useSearchParams();

  const [step, setStep] = useState("phone");
  const [formData, setFormData] = useState({
    qrToken: "",
    phone: "",
    otp: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [roomNumber, setRoomNumber] = useState("");

  // persistent device id
  const deviceId = (() => {
    const existing = localStorage.getItem("guest_device_id");
    if (existing) return existing;
    const id = `device_${crypto.randomUUID()}`;
    localStorage.setItem("guest_device_id", id);
    return id;
  })();

  useEffect(() => {
    const qrToken = searchParams.get("token");
    if (!qrToken) {
      navigate("/guest/access-fallback");
      return;
    }
    setFormData((prev) => ({ ...prev, qrToken }));
  }, [searchParams, navigate]);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.phone) {
      setError("Please enter your phone number");
      setLoading(false);
      return;
    }

    try {
      const response = await sendGuestOTP(formData.qrToken, formData.phone);
      if (response?.roomNumber) setRoomNumber(response.roomNumber);
      setStep("otp");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.otp) {
      setError("Please enter the OTP");
      setLoading(false);
      return;
    }

    try {
      const response = await verifyGuestOTP(
        formData.qrToken,
        formData.phone,
        formData.otp,
        deviceId
      );

      if (response?.token && response?.guest) {
        login(response.token, response.guest);
        navigate("/guest/dashboard");
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(135deg, var(--bg-primary), var(--bg-secondary))",
      }}
    >
      <div className="w-full max-w-md rounded-2xl shadow-2xl p-8 bg-white">
        <h1
          className="text-3xl font-bold text-center mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          🏨 Room Service
        </h1>

        {roomNumber && (
          <p
            className="text-center font-semibold mb-6"
            style={{ color: "var(--brand)" }}
          >
            Room #{roomNumber}
          </p>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-lg text-sm border border-red-200 bg-red-50 text-red-600">
            {error}
          </div>
        )}

        {step === "phone" && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <input
              type="tel"
              placeholder="+91 XXXXX XXXXX"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none"
              style={{
                borderColor: "var(--bg-secondary)",
                color: "var(--text-primary)",
              }}
              autoFocus
            />

            <button
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold text-white transition"
              style={{
                backgroundColor: "var(--brand)",
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <input
              type="text"
              maxLength="6"
              value={formData.otp}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  otp: e.target.value.replace(/\D/g, ""),
                })
              }
              className="w-full px-4 py-3 border-2 rounded-lg text-center text-2xl tracking-widest focus:outline-none"
              style={{
                borderColor: "var(--bg-secondary)",
                color: "var(--text-primary)",
              }}
              autoFocus
            />

            <button
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold text-white transition"
              style={{
                backgroundColor: "var(--brand-soft)",
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? "Verifying..." : "Verify & Login"}
            </button>
          </form>
        )}

        <p
          className="text-center text-xs mt-6"
          style={{ color: "var(--text-muted)" }}
        >
          🔒 Secure guest session
        </p>
      </div>
    </div>
  );
}
