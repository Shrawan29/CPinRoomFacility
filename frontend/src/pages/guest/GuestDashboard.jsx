import { useNavigate } from "react-router-dom";
import { useGuestAuth } from "../../context/GuestAuthContext";

export default function GuestDashboard() {
  const { guest, logout } = useGuestAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/guest/access-fallback");
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {/* HEADER */}
      <header
        className="shadow-md"
        style={{ backgroundColor: "var(--bg-secondary)" }}
      >
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1
              className="text-2xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              🏨 Room Service
            </h1>
            <p
              className="text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              Room {guest?.roomNumber} • {guest?.phone}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg font-semibold transition"
            style={{
              backgroundColor: "var(--brand)",
              color: "white",
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section
        className="relative h-64 flex items-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1501117716987-c8e1ecb210a4')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome to your stay
          </h2>
          <p className="text-white/90">
            Experience comfort and service at your fingertips
          </p>
        </div>
      </section>

      {/* DASHBOARD CARDS */}
      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* MENU CARD */}
          <div
            onClick={() => navigate("/guest/menu")}
            className="cursor-pointer rounded-2xl shadow-lg p-6 transition hover:scale-[1.02]"
            style={{ backgroundColor: "white" }}
          >
            <div className="text-4xl mb-4">🍽️</div>
            <h3
              className="text-xl font-semibold mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              Browse Menu
            </h3>
            <p style={{ color: "var(--text-muted)" }}>
              Explore dishes and place your order
            </p>
          </div>

          {/* CART CARD */}
          <div
            onClick={() => navigate("/guest/cart")}
            className="cursor-pointer rounded-2xl shadow-lg p-6 transition hover:scale-[1.02]"
            style={{ backgroundColor: "white" }}
          >
            <div className="text-4xl mb-4">🛒</div>
            <h3
              className="text-xl font-semibold mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              Your Cart
            </h3>
            <p style={{ color: "var(--text-muted)" }}>
              Review items before ordering
            </p>
          </div>

          {/* ORDERS CARD */}
          <div
            onClick={() => navigate("/guest/orders")}
            className="cursor-pointer rounded-2xl shadow-lg p-6 transition hover:scale-[1.02]"
            style={{ backgroundColor: "white" }}
          >
            <div className="text-4xl mb-4">📦</div>
            <h3
              className="text-xl font-semibold mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              My Orders
            </h3>
            <p style={{ color: "var(--text-muted)" }}>
              Track your current and past orders
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}
