import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGuestAuth } from "../../context/GuestAuthContext";
import MenuBrowse from "../../components/guest/MenuBrowse";

export default function GuestDashboard() {
  const { guest, logout } = useGuestAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("menu");

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

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* TAB NAVIGATION */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <button
            onClick={() => setActiveTab("menu")}
            className="px-6 py-3 rounded-lg font-semibold transition border-2"
            style={{
              backgroundColor:
                activeTab === "menu" ? "var(--brand)" : "white",
              color:
                activeTab === "menu"
                  ? "white"
                  : "var(--text-primary)",
              borderColor:
                activeTab === "menu"
                  ? "var(--brand)"
                  : "var(--bg-secondary)",
            }}
          >
            🍽️ Browse Menu
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className="px-6 py-3 rounded-lg font-semibold transition border-2"
            style={{
              backgroundColor:
                activeTab === "orders" ? "var(--brand)" : "white",
              color:
                activeTab === "orders"
                  ? "white"
                  : "var(--text-primary)",
              borderColor:
                activeTab === "orders"
                  ? "var(--brand)"
                  : "var(--bg-secondary)",
            }}
          >
            📦 My Orders
          </button>
        </div>

        {/* TAB CONTENT */}
        {activeTab === "menu" && <MenuBrowse />}

        {activeTab === "orders" && (
          <div
            className="text-center py-16 rounded-xl"
            style={{ backgroundColor: "white" }}
          >
            <p style={{ color: "var(--text-muted)" }}>
              Order history coming soon...
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
