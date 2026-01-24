


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

  const guestFirstName = guest?.name
    ? guest.name.split(" ")[0]
    : "Guest";

  const handleLogout = () => {
    logout();
    navigate("/guest/access-fallback");
  };

  const menuItems = [
    {
      icon: "🍽️",
      title: "Browse Menu",
      description: "Food & beverages available",
      path: "/guest/menu",
      gradient: "from-orange-50 to-red-50",
      iconBg: "bg-gradient-to-br from-orange-100 to-red-100"
    },
    {
      icon: "🏨",
      title: "Hotel Information",
      description: "Amenities, Wi-Fi & house rules",
      path: "/guest/hotel-info",
      gradient: "from-blue-50 to-indigo-50",
      iconBg: "bg-gradient-to-br from-blue-100 to-indigo-100"
    },
    {
      icon: "📦",
      title: "My Orders",
      description: "Track your orders",
      path: "/guest/orders",
      gradient: "from-green-50 to-emerald-50",
      iconBg: "bg-gradient-to-br from-green-100 to-emerald-100"
    },
    {
      icon: "🎉",
      title: "Events",
      description: "Activities during your stay",
      path: "/guest/events",
      gradient: "from-purple-50 to-pink-50",
      iconBg: "bg-gradient-to-br from-purple-100 to-pink-100"
    }
  ];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {/* HEADER WITH LOGO + HOTEL NAME */}
      <GuestHeader />

      {/* HERO / WELCOME */}
      <section
        className="relative h-52 overflow-hidden"
        style={{
          backgroundImage: `url(${hotelbg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />

        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm opacity-90 mb-1">
              Welcome back, {guestFirstName} 👋
            </p>
            <h2 className="text-2xl font-bold mb-1">
              Make yourself comfortable
            </h2>
            <div className="flex items-center gap-2 text-sm opacity-90">
              <span className="px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full">
                Room {guest?.roomNumber}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN ACTION CARDS */}
      <main className="flex-1 px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <h3 
            className="text-lg font-semibold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Quick Access
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {menuItems.map((item, index) => (
              <div
                key={index}
                onClick={() => navigate(item.path)}
                className={`
                  group cursor-pointer
                  bg-gradient-to-br ${item.gradient}
                  rounded-2xl shadow-md hover:shadow-lg
                  transition-all duration-300
                  active:scale-[0.98]
                  border border-gray-100
                  overflow-hidden
                `}
              >
                <div className="bg-white/50 backdrop-blur-sm p-5 h-full">
                  <div className="flex items-start gap-4">
                    <div className={`
                      w-14 h-14 rounded-xl ${item.iconBg}
                      flex items-center justify-center
                      text-3xl shadow-sm
                      group-hover:scale-110 transition-transform duration-300
                    `}>
                      {item.icon}
                    </div>
                    
                    <div className="flex-1">
                      <h3
                        className="text-lg font-semibold mb-1 group-hover:translate-x-1 transition-transform duration-300"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {item.title}
                      </h3>
                      <p 
                        className="text-sm leading-relaxed"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {item.description}
                      </p>
                    </div>

                    <div className="text-gray-400 group-hover:translate-x-1 group-hover:text-gray-600 transition-all duration-300">
                      →
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ADDITIONAL INFO SECTION */}
          <div className="mt-8 p-5 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-start gap-3">
              <div className="text-2xl">💡</div>
              <div>
                <h4 
                  className="font-semibold mb-1"
                  style={{ color: "var(--text-primary)" }}
                >
                  Need Assistance?
                </h4>
                <p 
                  className="text-sm"
                  style={{ color: "var(--text-muted)" }}
                >
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