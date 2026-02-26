import { useNavigate } from "react-router-dom";
import { useGuestAuth } from "../../context/GuestAuthContext";
import hotelbg from "../../assets/hotel-bg.jpg";
import logo from "../../assets/logo.png";
import { useEffect, useState } from "react";

export default function GuestDashboard_Option3A() {
  const { guest } = useGuestAuth();
  const navigate = useNavigate();
  const [fadeIn, setFadeIn] = useState(false);
  const [activeNav, setActiveNav] = useState("home");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => { 
    setFadeIn(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  const timeString = currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  // ── Icons ─────────────────────────────────────────────────────────────────
  const FoodIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M6 18h12" /><path d="M7 18v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1" />
      <path d="M8 12h8" /><path d="M5 12a7 7 0 0 1 14 0" /><path d="M12 9v-1" />
    </svg>
  );
  const HouseIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M6 3l12 12" /><path d="M10 7l-2 2" /><path d="M14 11l-2 2" />
      <path d="M4 20h7" /><path d="M4 20c1.2-3.4 3.6-5.8 7-7" />
      <path d="M11 13c1.2 0 2.7 1.1 3.6 2.1" />
    </svg>
  );
  const EventsIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M8 3v3" /><path d="M16 3v3" /><path d="M4 7h16" />
      <path d="M6 6h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
      <path d="M8 11h4" />
    </svg>
  );
  const AmenitiesIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <circle cx="12" cy="12" r="10" /><path d="M8 12h8" /><path d="M12 8v8" />
    </svg>
  );
  const OrdersNavIcon = ({ active }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <path d="M9 12h6" /><path d="M9 16h4" />
    </svg>
  );
  const SupportNavIcon = ({ active }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <circle cx="12" cy="17" r=".5" fill="currentColor" />
    </svg>
  );
  const HomeNavIcon = ({ active }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  );

  const quickActions = [
    { icon: <FoodIcon />, label: "Food", route: "/guest/menu", badge: "2", color: "from-[#A4005D] to-[#d4116f]" },
    { icon: <HouseIcon />, label: "Service", route: "/guest/housekeeping", badge: null, color: "from-[#c9a96e] to-[#d4b878]" },
    { icon: <EventsIcon />, label: "Events", route: "/guest/events", badge: "3", color: "from-[#8B4789] to-[#a456a2]" },
    { icon: <AmenitiesIcon />, label: "Amenities", route: "/guest/hotel-info", badge: null, color: "from-[#5c8a8e] to-[#6d9fa3]" },
  ];

  const hasActiveOrder = false;

  const navItems = [
    { key: "home", label: "Home", icon: (a) => <HomeNavIcon active={a} />, route: "/guest/dashboard" },
    { key: "orders", label: "Orders", icon: (a) => <OrdersNavIcon active={a} />, route: "/guest/orders" },
    { key: "support", label: "Support", icon: (a) => <SupportNavIcon active={a} />, route: "/guest/support" },
  ];

  const exploreItems = [
    { icon: <EventsIcon />, label: "Hotel Events", sub: "Check today's activities", route: "/guest/events" },
    { icon: <AmenitiesIcon />, label: "Facilities", sub: "Gym, spa & pool access", route: "/guest/hotel-info" },
  ];

  return (
    <div className={`fixed inset-0 bg-[#F6EADB] flex flex-col overflow-hidden transition-opacity duration-700 ${fadeIn ? "opacity-100" : "opacity-0"}`}>

      <div className="flex-1 overflow-y-auto" style={{ maxWidth: 430, width: "100%", margin: "0 auto", paddingBottom: 70 }}>

        {/* ── EXTRA LARGE IMMERSIVE HERO BANNER ───────────────────────── */}
        <div className="relative mb-4" style={{ height: 220 }}>
          <img src={hotelbg} alt="Hotel" className="w-full h-full object-cover" />
          
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-[#A4005D]/35 to-black/70 animate-pulse-slow" />
          
          {/* Top overlay with guest info */}
          <div className="absolute top-6 left-5 right-5 flex items-start justify-between">
            <div className="flex-1">
              <p className="text-white/95 text-[10px] font-light tracking-[0.16em] uppercase mb-1 animate-fade-in">{greeting}</p>
              <h1 className="text-white text-[32px] font-bold leading-none drop-shadow-2xl animate-slide-up" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {guest?.name || "Valued Guest"}
              </h1>
              <div className="inline-flex items-center gap-1.5 bg-white/25 backdrop-blur-xl border border-white/40 rounded-full px-3 py-1.5 mt-2.5 shadow-lg animate-fade-in-delay">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span className="text-white text-[9px] font-bold tracking-[0.12em]">ROOM {guest?.roomNumber}</span>
              </div>
            </div>
            <img src={logo} alt="Logo" className="w-12 h-12 object-contain opacity-95 drop-shadow-2xl flex-shrink-0 animate-fade-in" />
          </div>

          {/* Time display */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2">
            <div className="bg-white/15 backdrop-blur-md border border-white/25 rounded-full px-4 py-1.5 shadow-lg">
              <p className="text-white text-[10px] font-semibold tracking-wider">{timeString}</p>
            </div>
          </div>

          {/* Bottom banner content */}
          <div className="absolute bottom-5 left-5 right-5">
            <p className="text-white text-[26px] font-bold leading-tight tracking-wide drop-shadow-2xl animate-slide-up-delay" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Grand Luxe Hotel
            </p>
            <div className="flex items-center gap-2 mt-2">
              <div className="h-px flex-1 bg-gradient-to-r from-white/60 via-white/30 to-transparent" />
              <p className="text-white/90 text-[9px] font-light tracking-[0.14em] uppercase">Luxury Redefined</p>
            </div>
          </div>
        </div>

        {/* ── ENHANCED 4-COLUMN GRID WITH BADGES & ANIMATIONS ─────────── */}
        <div className="px-4 mb-4">
          <div className="grid grid-cols-4 gap-2.5">
            {quickActions.map((action, idx) => (
              <button
                key={action.label}
                onClick={() => navigate(action.route)}
                className="relative bg-white rounded-[18px] p-3 flex flex-col items-center justify-center border border-[#A4005D]/6 shadow-[0_3px_16px_rgba(164,0,93,0.08)] active:scale-95 hover:shadow-[0_6px_24px_rgba(164,0,93,0.14)] transition-all duration-300 group"
                style={{
                  minHeight: 92,
                  animationDelay: `${idx * 60}ms`,
                  animation: fadeIn ? 'popInBounce 0.5s ease-out forwards' : 'none'
                }}
              >
                {/* Badge notification */}
                {action.badge && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-[#ff4757] to-[#ff6348] rounded-full flex items-center justify-center text-white text-[9px] font-bold shadow-lg border-2 border-white animate-bounce-subtle">
                    {action.badge}
                  </div>
                )}
                
                <div className={`w-11 h-11 rounded-[14px] bg-gradient-to-br ${action.color} border border-white/50 flex items-center justify-center text-white mb-2.5 shadow-md group-hover:scale-110 group-active:scale-95 transition-transform duration-300`}>
                  {action.icon}
                </div>
                <p className="text-[11px] font-bold text-[#1F1F1F] leading-tight text-center" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {action.label}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* ── MEGA CARD WITH STATUS TIMELINE ──────────────────────────── */}
        <div className="px-4 mb-4">
          <div className="bg-white rounded-[22px] border border-[#c9a96e]/10 shadow-[0_6px_28px_rgba(30,21,16,0.08)] overflow-hidden">
            
            {/* Orders Section with Timeline */}
            <div className="p-5 border-b border-[#c9a96e]/8">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#6B6B6B]">Your Orders</p>
                <button onClick={() => navigate("/guest/orders")} className="text-[10.5px] text-[#A4005D] font-semibold tracking-wide transition-opacity hover:opacity-70">
                  View All →
                </button>
              </div>

              {hasActiveOrder ? (
                <div className="space-y-3">
                  {/* Timeline will go here when there's an active order */}
                </div>
              ) : (
                <div className="flex items-center gap-3.5 p-4 bg-gradient-to-r from-[#F6EADB] to-[#f0ddc5]/50 rounded-[16px] border border-[#A4005D]/8">
                  <div className="w-11 h-11 flex-shrink-0 rounded-[13px] bg-white border border-[#A4005D]/10 flex items-center justify-center text-[#A4005D] shadow-sm">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5.5 h-5.5">
                      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                      <rect x="9" y="3" width="6" height="4" rx="1" />
                      <path d="M9 12h6" /><path d="M9 16h4" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-[15px] font-bold text-[#1F1F1F] leading-tight mb-0.5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      No active orders
                    </p>
                    <p className="text-[10px] text-[#6B6B6B] font-light">Ready to serve you anytime</p>
                  </div>
                </div>
              )}
            </div>

            {/* Explore Section */}
            <div className="p-5">
              <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#6B6B6B] mb-3.5">Explore More</p>
              <div className="flex flex-col gap-2">
                {exploreItems.map((item, idx) => (
                  <button
                    key={item.label}
                    onClick={() => navigate(item.route)}
                    className="flex items-center gap-3.5 w-full px-3.5 py-3 rounded-[15px] active:bg-[#F6EADB]/50 hover:bg-[#F6EADB]/25 transition-all duration-200 text-left group"
                  >
                    <div className="w-10 h-10 flex-shrink-0 rounded-[12px] bg-gradient-to-br from-[#F6EADB] to-[#f0ddc5] border border-[#A4005D]/10 flex items-center justify-center text-[#A4005D] shadow-sm group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-[15px] font-bold text-[#1F1F1F] leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        {item.label}
                      </p>
                      <p className="text-[9.5px] text-[#6B6B6B] font-light mt-0.5">{item.sub}</p>
                    </div>
                    <span className="text-[#c9a96e] text-[18px] opacity-50 group-hover:opacity-80 group-hover:translate-x-1 transition-all duration-200">›</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── LIVE NOTIFICATIONS FEED ─────────────────────────────────── */}
        <div className="px-4 pb-3">
          <div className="bg-gradient-to-br from-[#A4005D]/8 via-[#c9a96e]/8 to-[#A4005D]/6 rounded-[20px] border border-[#A4005D]/10 p-4 shadow-[0_4px_20px_rgba(164,0,93,0.06)]">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 flex-shrink-0 rounded-[12px] bg-gradient-to-br from-white/80 to-white/60 border border-[#A4005D]/12 flex items-center justify-center text-[#A4005D] shadow-sm">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-[13px] font-bold text-[#1F1F1F]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    Live Updates
                  </p>
                  <span className="px-2 py-0.5 bg-[#A4005D]/10 border border-[#A4005D]/20 rounded-full text-[8px] font-bold text-[#A4005D] tracking-wider">LIVE</span>
                </div>
                <p className="text-[10.5px] text-[#6B6B6B] font-light leading-relaxed mb-2">
                  Rooftop lounge now open • Pool heated to 28°C
                </p>
                <button className="text-[9px] text-[#A4005D] font-semibold tracking-wide hover:opacity-70 transition-opacity">
                  View All Notifications →
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ── BOTTOM NAV ──────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 bg-white/97 backdrop-blur-xl border-t border-[#c9a96e]/12 shadow-[0_-4px_20px_rgba(30,21,16,0.08)]" style={{ maxWidth: 430, width: "100%", margin: "0 auto" }}>
        <div className="flex items-center justify-around px-2 py-2.5">
          {navItems.map((item) => {
            const isActive = activeNav === item.key;
            return (
              <button
                key={item.key}
                onClick={() => { setActiveNav(item.key); navigate(item.route); }}
                className="relative flex flex-col items-center gap-1 px-7 py-2 rounded-[14px] transition-all duration-300 active:scale-95"
              >
                {isActive && <div className="absolute inset-0 bg-[#A4005D]/8 rounded-[14px]" />}
                <span className={`relative transition-all duration-300 ${isActive ? "text-[#A4005D] scale-110" : "text-[#6B6B6B]"}`}>
                  {item.icon(isActive)}
                </span>
                <span className={`relative text-[9px] font-semibold tracking-wider transition-all duration-300 ${isActive ? "text-[#A4005D]" : "text-[#6B6B6B]"}`}>
                  {item.label.toUpperCase()}
                </span>
                {isActive && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#A4005D]" />}
              </button>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes popInBounce {
          0% { opacity: 0; transform: scale(0.8); }
          50% { transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.95; }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up-delay {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-delay {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-slide-up { animation: slide-up 0.6s ease-out; }
        .animate-slide-up-delay { animation: slide-up-delay 0.8s ease-out; }
        .animate-fade-in-delay { animation: fade-in-delay 1s ease-out; }
        .animate-bounce-subtle { animation: bounce-subtle 2s ease-in-out infinite; }
      `}</style>

    </div>
  );
}