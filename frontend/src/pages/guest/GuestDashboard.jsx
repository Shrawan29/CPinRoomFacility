import { useNavigate } from "react-router-dom";
import { useGuestAuth } from "../../context/GuestAuthContext";
import hotelbg from "../../assets/hotel-bg.jpg";
import logo from "../../assets/logo.png";
import { useEffect, useState } from "react";

export default function GuestDashboard_Option3B() {
  const { guest } = useGuestAuth();
  const navigate = useNavigate();
  const [fadeIn, setFadeIn] = useState(false);
  const [activeNav, setActiveNav] = useState("home");
  const [expandedSection, setExpandedSection] = useState(null);

  useEffect(() => { setFadeIn(true); }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

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
    { icon: <FoodIcon />, label: "Food", route: "/guest/menu", category: "Dining", bgColor: "from-[#ff6b6b] to-[#ee5a6f]", ringColor: "ring-[#ff6b6b]/20" },
    { icon: <HouseIcon />, label: "Service", route: "/guest/housekeeping", category: "Room", bgColor: "from-[#4ecdc4] to-[#44a8a0]", ringColor: "ring-[#4ecdc4]/20" },
    { icon: <EventsIcon />, label: "Events", route: "/guest/events", category: "Activity", bgColor: "from-[#a29bfe] to-[#6c5ce7]", ringColor: "ring-[#a29bfe]/20" },
    { icon: <AmenitiesIcon />, label: "Amenities", route: "/guest/hotel-info", category: "Facility", bgColor: "from-[#fdcb6e] to-[#f6b93b]", ringColor: "ring-[#fdcb6e]/20" },
  ];

  const hasActiveOrder = false;

  const navItems = [
    { key: "home", label: "Home", icon: (a) => <HomeNavIcon active={a} />, route: "/guest/dashboard" },
    { key: "orders", label: "Orders", icon: (a) => <OrdersNavIcon active={a} />, route: "/guest/orders" },
    { key: "support", label: "Support", icon: (a) => <SupportNavIcon active={a} />, route: "/guest/support" },
  ];

  const exploreItems = [
    { 
      icon: <EventsIcon />, 
      label: "Hotel Events", 
      sub: "Today's schedule",
      route: "/guest/events",
      details: ["Yoga Class - 7:00 AM", "Wine Tasting - 6:00 PM", "Live Jazz - 8:30 PM"]
    },
    { 
      icon: <AmenitiesIcon />, 
      label: "Facilities", 
      sub: "Available now",
      route: "/guest/hotel-info",
      details: ["Gym: Open 24/7", "Pool: Heated, 6AM-10PM", "Spa: Book treatments"]
    },
  ];

  return (
    <div className={`fixed inset-0 bg-[#F6EADB] flex flex-col overflow-hidden transition-opacity duration-700 ${fadeIn ? "opacity-100" : "opacity-0"}`}>

      <div className="flex-1 overflow-y-auto" style={{ maxWidth: 430, width: "100%", margin: "0 auto", paddingBottom: 70 }}>

        {/* ── MEDIUM ANIMATED GRADIENT BANNER ─────────────────────────── */}
        <div className="relative mb-4 overflow-hidden" style={{ height: 150 }}>
          <img src={hotelbg} alt="Hotel" className="w-full h-full object-cover" />
          
          {/* Animated multi-layer gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#A4005D]/70 via-purple-600/40 to-black/60 animate-gradient-shift" />
          <div className="absolute inset-0 bg-gradient-to-tl from-[#c9a96e]/30 via-transparent to-[#A4005D]/20 animate-gradient-pulse" />
          
          {/* Header Content */}
          <div className="absolute top-5 left-5 right-5 flex items-start justify-between">
            <div className="flex-1">
              <p className="text-white/95 text-[10px] font-light tracking-[0.16em] uppercase mb-1">{greeting}</p>
              <h1 className="text-white text-[29px] font-bold leading-none drop-shadow-2xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {guest?.name || "Valued Guest"}
              </h1>
              <div className="inline-flex items-center gap-1.5 bg-white/25 backdrop-blur-xl border border-white/40 rounded-full px-3 py-1 mt-2 shadow-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span className="text-white text-[9px] font-bold tracking-[0.12em]">ROOM {guest?.roomNumber}</span>
              </div>
            </div>
            <img src={logo} alt="Logo" className="w-11 h-11 object-contain opacity-95 drop-shadow-2xl flex-shrink-0" />
          </div>

          {/* Bottom Content */}
          <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
            <div>
              <p className="text-white text-[24px] font-bold leading-tight tracking-wide drop-shadow-xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Grand Luxe Hotel
              </p>
              <p className="text-white/85 text-[9px] font-light tracking-[0.12em] uppercase mt-1">5-Star Experience</p>
            </div>
            <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-3 py-1.5 shadow-lg">
              <p className="text-white text-[8px] font-semibold tracking-[0.12em] uppercase">Premium</p>
            </div>
          </div>
        </div>

        {/* ── COLOR-CODED 4-COLUMN GRID ───────────────────────────────── */}
        <div className="px-4 mb-4">
          <div className="grid grid-cols-4 gap-2.5">
            {quickActions.map((action, idx) => (
              <button
                key={action.label}
                onClick={() => navigate(action.route)}
                className={`relative bg-white rounded-[18px] p-3 flex flex-col items-center justify-center border shadow-[0_3px_16px_rgba(0,0,0,0.06)] active:scale-95 hover:shadow-[0_6px_24px_rgba(0,0,0,0.1)] transition-all duration-300 ring-2 ${action.ringColor}`}
                style={{
                  minHeight: 95,
                  animationDelay: `${idx * 60}ms`,
                  animation: fadeIn ? 'slideUpFade 0.5s ease-out forwards' : 'none'
                }}
              >
                {/* Category tag */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-white border border-gray-200 rounded-full px-2 py-0.5 shadow-sm">
                  <span className="text-[7px] font-bold text-gray-600 tracking-wider uppercase">{action.category}</span>
                </div>
                
                <div className={`w-11 h-11 rounded-[14px] bg-gradient-to-br ${action.bgColor} flex items-center justify-center text-white mb-2.5 shadow-lg group-hover:scale-110 transition-transform duration-300 mt-2`}>
                  {action.icon}
                </div>
                <p className="text-[11px] font-bold text-[#1F1F1F] leading-tight text-center" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {action.label}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* ── EXPANDABLE MEGA CARD ────────────────────────────────────── */}
        <div className="px-4 mb-4">
          <div className="bg-white rounded-[22px] border border-[#c9a96e]/10 shadow-[0_6px_28px_rgba(30,21,16,0.08)] overflow-hidden">
            
            {/* Orders Section */}
            <div className="p-5 border-b border-[#c9a96e]/8">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#6B6B6B]">Your Orders</p>
                <button onClick={() => navigate("/guest/orders")} className="text-[10.5px] text-[#A4005D] font-semibold tracking-wide transition-opacity hover:opacity-70">
                  View All →
                </button>
              </div>

              {hasActiveOrder ? (
                <div>Order details here</div>
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
                    <p className="text-[10px] text-[#6B6B6B] font-light">Start an order anytime</p>
                  </div>
                </div>
              )}
            </div>

            {/* Expandable Explore Section */}
            <div className="p-5">
              <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#6B6B6B] mb-3.5">Explore More</p>
              <div className="flex flex-col gap-2">
                {exploreItems.map((item, idx) => (
                  <div key={item.label} className="border border-[#c9a96e]/8 rounded-[16px] overflow-hidden">
                    <button
                      onClick={() => setExpandedSection(expandedSection === idx ? null : idx)}
                      className="flex items-center gap-3.5 w-full px-3.5 py-3 hover:bg-[#F6EADB]/25 transition-all duration-200 text-left group"
                    >
                      <div className="w-10 h-10 flex-shrink-0 rounded-[12px] bg-gradient-to-br from-[#F6EADB] to-[#f0ddc5] border border-[#A4005D]/10 flex items-center justify-center text-[#A4005D] shadow-sm">
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-[15px] font-bold text-[#1F1F1F] leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                          {item.label}
                        </p>
                        <p className="text-[9.5px] text-[#6B6B6B] font-light mt-0.5">{item.sub}</p>
                      </div>
                      <span className={`text-[#c9a96e] text-[18px] transition-all duration-300 ${expandedSection === idx ? 'rotate-90' : ''}`}>›</span>
                    </button>
                    
                    {/* Expandable Details */}
                    <div className={`overflow-hidden transition-all duration-300 ${expandedSection === idx ? 'max-h-48' : 'max-h-0'}`}>
                      <div className="px-4 pb-3 pt-1 bg-[#F6EADB]/20 border-t border-[#c9a96e]/8">
                        {item.details.map((detail, detailIdx) => (
                          <div key={detailIdx} className="flex items-center gap-2 py-2 border-b border-[#c9a96e]/5 last:border-0">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#A4005D]" />
                            <p className="text-[11px] text-[#1F1F1F] font-light">{detail}</p>
                          </div>
                        ))}
                        <button
                          onClick={() => navigate(item.route)}
                          className="mt-2 w-full py-2 bg-[#A4005D] text-white rounded-[12px] text-[11px] font-semibold tracking-wide active:scale-95 transition-transform"
                        >
                          View Full Schedule
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── WEATHER & LOCAL EVENTS WIDGET ───────────────────────────── */}
        <div className="px-4 pb-3">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-[20px] border border-blue-100 p-4 shadow-[0_4px_20px_rgba(59,130,246,0.08)]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white shadow-md">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <circle cx="12" cy="12" r="5" />
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                  </svg>
                </div>
                <div>
                  <p className="text-[15px] font-bold text-gray-800" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Sunny, 28°C</p>
                  <p className="text-[9px] text-gray-600 font-light">Perfect day to explore</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-semibold text-gray-700">Nearby</p>
                <p className="text-[8px] text-gray-500">Art Festival Today</p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 bg-white/60 backdrop-blur-sm rounded-[12px] p-2 text-center border border-blue-100">
                <p className="text-[9px] text-gray-500 font-medium">Tomorrow</p>
                <p className="text-[13px] font-bold text-gray-800">26°C</p>
              </div>
              <div className="flex-1 bg-white/60 backdrop-blur-sm rounded-[12px] p-2 text-center border border-blue-100">
                <p className="text-[9px] text-gray-500 font-medium">Saturday</p>
                <p className="text-[13px] font-bold text-gray-800">24°C</p>
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
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes gradient-shift {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.85; }
        }
        @keyframes gradient-pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.8; }
        }
        .animate-gradient-shift { animation: gradient-shift 4s ease-in-out infinite; }
        .animate-gradient-pulse { animation: gradient-pulse 6s ease-in-out infinite; }
      `}</style>

    </div>
  );
}