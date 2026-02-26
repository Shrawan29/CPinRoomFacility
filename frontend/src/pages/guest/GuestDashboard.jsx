import { useNavigate } from "react-router-dom";
import { useGuestAuth } from "../../context/GuestAuthContext";
import hotelbg from "../../assets/hotel-bg.jpg";
import logo from "../../assets/logo.png";
import { useEffect, useState } from "react";

export default function GuestDashboard_Option1() {
  const { guest } = useGuestAuth();
  const navigate = useNavigate();
  const [fadeIn, setFadeIn] = useState(false);
  const [activeNav, setActiveNav] = useState("home");

  useEffect(() => { setFadeIn(true); }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  // ── Icons ─────────────────────────────────────────────────────────────────
  const FoodIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      <path d="M6 18h12" /><path d="M7 18v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1" />
      <path d="M8 12h8" /><path d="M5 12a7 7 0 0 1 14 0" /><path d="M12 9v-1" />
    </svg>
  );
  const HouseIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      <path d="M6 3l12 12" /><path d="M10 7l-2 2" /><path d="M14 11l-2 2" />
      <path d="M4 20h7" /><path d="M4 20c1.2-3.4 3.6-5.8 7-7" />
      <path d="M11 13c1.2 0 2.7 1.1 3.6 2.1" />
    </svg>
  );
  const EventsIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      <path d="M8 3v3" /><path d="M16 3v3" /><path d="M4 7h16" />
      <path d="M6 6h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
      <path d="M8 11h4" />
    </svg>
  );
  const AmenitiesIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
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
    { icon: <FoodIcon />,      label: "Food Order",   sub: "In-room dining",     route: "/guest/menu" },
    { icon: <HouseIcon />,     label: "Housekeeping", sub: "Room essentials",    route: "/guest/housekeeping" },
    { icon: <EventsIcon />,    label: "Events",       sub: "Hotel activities",   route: "/guest/events" },
    { icon: <AmenitiesIcon />, label: "Amenities",    sub: "Explore facilities", route: "/guest/hotel-info" },
  ];

  const hasActiveOrder = false;
  const activeOrder = {
    items: [{ name: "Veg Sandwich", qty: 1 }, { name: "Mineral Water", qty: 1 }],
    status: "Preparing",
  };

  const navItems = [
    { key: "home",    label: "Home",    icon: (a) => <HomeNavIcon active={a} />,    route: "/guest/dashboard" },
    { key: "orders",  label: "Orders",  icon: (a) => <OrdersNavIcon active={a} />,  route: "/guest/orders" },
    { key: "support", label: "Support", icon: (a) => <SupportNavIcon active={a} />, route: "/guest/support" },
  ];

  return (
    <div className={`fixed inset-0 bg-[#F6EADB] flex flex-col overflow-hidden transition-opacity duration-700 ${fadeIn ? "opacity-100" : "opacity-0"}`}>

      <div className="flex-1 overflow-y-auto" style={{ maxWidth: 430, width: "100%", margin: "0 auto", paddingBottom: 70 }}>

        {/* ── HEADER ──────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between px-5 pt-7 pb-3">
          <div className="flex-1">
            <p className="text-[11px] text-[#6B6B6B] font-light tracking-[0.08em] uppercase mb-0.5">{greeting}</p>
            <h1 className="text-[27px] font-bold text-[#1F1F1F] leading-none" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {guest?.name || "Valued Guest"}
            </h1>
            <div className="inline-flex items-center gap-1.5 bg-[#A4005D]/8 border border-[#A4005D]/12 rounded-full px-2.5 py-1 mt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A4005D] animate-pulse" />
              <span className="text-[10px] font-semibold text-[#A4005D] tracking-wider">ROOM {guest?.roomNumber}</span>
            </div>
          </div>
          <img src={logo} alt="Hotel Logo" className="w-12 h-12 object-contain mix-blend-multiply flex-shrink-0 mt-1" />
        </div>

        {/* ── HERO BANNER ─────────────────────────────────────────────── */}
        <div className="mx-5 rounded-[20px] overflow-hidden relative shadow-[0_6px_24px_rgba(164,0,93,0.14)] mt-3.5 transition-transform duration-300 active:scale-[0.99]" style={{ height: 135 }}>
          <img src={hotelbg} alt="Hotel" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#A4005D]/65 via-[#A4005D]/30 to-black/35" />
          <div className="absolute bottom-4 left-5">
            <p className="text-white/85 text-[9px] font-light tracking-[0.18em] uppercase mb-1">Welcome to</p>
            <p className="text-white text-[21px] font-bold leading-tight tracking-wide drop-shadow-lg" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Grand Luxe Hotel
            </p>
          </div>
          <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/35 rounded-full px-3.5 py-1.5 shadow-lg">
            <p className="text-white text-[9px] font-semibold tracking-[0.14em] uppercase">Enjoy Your Stay</p>
          </div>
        </div>

        {/* ── QUICK ACTIONS GRID ──────────────────────────────────────── */}
        <div className="px-5 mt-6">
          <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#6B6B6B] mb-3.5">Quick Actions</p>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, idx) => (
              <button
                key={action.label}
                onClick={() => navigate(action.route)}
                className="bg-white rounded-[20px] p-5 flex flex-col items-start border border-[#A4005D]/6 shadow-[0_3px_18px_rgba(164,0,93,0.07)] active:scale-[0.96] hover:shadow-[0_6px_24px_rgba(164,0,93,0.12)] transition-all duration-300 text-left"
                style={{ 
                  minHeight: 125,
                  animationDelay: `${idx * 50}ms`,
                  animation: fadeIn ? 'slideUp 0.4s ease-out forwards' : 'none'
                }}
              >
                <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-[#F6EADB] to-[#f0ddc5] border border-[#A4005D]/10 flex items-center justify-center text-[#A4005D] mb-4 shadow-sm">
                  {action.icon}
                </div>
                <p className="text-[16.5px] font-bold text-[#1F1F1F] leading-tight mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {action.label}
                </p>
                <p className="text-[10.5px] text-[#6B6B6B] font-light leading-snug">{action.sub}</p>
              </button>
            ))}
          </div>
        </div>

        {/* ── YOUR ORDERS ─────────────────────────────────────────────── */}
        <div className="px-5 mt-6">
          <div className="flex items-center justify-between mb-3.5">
            <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#6B6B6B]">Your Orders</p>
            <button onClick={() => navigate("/guest/orders")} className="text-[10.5px] text-[#A4005D] font-semibold tracking-wide transition-opacity hover:opacity-70">
              View All →
            </button>
          </div>

          {hasActiveOrder ? (
            <div className="bg-white rounded-[20px] border border-[#c9a96e]/12 shadow-[0_3px_18px_rgba(30,21,16,0.06)] p-5">
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
            <div className="bg-white rounded-[20px] border border-[#c9a96e]/10 shadow-[0_3px_16px_rgba(30,21,16,0.05)] px-5 py-5 flex items-center gap-4 transition-all duration-300 hover:shadow-[0_4px_20px_rgba(30,21,16,0.08)]">
              <div className="w-12 h-12 flex-shrink-0 rounded-[14px] bg-gradient-to-br from-[#F6EADB] to-[#f0ddc5] border border-[#A4005D]/10 flex items-center justify-center text-[#A4005D] shadow-sm">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                  <rect x="9" y="3" width="6" height="4" rx="1" />
                  <path d="M9 12h6" /><path d="M9 16h4" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-[15.5px] font-bold text-[#1F1F1F] leading-tight mb-0.5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  No active orders
                </p>
                <p className="text-[11px] text-[#6B6B6B] font-light leading-relaxed">Your requests will appear here</p>
              </div>
            </div>
          )}
        </div>

        {/* ── ELEGANT DIVIDER ────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 mx-5 my-6">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#c9a96e]/35 to-transparent" />
          <div className="w-1 h-1 bg-[#c9a96e]/50 rounded-full" />
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#c9a96e]/35 to-transparent" />
        </div>

        {/* ── EXPLORE ─────────────────────────────────────────────────── */}
        <div className="px-5 pb-3">
          <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#6B6B6B] mb-3.5">Explore</p>
          <div className="flex flex-col gap-2.5">
            {[
              { icon: <EventsIcon />, label: "Events", route: "/guest/events" },
              { icon: <AmenitiesIcon />, label: "Amenities", route: "/guest/hotel-info" },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.route)}
                className="flex items-center gap-4 w-full bg-white rounded-[18px] px-4 py-3.5 border border-[#c9a96e]/10 shadow-[0_2px_14px_rgba(30,21,16,0.05)] active:scale-[0.98] hover:shadow-[0_4px_20px_rgba(30,21,16,0.08)] transition-all duration-300 text-left"
              >
                <div className="w-11 h-11 flex-shrink-0 rounded-[13px] bg-gradient-to-br from-[#F6EADB] to-[#f0ddc5] border border-[#A4005D]/8 flex items-center justify-center text-[#A4005D] shadow-sm">
                  {item.icon}
                </div>
                <span className="flex-1 text-[16.5px] font-bold text-[#1F1F1F]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {item.label}
                </span>
                <span className="text-[#c9a96e] text-[18px] opacity-50">›</span>
              </button>
            ))}
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
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

    </div>
  );
}