import { useNavigate } from "react-router-dom";
import { useGuestAuth } from "../../context/GuestAuthContext";
import logo from "../../assets/logo.png";
import {hotelbg} from "../../assets/hotel-bg.jpg";

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
      <header
        className="px-4 py-4 shadow flex items-center justify-between"
        style={{ backgroundColor: "var(--bg-secondary)" }}
      >
        {/* LEFT: LOGO ABOVE + NAME BELOW */}
        <div className="flex flex-col items-start">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow mb-1">
            <img
              src={logo}
              alt="Hotel Logo"
              className="w-6 h-6 object-contain"
            />
          </div>

          <h1
            className="text-sm font-bold leading-tight"
            style={{ color: "var(--text-primary)" }}
          >
            Centre Point Hotel
          </h1>
        </div>

        {/* RIGHT: LOGOUT */}
        <button
          onClick={handleLogout}
          className="text-sm px-3 py-2 rounded-md font-medium"
          style={{
            backgroundColor: "var(--brand)",
            color: "white",
          }}
        >
          Logout
        </button>
      </header>


      {/* HERO / WELCOME */}
      <section
        className="relative h-44"
        style={{
          backgroundImage: {hotelbg}, // Use the same image as the logo {hotel-bg},
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
