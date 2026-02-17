import { useState, useEffect } from "react";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const roomNumber = searchParams.get("room");
    if (!roomNumber) {
      navigate("/guest/access-fallback");
      return;
    }
    setFormData((prev) => ({ ...prev, roomNumber }));
  }, [searchParams, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.lastName || !formData.password) {
      setError("Please enter your last name and password");
      setLoading(false);
      return;
    }

    try {
      const response = await guestLoginByLastName(
        formData.roomNumber,
        formData.lastName,
        formData.password
      );

      if (response?.token && response?.guest) {
        login(response.token, response.guest);
        navigate("/guest/dashboard");
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please check your details."
      );
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

        {formData.roomNumber && (
          <p
            className="text-center font-semibold mb-6"
            style={{ color: "var(--brand)" }}
          >
            Room #{formData.roomNumber}
          </p>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-lg text-sm border border-red-200 bg-red-50 text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Last Name (no Mr/Ms)"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none"
            style={{
              borderColor: "var(--bg-secondary)",
              color: "var(--text-primary)",
            }}
            autoFocus
          />

          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none"
            style={{
              borderColor: "var(--bg-secondary)",
              color: "var(--text-primary)",
            }}
          />

          <p className="text-xs text-center" style={{ color: "var(--text-muted)" }}>
            Enter only your last name (no title). Password format is
            {formData.lastName ? ` ${formData.roomNumber}_${formData.lastName}` : " room_lastname"}.
          </p>

          <button
            disabled={loading}
            className="w-full py-3 rounded-lg font-semibold text-white transition"
            style={{
              backgroundColor: "var(--brand)",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Logging in..." : "Login to Room Service"}
          </button>
        </form>

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
