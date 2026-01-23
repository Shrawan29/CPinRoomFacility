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
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {/* HEADER */}
      <header
        className="px-4 py-4 flex justify-between items-center shadow"
        style={{ backgroundColor: "var(--bg-secondary)" }}
      >
        <div>
          <h1
            className="text-lg font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            🏨 Room Service
          </h1>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Room {guest?.roomNumber}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="text-sm px-3 py-2 rounded-md"
          style={{
            backgroundColor: "var(--brand)",
            color: "white",
          }}
        >
          Logout
        </button>
      </header>

      {/* HERO (MOBILE RATIO) */}
      <section
        className="relative h-48"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h2 className="text-xl font-semibold mb-1">
            Welcome 👋
          </h2>
          <p className="text-sm text-white/90">
            Enjoy your stay with comfort & care
          </p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="flex-1 px-4 py-6">
        <div className="grid grid-cols-1 gap-4">

          {/* MENU CARD */}
          <div
            onClick={() => navigate("/guest/menu")}
            className="flex items-center gap-4 p-5 rounded-2xl shadow-md active:scale-[0.98] transition"
            style={{ backgroundColor: "white" }}
          >
            <div className="text-3xl">🍽️</div>
            <div>
              <h3
                className="text-lg font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Browse Menu
              </h3>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Food & beverages available
              </p>
            </div>
          </div>

          {/* CART CARD */}
          <div
            onClick={() => navigate("/guest/cart")}
            className="flex items-center gap-4 p-5 rounded-2xl shadow-md active:scale-[0.98] transition"
            style={{ backgroundColor: "white" }}
          >
            <div className="text-3xl">🛒</div>
            <div>
              <h3
                className="text-lg font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Your Cart
              </h3>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Review before placing order
              </p>
            </div>
          </div>

          {/* ORDERS CARD */}
          <div
            onClick={() => navigate("/guest/orders")}
            className="flex items-center gap-4 p-5 rounded-2xl shadow-md active:scale-[0.98] transition"
            style={{ backgroundColor: "white" }}
          >
            <div className="text-3xl">📦</div>
            <div>
              <h3
                className="text-lg font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                My Orders
              </h3>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Track order status
              </p>
            </div>
          </div>

        </div>
      </main>

      {/* FOOTER SAFE SPACE (THUMB FRIENDLY) */}
      <div className="h-6" />
    </div>
  );
}
