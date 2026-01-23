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
      className="px-4 py-4 shadow flex items-center justify-between sticky top-0 z-20"
      style={{ backgroundColor: "var(--bg-secondary)" }}
    >
      {/* LEFT: LOGO + HOTEL NAME */}
      <div className="flex flex-col items-start">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow">
          <img
            src={logo}
            alt="Hotel Logo"
            className="w-10 h-10 object-contain"
          />
        </div>

        <h1
          className="text-sm font-bold leading-tight"
          style={{ color: "var(--text-primary)" }}
        >
          Hotel Centre Point
        </h1>
      </div>

      {/* RIGHT: GREETING + LOGOUT */}
      <div className="flex items-center gap-3">
        <span
          className="text-sm hidden sm:block"
          style={{ color: "var(--text-muted)" }}
        >
          Hi, {guestFirstName}
        </span>

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
      </div>
    </header>
  );
}
