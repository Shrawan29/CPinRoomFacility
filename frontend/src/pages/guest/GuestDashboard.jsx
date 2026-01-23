import { useNavigate } from "react-router-dom";
import { useGuestAuth } from "../../context/GuestAuthContext";

import hotelbg from "../../assets/hotel-bg.jpg";
import GuestHeader from "../../components/guest/GuestHeader";

export default function GuestDashboard() {
  const { guest, logout } = useGuestAuth();
  const navigate = useNavigate();

  const guestFirstName = guest?.name
    ? guest.name.split(" ")[0]
    : "Guest";

  const handleLogout = () => {
    logout();
    navigate("/guest/access-fallback");
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {/* HEADER WITH LOGO + HOTEL NAME */}

      <GuestHeader />

      {/* HERO / WELCOME */}
      <section
        className="relative h-44"
        style={{
          backgroundImage: { hotelbg }, // Use the same image as the logo {hotel-bg},
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute bottom-4 left-4 right-4 text-white">
          <p className="text-sm opacity-90">
            Welcome, {guestFirstName} 👋
          </p>
          <h2 className="text-xl font-semibold">
            Make yourself comfortable
          </h2>
          <p className="text-xs opacity-90">
            Room {guest?.roomNumber}
          </p>
        </div>
      </section>

      {/* MAIN ACTION CARDS */}
      <main className="flex-1 px-4 py-6">
        <div className="grid grid-cols-1 gap-4">

          {/* MENU */}
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

          {/* HOTEL INFO */}
          <div
            onClick={() => navigate("/guest/hotel-info")}
            className="flex items-center gap-4 p-5 rounded-2xl shadow-md active:scale-[0.98] transition"
            style={{ backgroundColor: "white" }}
          >
            <div className="text-3xl">🏨</div>
            <div>
              <h3
                className="text-lg font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Hotel Information
              </h3>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Amenities, Wi-Fi & house rules
              </p>
            </div>
          </div>

          {/* ORDERS */}
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
                Track your orders
              </p>
            </div>
          </div>

        </div>
      </main>

      {/* SAFE BOTTOM SPACE */}
      <div className="h-6" />
    </div>
  );
}
