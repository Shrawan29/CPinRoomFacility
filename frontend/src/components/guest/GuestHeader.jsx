import { useNavigate } from "react-router-dom";
import { useGuestAuth } from "../../context/GuestAuthContext";
import logo from "../../assets/logo.png";

export default function GuestHeader() {
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
    <header
      className="px-4 py-3 shadow-sm flex items-center justify-between sticky top-0 z-20 backdrop-blur-sm"
      style={{ backgroundColor: "var(--bg-secondary)" }}
    >
      {/* LEFT: LOGO + HOTEL NAME */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-md ring-2 ring-gray-100">
          <img
            src={logo}
            alt="Hotel Logo"
            className="w-10 h-10 object-contain"
          />
        </div>

        <div className="flex flex-col">
          <h1
            className="text-base font-bold leading-tight"
            style={{ color: "var(--text-primary)" }}
          >
            Hotel Centre Point
          </h1>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Room {guest?.roomNumber || "—"}
          </p>
        </div>
      </div>

      {/* RIGHT: GREETING + LOGOUT */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex flex-col items-end">
          <span
            className="text-sm font-medium"
            style={{ color: "var(--text-primary)" }}
          >
            {guestFirstName}
          </span>
          <span
            className="text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            Guest
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="text-sm px-4 py-2 rounded-lg font-medium transition-all hover:opacity-90 active:scale-95 shadow-sm"
          style={{
            backgroundColor: "var(--brand)",
            color: "white",
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}