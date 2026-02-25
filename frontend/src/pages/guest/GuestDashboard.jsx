import { useNavigate, useLocation } from "react-router-dom";
import { useGuestAuth } from "../../context/GuestAuthContext";
import hotelbg from "../../assets/hotel-bg.jpg";
import { useEffect, useState } from "react";

// ── Bottom Nav Icon: Home ──────────────────────────────────────────────────
function HomeIcon({ active }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  );
}
function OrdersIcon({ active }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <path d="M9 12h6" /><path d="M9 16h4" />
    </svg>
  );
}
function SupportIcon({ active }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <circle cx="12" cy="17" r=".5" fill="currentColor" />
    </svg>
  );
}
function ProfileIcon({ active }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

export default function GuestDashboard() {
  const { guest } = useGuestAuth();
  const navigate = useNavigate();
  const [fadeIn, setFadeIn] = useState(false);
  const [activeNav, setActiveNav] = useState("home");

  useEffect(() => { setFadeIn(true); }, []);

  // ── Greeting based on time ────────────────────────────────────────────────
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  // ── Icons ────────────────────────────────────────────────────────────────
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

  // ── Quick Actions Grid ───────────────────────────────────────────────────
  const quickActions = [
    { icon: <FoodIcon />,       label: "Food Order",    sub: "In-room dining",    route: "/guest/menu",         bg: "bg-[#fdf0f6]", iconColor: "text-[#A4005D]" },
    { icon: <HouseIcon />,      label: "Housekeeping",  sub: "Room essentials",   route: "/guest/housekeeping", bg: "bg-[#fdf0f6]", iconColor: "text-[#A4005D]" },
    { icon: <EventsIcon />,     label: "Events",        sub: "Hotel activities",  route: "/guest/events",       bg: "bg-[#fdf0f6]", iconColor: "text-[#A4005D]" },
    { icon: <AmenitiesIcon />,  label: "Amenities",     sub: "Explore facilities",route: "/guest/hotel-info",   bg: "bg-[#fdf0f6]", iconColor: "text-[#A4005D]" },
  ];

  // ── Orders ───────────────────────────────────────────────────────────────
  const hasActiveOrder = false;
  const activeOrder = {
    items: [{ name: "Veg Sandwich", qty: 1 }, { name: "Mineral Water", qty: 1 }],
    status: "Preparing",
  };

  // ── Bottom nav ───────────────────────────────────────────────────────────
  const navItems = [
    { key: "home",    label: "Home",    icon: (a) => <HomeIcon active={a} />,    route: "/guest/dashboard" },
    { key: "orders",  label: "Orders",  icon: (a) => <OrdersIcon active={a} />,  route: "/guest/orders" },
    { key: "support", label: "Support", icon: (a) => <SupportIcon active={a} />, route: "/guest/support" },
    { key: "profile", label: "Profile", icon: (a) => <ProfileIcon active={a} />, route: "/guest/profile" },
  ];

  return (
    <div
      className={`fixed inset-0 bg-[#F6EADB] flex flex-col overflow-hidden transition-opacity duration-500 ${fadeIn ? "opacity-100" : "opacity-0"}`}
    >
      {/* ─────────────────────────────────────────────────────────────────────
          SCROLLABLE CONTENT
      ───────────────────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto" style={{ maxWidth: 430, width: "100%", margin: "0 auto", paddingBottom: 80 }}>

        {/* ── HEADER ────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 pt-12 pb-3">
          <div>
            <p className="text-[12px] text-[#6B6B6B] font-light tracking-wide">{greeting}</p>
            <h1 className="text-[20px] font-semibold text-[#1F1F1F] leading-tight mt-0.5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {guest?.name || "Valued Guest"}
            </h1>
            <div className="inline-flex items-center gap-1 bg-[#A4005D]/10 border border-[#A4005D]/15 rounded-full px-2.5 py-0.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A4005D] flex-shrink-0" />
              <span className="text-[10.5px] font-medium text-[#A4005D] tracking-wide">Room {guest?.roomNumber || "207"}</span>
            </div>
          </div>
          {/* Settings / Profile icon */}
          <button
            onClick={() => navigate("/guest/profile")}
            className="w-10 h-10 rounded-full bg-white border border-[#c9a96e]/20 shadow-[0_2px_10px_rgba(30,21,16,0.07)] flex items-center justify-center text-[#A4005D] active:scale-95 transition-transform"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </button>
        </div>

        {/* ── HERO BANNER ───────────────────────────────────────────────── */}
        <div className="mx-4 rounded-[24px] overflow-hidden relative shadow-[0_8px_28px_rgba(164,0,93,0.14)]" style={{ height: 160 }}>
          <img src={hotelbg} alt="Hotel" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#A4005D]/60 via-transparent to-black/30 rounded-[24px]" />
          {/* Overlay text */}
          <div className="absolute bottom-4 left-4">
            <p className="text-white/80 text-[11px] font-light tracking-widest uppercase mb-0.5">Welcome to</p>
            <p className="text-white text-[18px] font-semibold leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Grand Luxe Hotel
            </p>
          </div>
          <div className="absolute top-3 right-3 bg-white/15 backdrop-blur-md border border-white/25 rounded-full px-3 py-1">
            <p className="text-white text-[10px] font-medium tracking-widest uppercase">Enjoy Your Stay</p>
          </div>
        </div>

        {/* ── QUICK ACTIONS ─────────────────────────────────────────────── */}
        <div className="px-4 mt-6">
          <p className="text-[10.5px] font-semibold tracking-[0.14em] uppercase text-[#6B6B6B] mb-3">
            Quick Actions
          </p>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => navigate(action.route)}
                className={`group relative ${action.bg} rounded-[20px] p-4 flex flex-col items-start border border-[#A4005D]/8 shadow-[0_2px_12px_rgba(164,0,93,0.07)] active:scale-[0.97] transition-all duration-200 text-left overflow-hidden`}
              >
                {/* Subtle brand glow on top-right corner */}
                <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-[#A4005D]/6 blur-xl" />

                {/* Icon ring */}
                <div className={`w-11 h-11 rounded-[13px] bg-white border border-[#A4005D]/12 flex items-center justify-center ${action.iconColor} shadow-[0_2px_8px_rgba(164,0,93,0.1)] mb-3`}>
                  {action.icon}
                </div>

                <p className="text-[14.5px] font-semibold text-[#1F1F1F] leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {action.label}
                </p>
                <p className="text-[11px] text-[#6B6B6B] font-light mt-0.5 leading-tight">{action.sub}</p>

                {/* Arrow */}
                <div className="absolute bottom-3.5 right-4 text-[#A4005D]/40 text-lg group-active:translate-x-0.5 transition-transform">›</div>
              </button>
            ))}
          </div>
        </div>

        {/* ── ORDERS SECTION ────────────────────────────────────────────── */}
        <div className="px-4 mt-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10.5px] font-semibold tracking-[0.14em] uppercase text-[#6B6B6B]">
              Your Orders
            </p>
            <button
              onClick={() => navigate("/guest/orders")}
              className="text-[11px] text-[#A4005D] font-medium tracking-wide bg-transparent border-none p-0 cursor-pointer"
            >
              View All →
            </button>
          </div>

          {hasActiveOrder ? (
            <div className="bg-white rounded-[20px] border border-[#c9a96e]/18 shadow-[0_2px_16px_rgba(30,21,16,0.06)] p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[16px] font-semibold text-[#1F1F1F]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Current Order
                </span>
                <span className="bg-[#A4005D]/10 text-[#A4005D] border border-[#A4005D]/15 rounded-full px-3 py-0.5 text-[10.5px] font-semibold tracking-wide">
                  {activeOrder.status}
                </span>
              </div>
              {activeOrder.items.map((item) => (
                <div key={item.name} className="flex justify-between text-[13px] text-[#5c4a3e] font-light mb-1.5 pb-1.5 border-b border-[#c9a96e]/10 last:border-0 last:mb-0 last:pb-0">
                  <span>{item.name}</span>
                  <span className="text-[#6B6B6B]">×{item.qty}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-[20px] border border-[#c9a96e]/15 shadow-[0_2px_16px_rgba(30,21,16,0.05)] px-4 py-5 flex items-center gap-4">
              <div className="w-11 h-11 flex-shrink-0 rounded-[13px] bg-[#fdf0f6] border border-[#A4005D]/12 flex items-center justify-center text-[#A4005D]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                  <rect x="9" y="3" width="6" height="4" rx="1" /><path d="M9 12h6" /><path d="M9 16h4" />
                </svg>
              </div>
              <div>
                <p className="text-[14.5px] font-medium text-[#1F1F1F] leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  No active orders
                </p>
                <p className="text-[11.5px] text-[#6B6B6B] font-light mt-0.5">Your requests will appear here</p>
              </div>
            </div>
          )}
        </div>

        {/* ── GOLD ORNAMENT DIVIDER ─────────────────────────────────────── */}
        <div className="flex items-center gap-3 mx-5 my-6">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#c9a96e]/40 to-transparent" />
          <div className="flex items-center gap-1.5 opacity-50">
            <div className="w-1 h-1 rounded-full bg-[#c9a96e]" />
            <div className="w-[5px] h-[5px] bg-[#c9a96e] rotate-45" />
            <div className="w-1 h-1 rounded-full bg-[#c9a96e]" />
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#c9a96e]/40 to-transparent" />
        </div>

        {/* ── HOTEL INFO STRIP ──────────────────────────────────────────── */}
        <div className="px-4 pb-2">
          <p className="text-[10.5px] font-semibold tracking-[0.14em] uppercase text-[#6B6B6B] mb-3">
            Hotel Info
          </p>
          <div className="bg-gradient-to-br from-[#A4005D] to-[#C44A87] rounded-[20px] p-4 shadow-[0_6px_24px_rgba(164,0,93,0.25)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-[11px] font-light tracking-wide mb-0.5">Check-out</p>
                <p className="text-white text-[17px] font-semibold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {guest?.checkoutDate || "Tomorrow, 11:00 AM"}
                </p>
              </div>
              <div className="w-px h-10 bg-white/20 mx-4" />
              <div>
                <p className="text-white/70 text-[11px] font-light tracking-wide mb-0.5">Floor</p>
                <p className="text-white text-[17px] font-semibold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {guest?.floor || "3rd Floor"}
                </p>
              </div>
              <div className="w-px h-10 bg-white/20 mx-4" />
              <div>
                <p className="text-white/70 text-[11px] font-light tracking-wide mb-0.5">WiFi</p>
                <p className="text-white text-[17px] font-semibold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Free
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ─────────────────────────────────────────────────────────────────────
          FIXED BOTTOM NAVIGATION
      ───────────────────────────────────────────────────────────────────── */}
      <div
        className="flex-shrink-0 bg-white/90 backdrop-blur-xl border-t border-[#c9a96e]/15 shadow-[0_-4px_24px_rgba(30,21,16,0.08)]"
        style={{ maxWidth: 430, width: "100%", margin: "0 auto" }}
      >
        <div className="flex items-center justify-around px-2 py-2 pb-safe">
          {navItems.map((item) => {
            const isActive = activeNav === item.key;
            return (
              <button
                key={item.key}
                onClick={() => { setActiveNav(item.key); navigate(item.route); }}
                className="flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-[14px] transition-all duration-200 active:scale-95 relative"
              >
                {/* Active pill background */}
                {isActive && (
                  <div className="absolute inset-0 bg-[#A4005D]/8 rounded-[14px]" />
                )}
                <span className={`relative transition-colors duration-200 ${isActive ? "text-[#A4005D]" : "text-[#6B6B6B]"}`}>
                  {item.icon(isActive)}
                </span>
                <span className={`relative text-[10px] font-medium tracking-wide transition-colors duration-200 ${isActive ? "text-[#A4005D]" : "text-[#6B6B6B]"}`}>
                  {item.label}
                </span>
                {/* Active dot indicator */}
                {isActive && (
                  <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#A4005D]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}