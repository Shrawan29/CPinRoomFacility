import { useNavigate } from "react-router-dom";
import { useGuestAuth } from "../../context/GuestAuthContext";
import hotelbg from "../../assets/hotel-bg.jpg";
import logo from "../../assets/logo.png";
import { useEffect, useState } from "react";

export default function GuestDashboard_Option2() {
  const { guest } = useGuestAuth();
  const navigate = useNavigate();
  const [fadeIn, setFadeIn] = useState(false);
  const [activeNav, setActiveNav] = useState("home");

  useEffect(() => { setFadeIn(true); }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  // ── Icons ─────────────────────────────────────────────────────────────────
  const FoodIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <path d="M6 18h12" /><path d="M7 18v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1" />
      <path d="M8 12h8" /><path d="M5 12a7 7 0 0 1 14 0" /><path d="M12 9v-1" />
    </svg>
  );
  const HouseIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <path d="M6 3l12 12" /><path d="M10 7l-2 2" /><path d="M14 11l-2 2" />
      <path d="M4 20h7" /><path d="M4 20c1.2-3.4 3.6-5.8 7-7" />
      <path d="M11 13c1.2 0 2.7 1.1 3.6 2.1" />
    </svg>
  );
  const EventsIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <path d="M8 3v3" /><path d="M16 3v3" /><path d="M4 7h16" />
      <path d="M6 6h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
      <path d="M8 11h4" />
    </svg>
  );
  const AmenitiesIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
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
    { icon: <FoodIcon />, label: "Food Order", sub: "In-room dining", route: "/guest/menu" },
    { icon: <HouseIcon />, label: "Housekeeping", sub: "Room essentials", route: "/guest/housekeeping" },
    { icon: <EventsIcon />, label: "Events", sub: "Hotel activities", route: "/guest/events" },
    { icon: <AmenitiesIcon />, label: "Amenities", sub: "Explore facilities", route: "/guest/hotel-info" },
  ];

  const hasActiveOrder = false;
  const activeOrder = {
    items: [{ name: "Veg Sandwich", qty: 1 }, { name: "Mineral Water", qty: 1 }],
    status: "Preparing",
  };

  const navItems = [
    { key: "home", label: "Home", icon: (a) => <HomeNavIcon active={a} />, route: "/guest/dashboard" },
    { key: "orders", label: "Orders", icon: (a) => <OrdersNavIcon active={a} />, route: "/guest/orders" },
    { key: "support", label: "Support", icon: (a) => <SupportNavIcon active={a} />, route: "/guest/support" },
  ];

  return (
    <div className={`fixed inset-0 bg-[#F6EADB] flex flex-col overflow-hidden transition-opacity duration-700 ${fadeIn ? "opacity-100" : "opacity-0"}`}>

      <div className="flex-1 overflow-y-auto" style={{ maxWidth: 430, width: "100%", margin: "0 auto", paddingBottom: 70 }}>

        {/* ── COMPACT HEADER WITH INLINE BANNER ──────────────────────── */}
        <div className="px-5 pt-7 pb-3">
          {/* Mini Banner Card */}
          <div className="rounded-[18px] overflow-hidden relative shadow-[0_4px_20px_rgba(164,0,93,0.12)] mb-4" style={{ height: 100 }}>
            <img src={hotelbg} alt="Hotel" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#A4005D]/70 via-[#A4005D]/40 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-between px-5">
              <div>
                <p className="text-white/90 text-[10px] font-light tracking-[0.12em] uppercase mb-0.5">{greeting}</p>
                <h1 className="text-white text-[24px] font-bold leading-tight drop-shadow-lg" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {guest?.name || "Valued Guest"}
                </h1>
                <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-2.5 py-0.5 mt-1.5">
                  <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                  <span className="text-white text-[9px] font-semibold tracking-wider">ROOM {guest?.roomNumber}</span>
                </div>
              </div>
              <img src={logo} alt="Logo" className="w-11 h-11 object-contain opacity-90 drop-shadow-lg" />
            </div>
          </div>
        </div>

        {/* ── YOUR ORDERS (Priority Section) ─────────────────────────── */}
        <div className="px-5 mb-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#6B6B6B]">Your Orders</p>
            <button onClick={() => navigate("/guest/orders")} className="text-[10.5px] text-[#A4005D] font-semibold tracking-wide transition-opacity hover:opacity-70">
              View All →
            </button>
          </div>

          {hasActiveOrder ? (
            <div className="bg-white rounded-[18px] border border-[#c9a96e]/12 shadow-[0_4px_20px_rgba(30,21,16,0.07)] p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[17px] font-bold text-[#1F1F1F]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Current Order</span>
                <span className="bg-[#A4005D]/8 text-[#A4005D] border border-[#A4005D]/12 rounded-full px-3 py-1 text-[10px] font-bold tracking-wider">
                  {activeOrder.status.toUpperCase()}
                </span>
              </div>
              {activeOrder.items.map((item) => (
                <div key={item.name} className="flex justify-between text-[13px] text-[#5c4a3e] font-light py-2 border-b border-[#c9a96e]/8 last:border-0">
                  <span>{item.name}</span>
                  <span className="text-[#6B6B6B]">×{item.qty}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-[18px] border border-[#c9a96e]/10 shadow-[0_3px_16px_rgba(30,21,16,0.06)] px-5 py-4.5 flex items-center gap-3.5 transition-all duration-300 hover:shadow-[0_5px_22px_rgba(30,21,16,0.09)]">
              <div className="w-11 h-11 flex-shrink-0 rounded-[13px] bg-gradient-to-br from-[#F6EADB] to-[#f0ddc5] border border-[#A4005D]/10 flex items-center justify-center text-[#A4005D] shadow-sm">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5.5 h-5.5">
                  <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                  <rect x="9" y="3" width="6" height="4" rx="1" />
                  <path d="M9 12h6" /><path d="M9 16h4" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-[15px] font-bold text-[#1F1F1F] leading-tight mb-0.5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  No active orders
                </p>
                <p className="text-[10.5px] text-[#6B6B6B] font-light">Your requests will appear here</p>
              </div>
            </div>
          )}
        </div>

        {/* ── HORIZONTAL SCROLLING QUICK ACTIONS ──────────────────────── */}
        <div className="mb-5">
          <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#6B6B6B] mb-3 px-5">Quick Actions</p>
          <div className="flex gap-3 overflow-x-auto px-5 pb-2 scrollbar-hide" style={{ scrollSnapType: 'x mandatory' }}>
            {quickActions.map((action, idx) => (
              <button
                key={action.label}
                onClick={() => navigate(action.route)}
                className="flex-shrink-0 bg-white rounded-[18px] p-4 flex flex-col items-center justify-center border border-[#A4005D]/6 shadow-[0_3px_16px_rgba(164,0,93,0.07)] active:scale-95 hover:shadow-[0_5px_22px_rgba(164,0,93,0.12)] transition-all duration-300"
                style={{ 
                  width: 140,
                  minHeight: 140,
                  scrollSnapAlign: 'start',
                  animationDelay: `${idx * 60}ms`,
                  animation: fadeIn ? 'fadeInScale 0.5s ease-out forwards' : 'none'
                }}
              >
                <div className="w-14 h-14 rounded-[16px] bg-gradient-to-br from-[#F6EADB] to-[#f0ddc5] border border-[#A4005D]/10 flex items-center justify-center text-[#A4005D] mb-3 shadow-sm">
                  {action.icon}
                </div>
                <p className="text-[15px] font-bold text-[#1F1F1F] leading-tight text-center mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {action.label}
                </p>
                <p className="text-[9.5px] text-[#6B6B6B] font-light text-center leading-snug">{action.sub}</p>
              </button>
            ))}
          </div>
        </div>

        {/* ── EXPLORE SECTION ─────────────────────────────────────────── */}
        <div className="px-5 pb-3">
          <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#6B6B6B] mb-3">Explore More</p>
          <div className="bg-white rounded-[18px] border border-[#c9a96e]/10 shadow-[0_3px_16px_rgba(30,21,16,0.06)] overflow-hidden">
            {[
              { icon: <EventsIcon />, label: "Events", sub: "Discover hotel activities", route: "/guest/events" },
              { icon: <AmenitiesIcon />, label: "Amenities", sub: "Explore our facilities", route: "/guest/hotel-info" },
            ].map((item, idx) => (
              <button
                key={item.label}
                onClick={() => navigate(item.route)}
                className={`flex items-center gap-3.5 w-full px-4 py-4 active:bg-[#F6EADB]/30 transition-all duration-200 text-left ${
                  idx === 0 ? 'border-b border-[#c9a96e]/8' : ''
                }`}
              >
                <div className="w-10 h-10 flex-shrink-0 rounded-[12px] bg-gradient-to-br from-[#F6EADB] to-[#f0ddc5] border border-[#A4005D]/8 flex items-center justify-center text-[#A4005D]">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <p className="text-[15.5px] font-bold text-[#1F1F1F] leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {item.label}
                  </p>
                  <p className="text-[10px] text-[#6B6B6B] font-light mt-0.5">{item.sub}</p>
                </div>
                <span className="text-[#c9a96e] text-[16px] opacity-50">›</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── BOTTOM WELCOME MESSAGE ──────────────────────────────────── */}
        <div className="px-5 pb-4 mt-4">
          <div className="bg-gradient-to-r from-[#A4005D]/8 to-[#c9a96e]/8 rounded-[16px] border border-[#A4005D]/10 px-4 py-3.5 text-center">
            <p className="text-[13px] font-bold text-[#1F1F1F] mb-0.5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Welcome to Grand Luxe Hotel
            </p>
            <p className="text-[9.5px] text-[#6B6B6B] font-light tracking-wide">We're here to make your stay exceptional</p>
          </div>
        </div>

      </div>

      {/* ── BOTTOM NAV ──────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 bg-white/96 backdrop-blur-xl border-t border-[#c9a96e]/12 shadow-[0_-3px_18px_rgba(30,21,16,0.07)]" style={{ maxWidth: 430, width: "100%", margin: "0 auto" }}>
        <div className="flex items-center justify-around px-2 py-2.5">
          {navItems.map((item) => {
            const isActive = activeNav === item.key;
            return (
              <button
                key={item.key}
                onClick={() => { setActiveNav(item.key); navigate(item.route); }}
                className="relative flex flex-col items-center gap-1 px-7 py-2 rounded-[13px] transition-all duration-300 active:scale-95"
              >
                {isActive && <div className="absolute inset-0 bg-[#A4005D]/6 rounded-[13px]" />}
                <span className={`relative transition-all duration-300 ${isActive ? "text-[#A4005D] scale-110" : "text-[#6B6B6B]"}`}>
                  {item.icon(isActive)}
                </span>
                <span className={`relative text-[9px] font-semibold tracking-wider transition-all duration-300 ${isActive ? "text-[#A4005D]" : "text-[#6B6B6B]"}`}>
                  {item.label.toUpperCase()}
                </span>
                {isActive && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#A4005D]" />}
              </button>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

    </div>
  );
}