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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  return (
    <GuestLuxuryTheme>
      <div className="min-h-screen flex items-center justify-center">
        <form
          className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
          onSubmit={handleLogin}
        >
          <h1 className="text-2xl font-bold mb-6 text-center" style={{ color: "var(--rose)" }}>
            Guest Login
          </h1>
          {error && (
            <div className="mb-4 text-red-600 text-sm font-semibold text-center">
              {error}
            </div>
          )}
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-sm">Last Name</label>
            <input
              type="text"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-200"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              autoFocus
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-sm">Password</label>
            <input
              type="password"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-200"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-lg text-white font-bold mt-2"
            style={{ backgroundColor: "var(--rose)" }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </GuestLuxuryTheme>
  );
}
