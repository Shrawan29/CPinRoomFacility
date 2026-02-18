
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

  const Icon = ({ children, className = "" }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {children}
    </svg>
  );

  const icons = {
    housekeeping: (
      <Icon className="w-5 h-5" >
        <path d="M4 20h10" />
        <path d="M7 20V10" />
        <path d="M7 10l8-6" />
        <path d="M15 4l5 5" />
      </Icon>
    ),
    food: (
      <Icon className="w-5 h-5">
        <path d="M4 3v8" />
        <path d="M7 3v8" />
        <path d="M5.5 3v8" />
        <path d="M10 7h2" />
        <path d="M14 3v8c0 1.5 1 2 2 2v8" />
      </Icon>
    ),
    menu: (
      <Icon className="w-5 h-5">
        <path d="M6 7h12" />
        <path d="M6 12h12" />
        <path d="M6 17h12" />
      </Icon>
    ),
    events: (
      <Icon className="w-5 h-5">
        <path d="M8 3v3" />
        <path d="M16 3v3" />
        <path d="M4 7h16" />
        <path d="M6 6h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
        <path d="M8 11h4" />
      </Icon>
    ),
    orders: (
      <Icon className="w-5 h-5">
        <path d="M21 8l-9 5-9-5" />
        <path d="M3 8l9 5 9-5" />
        <path d="M12 13v8" />
        <path d="M3 8V6a2 2 0 0 1 1-1.73L11 1a2 2 0 0 1 2 0l7 3.27A2 2 0 0 1 21 6v2" />
      </Icon>
    ),
    info: (
      <Icon className="w-5 h-5">
        <path d="M12 17v-6" />
        <path d="M12 8h.01" />
        <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
      </Icon>
    ),
    assistance: (
      <Icon className="w-5 h-5">
        <path d="M12 2a7 7 0 0 0-4 12.7V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.3A7 7 0 0 0 12 2z" />
        <path d="M9 21h6" />
      </Icon>
    ),
  };

  const inRoomServices = [
    {
      iconKey: "housekeeping",
      title: "Housekeeping",
      path: "/guest/housekeeping",
    },
    {
      iconKey: "food",
      title: "Food Order",
      path: "/guest/menu",
    },
  ];

  const quickAccess = [
    {
      iconKey: "menu",
      title: "Browse Menu",
      path: "/guest/menu",
    },
    {
      iconKey: "events",
      title: "Events",
      path: "/guest/events",
    },
    {
      iconKey: "orders",
      title: "My Orders",
      path: "/guest/orders",
    },
    {
      iconKey: "info",
      title: "Hotel Info",
      path: "/guest/hotel-info",
    },
  ];

  const ActionTile = ({ iconKey, title, path }) => (
    <button
      type="button"
      onClick={() => navigate(path)}
      className="w-full text-left rounded-card border border-black/10 bg-white/40 px-4 py-3 shadow-[0_6px_20px_rgba(0,0,0,0.05)] hover:bg-white/55 hover:shadow-[0_10px_28px_rgba(0,0,0,0.06)] active:scale-[0.99] transition"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/70 flex items-center justify-center border border-black/5" style={{ color: "var(--text-muted)" }}>
          {icons[iconKey]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium tracking-wide text-[var(--text-primary)] truncate">
            {title}
          </div>
        </div>
        <div className="text-lg leading-none" style={{ color: "var(--text-muted)" }}>→</div>
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
        <div className="absolute inset-0 bg-[var(--bg-primary)]/88" />
        <div className="relative px-4 py-7">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm tracking-wide" style={{ color: "var(--text-muted)" }}>
              Welcome {guestFirstName}.
            </p>
            <h2
              className="mt-2 text-3xl font-semibold leading-tight tracking-wide"
              style={{ color: "var(--text-primary)" }}
            >
              Make yourself
              <br />
              comfortable
            </h2>
            <p className="mt-2 text-xs tracking-wide" style={{ color: "var(--text-muted)" }}>
              Room {guest?.roomNumber || "—"}
            </p>
          </div>
        </div>
      </section>

      {/* MAIN */}
      <main className="flex-1 px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h3 className="text-base font-semibold tracking-wide" style={{ color: "var(--text-primary)" }}>
              In-Room Services
            </h3>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {inRoomServices.map((item) => (
                <ActionTile key={item.title} {...item} />
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-base font-semibold tracking-wide" style={{ color: "var(--text-primary)" }}>
              Quick Access
            </h3>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {quickAccess.map((item) => (
                <ActionTile key={item.title} {...item} />
              ))}
            </div>
          </div>

          <div className="p-5 rounded-xl border border-black/10" style={{ backgroundColor: "rgba(239,225,207,0.55)" }}>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/70 border border-black/5 flex items-center justify-center" style={{ color: "var(--text-muted)" }}>
                {icons.assistance}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold tracking-wide" style={{ color: "var(--text-primary)" }}>
                  Need Assistance?
                </h4>
                <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
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