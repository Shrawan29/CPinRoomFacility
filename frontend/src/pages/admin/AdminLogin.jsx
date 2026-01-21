import { useState } from "react";
import { adminLogin } from "../../services/admin.service";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { useNavigate } from "react-router-dom";
import hotelBg from "../../assets/hotel-bg.jpg";
import logo from "../../assets/logo.png";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await adminLogin(email, password);
      console.log("✅ Login successful, storing token...", data.admin.role);
      login(data.token, data.admin);
      
      // Verify token was stored
      const storedToken = localStorage.getItem("admin_token");
      console.log("Token stored in localStorage:", storedToken ? "✅ Yes" : "❌ No");

      if (data.admin.role === "SUPER_ADMIN") {
        navigate("/admin/super/dashboard");
      } else if (data.admin.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (data.admin.role === "DINING_ADMIN") {
        navigate("/admin/kitchen/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center relative overflow-hidden bg-[var(--bg-primary)]">

      {/* Background Image */}
      <img
        src={hotelBg}
        alt="Hotel Background"
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />

      {/* Brand Overlay */}
      <div className="absolute inset-0 bg-[var(--brand)] opacity-15"></div>

      {/* Login Content */}
      <div className="relative z-10 w-full max-w-md flex flex-col items-center">

        {/* Logo & Hotel Name */}
        <img src={logo} alt="Hotel Logo" className="w-28 mb-1" />
        <h1 className="text-2xl font-serif text-[var(--text-primary)] mb-4">
          CENTRE POINT
        </h1>

        {/* Login Card */}
        <div className="w-full rounded-xl shadow-xl p-8 bg-[var(--brand)]">

          <h2 className="text-2xl font-medium text-center text-white mb-6">
            Admin Login
          </h2>

          {error && (
            <p className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm text-center">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="
                w-full
                bg-white
                border border-gray-300
                rounded-xl
                px-4 py-2
                text-[var(--text-primary)]
                placeholder-[var(--text-muted)]
                focus:outline-none
                focus:ring-2
                focus:ring-[var(--brand)]
              "
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="
                w-full
                bg-white
                border border-gray-300
                rounded-xl
                px-4 py-2
                text-[var(--text-primary)]
                placeholder-[var(--text-muted)]
                focus:outline-none
                focus:ring-2
                focus:ring-[var(--brand)]
              "
            />

            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                bg-[var(--brand-soft)]
                text-white
                py-2
                rounded-xl
                font-semibold
                hover:opacity-90
                transition
                disabled:opacity-60
              "
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
