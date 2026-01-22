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

  /* ============================
     INIT FROM QR TOKEN
     ============================ */
  useEffect(() => {
    const qrToken = searchParams.get("token");

    if (!qrToken) {
      navigate("/guest/access-fallback");
      return;
    }

    setFormData((prev) => ({ ...prev, qrToken }));
  }, [searchParams, navigate]);

  /* ============================
     SEND OTP
     ============================ */
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
      const response = await sendGuestOTP(
        formData.qrToken,
        formData.phone
      );

      // backend should return roomNumber
      if (response?.roomNumber) {
        setRoomNumber(response.roomNumber);
      }

      setStep("otp");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
      
    } finally {
      setLoading(false);
    }
  };

  /* ============================
     VERIFY OTP
     ============================ */
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

        {step === "phone" && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <input
              type="tel"
              placeholder="+91 XXXXX XXXXX"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
              autoFocus
            />

            <button
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg"
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
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-center text-2xl"
              autoFocus
            />

            <button
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg"
            >
              {loading ? "Verifying..." : "Verify & Login"}
            </button>
          </form>
        )}

        <p className="text-center text-gray-500 text-xs mt-6">
          🔒 Secure guest session
        </p>
      </div>
    </div>
  );
}
