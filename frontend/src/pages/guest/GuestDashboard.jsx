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
    navigate("/guest/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Room Service</h1>
            <p className="text-gray-600 text-sm">
              Room {guest?.roomNumber} • {guest?.phone}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* TAB NAVIGATION */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab("menu")}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === "menu"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-600"
            }`}
          >
            🍽️ Browse Menu
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === "orders"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-600"
            }`}
          >
            📦 My Orders
          </button>
        </div>

        {/* TAB CONTENT */}
        {activeTab === "menu" && <MenuBrowse />}
        {activeTab === "orders" && (
          <div className="text-center py-12">
            <p className="text-gray-500">Order history coming soon...</p>
          </div>
        )}
      </main>
    </div>
  );
}
