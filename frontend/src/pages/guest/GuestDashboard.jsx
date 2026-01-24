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

  const quickActions = [
    {
      icon: "🍽️",
      title: "Browse Menu",
      description: "Order delicious food & drinks",
      route: "/guest/menu",
      color: "#ff6b6b",
      bgGradient: "linear-gradient(135deg, #fff5f5 0%, #ffe5e5 100%)"
    },
    {
      icon: "📦",
      title: "My Orders",
      description: "Track your order status",
      route: "/guest/orders",
      color: "#4dabf7",
      bgGradient: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)"
    },
    {
      icon: "🏨",
      title: "Hotel Info",
      description: "Facilities & services",
      route: "/guest/hotel-info",
      color: "#9775fa",
      bgGradient: "linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)"
    }
  ];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#f5f7fa" }}
    >
      {/* HEADER */}
      <GuestHeader />

      {/* HERO SECTION - Enhanced for mobile */}
      <section
        className="relative"
        style={{
          height: "240px",
          backgroundImage: `url(${hotelbg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70" />

        {/* Welcome content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 pb-8 text-white">
          <div className="space-y-2">
            <p className="text-sm font-medium opacity-90 tracking-wide">
              Welcome back 👋
            </p>
            <h1 className="text-4xl font-bold tracking-tight">
              {guestFirstName}
            </h1>
            <div className="flex items-center gap-2 mt-3">
              <div className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full flex items-center gap-2">
                <span className="text-sm">🚪 Room {guest?.roomNumber}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK ACTIONS - Mobile optimized grid */}
      <main className="flex-1 px-5 -mt-6 pb-8">
        {/* Quick access title */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            Quick Access
          </h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            What would you like to do?
          </p>
        </div>

        {/* Action cards */}
        <div className="grid grid-cols-1 gap-4">
          {quickActions.map((action, index) => (
            <div
              key={index}
              onClick={() => navigate(action.route)}
              className="relative overflow-hidden rounded-3xl shadow-lg active:scale-[0.97] transition-transform duration-200"
              style={{
                background: action.bgGradient,
                border: "1px solid rgba(0,0,0,0.05)"
              }}
            >
              {/* Card content */}
              <div className="flex items-center gap-5 p-6">
                {/* Icon circle */}
                <div
                  className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-md"
                  style={{
                    backgroundColor: "white",
                    border: `2px solid ${action.color}20`
                  }}
                >
                  {action.icon}
                </div>

                {/* Text content */}
                <div className="flex-1">
                  <h3
                    className="text-xl font-bold mb-1"
                    style={{ color: action.color }}
                  >
                    {action.title}
                  </h3>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                    {action.description}
                  </p>
                </div>

                {/* Arrow indicator */}
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: `${action.color}15`,
                    color: action.color
                  }}
                >
                  →
                </div>
              </div>

              {/* Decorative element */}
              <div
                className="absolute -right-8 -bottom-8 w-24 h-24 rounded-full opacity-10"
                style={{ backgroundColor: action.color }}
              />
            </div>
          ))}
        </div>

        {/* Featured info card */}
        <div className="mt-6 p-5 rounded-2xl" style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}>
          <div className="flex items-start gap-3">
            <div className="text-2xl">💡</div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                Need assistance?
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                Our staff is available 24/7 to help you. Dial <span className="font-semibold" style={{ color: "var(--brand)" }}>0</span> from your room phone.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Safe bottom space for mobile gestures */}
      <div className="h-8" />
    </div>
  );
}