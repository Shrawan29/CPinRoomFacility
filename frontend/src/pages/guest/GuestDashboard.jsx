
// ============================================
// GuestDashboard.jsx - Enhanced Version
// ============================================

import { useNavigate } from "react-router-dom";
import { useGuestAuth } from "../../context/GuestAuthContext";
import hotelbg from "../../assets/hotel-bg.jpg";
import GuestHeader from "../../components/guest/GuestHeader";

export default function GuestDashboard() {
  const { guest, logout } = useGuestAuth();
  const navigate = useNavigate();

  // Extract guest name - check multiple possible property names
  const guestFirstName = 
    guest?.name 
      ? guest.name.split(" ")[0]
      : guest?.guestName
      ? guest.guestName.split(" ")[0]
      : "Guest";

  const handleLogout = () => {
    logout();
    navigate("/guest/access-fallback");
  };

  const inRoomServices = [
    {
      icon: "🧹",
      title: "Housekeeping",
      path: "/guest/housekeeping",
    },
    {
      icon: "🍽️",
      title: "Food Order",
      path: "/guest/menu",
    },
  ];

  const quickAccess = [
    {
      icon: "🍽️",
      title: "Browse Menu",
      path: "/guest/menu",
    },
    {
      icon: "🎉",
      title: "Events",
      path: "/guest/events",
    },
    {
      icon: "📦",
      title: "My Orders",
      path: "/guest/orders",
    },
    {
      icon: "🏨",
      title: "Hotel Info",
      path: "/guest/hotel-info",
    },
  ];

  const ActionTile = ({ icon, title, path }) => (
    <button
      type="button"
      onClick={() => navigate(path)}
      className="w-full text-left rounded-xl border border-black/10 bg-white/70 backdrop-blur-sm px-4 py-3 shadow-sm active:opacity-95 transition"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center border border-black/5">
          <span className="text-xl" aria-hidden>
            {icon}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-[var(--text-primary)] truncate">
            {title}
          </div>
        </div>
        <div className="text-xl leading-none" style={{ color: "var(--text-muted)" }}>
          ›
        </div>
      </div>
    </button>
  );

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {/* HEADER WITH LOGO + HOTEL NAME */}
      <GuestHeader />

      {/* HERO / WELCOME */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundImage: `url(${hotelbg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-[var(--bg-primary)]/80" />
        <div className="relative px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <p className="text-base" style={{ color: "var(--text-primary)" }}>
              Welcome {guestFirstName}.
            </p>
            <h2
              className="mt-2 text-3xl font-bold leading-tight"
              style={{ color: "var(--text-primary)" }}
            >
              Make yourself
              <br />
              comfortable
            </h2>
            <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
              Room {guest?.roomNumber || "—"}
            </p>
          </div>
        </div>
      </section>

      {/* MAIN */}
      <main className="flex-1 px-4 py-5">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h3 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
              In-Room Services
            </h3>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {inRoomServices.map((item) => (
                <ActionTile key={item.title} {...item} />
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
              Quick Access
            </h3>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {quickAccess.map((item) => (
                <ActionTile key={item.title} {...item} />
              ))}
            </div>
          </div>

          <div className="p-5 bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-black/10">
            <div className="flex items-start gap-3">
              <div className="text-2xl">💡</div>
              <div>
                <h4 className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                  Need Assistance?
                </h4>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  Our team is available 24/7. Dial 0 from your room phone or visit the reception desk.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* SAFE BOTTOM SPACE */}
      <div className="h-6" />
    </div>
  );
}