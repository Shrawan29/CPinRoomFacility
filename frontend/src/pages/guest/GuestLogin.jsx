import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useGuestAuth } from "../../context/GuestAuthContext";
import { sendGuestOTP, verifyGuestOTP } from "../../services/guest.service";

export default function GuestLogin() {
  const navigate = useNavigate();
  const { login } = useGuestAuth();
  const [searchParams] = useSearchParams();

  const [step, setStep] = useState("phone"); // phone, otp
  const [formData, setFormData] = useState({
    qrToken: "",
    phone: "",
    otp: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [deviceId] = useState(() => `device_${Date.now()}_${Math.random()}`);

  // 🔄 Auto-populate from URL params when QR is scanned
  useEffect(() => {
    const qrToken = searchParams.get("token");
    const room = searchParams.get("room");

    if (qrToken) {
      setFormData((prev) => ({ ...prev, qrToken }));
      room && setRoomNumber(room);
      setStep("phone");
    }
  }, [searchParams]);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!formData.phone) {
        setError("Please enter your phone number");
        setLoading(false);
        return;
      }

      await sendGuestOTP(formData.qrToken, formData.phone);
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

    try {
      if (!formData.otp) {
        setError("Please enter the OTP");
        setLoading(false);
        return;
      }

      const response = await verifyGuestOTP(
        formData.qrToken,
        formData.phone,
        formData.otp,
        deviceId
      );

      if (response.token && response.guest) {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          🏨 Room Service
        </h1>
        {roomNumber && (
          <p className="text-center text-blue-600 font-semibold mb-6">
            Room #{roomNumber}
          </p>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* STEP 1: PHONE NUMBER */}
        {step === "phone" && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📱 Enter Your Phone Number
              </label>
              <input
                type="tel"
                placeholder="+91 XXXXX XXXXX"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-2">
                We'll send an OTP to verify your booking
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* STEP 2: OTP VERIFICATION */}
        {step === "otp" && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div className="text-center mb-6">
              <p className="text-gray-600 mb-2">
                We've sent an OTP to{" "}
                <span className="font-semibold">{formData.phone}</span>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🔐 Enter 6-Digit OTP
              </label>
              <input
                type="text"
                placeholder="000000"
                maxLength="6"
                value={formData.otp}
                onChange={(e) =>
                  setFormData({ ...formData, otp: e.target.value.replace(/\D/g, "") })
                }
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-center text-2xl tracking-widest"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition"
            >
              {loading ? "Verifying..." : "✓ Verify & Login"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep("phone");
                setFormData({ ...formData, otp: "" });
              }}
              className="w-full text-blue-600 hover:text-blue-700 font-medium py-2"
            >
              ← Back to Phone Number
            </button>
          </form>
        )}

        <p className="text-center text-gray-500 text-xs mt-6">
          🔒 Your session is secure and encrypted
        </p>
      </div>
    </div>
  );
}
