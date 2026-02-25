import { useNavigate } from "react-router-dom";
import { useGuestAuth } from "../../context/GuestAuthContext";
import hotelbg from "../../assets/hotel-bg.jpg";
import GuestHeader from "../../components/guest/GuestHeader";
import { useEffect, useState } from "react";

export default function GuestDashboard() {
  const { guest } = useGuestAuth();
  const navigate = useNavigate();
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  // ── Icons ──────────────────────────────────────────────────────────────────
  const icons = {
    food: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M6 18h12" />
        <path d="M7 18v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1" />
        <path d="M8 12h8" />
        <path d="M5 12a7 7 0 0 1 14 0" />
        <path d="M12 9v-1" />
      </svg>
    ),
    housekeeping: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M6 3l12 12" />
        <path d="M10 7l-2 2" />
        <path d="M14 11l-2 2" />
        <path d="M4 20h7" />
        <path d="M4 20c1.2-3.4 3.6-5.8 7-7" />
        <path d="M11 13c1.2 0 2.7 1.1 3.6 2.1" />
      </svg>
    ),
    events: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M8 3v3" /><path d="M16 3v3" /><path d="M4 7h16" />
        <path d="M6 6h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
        <path d="M8 11h4" />
      </svg>
    ),
    amenities: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <circle cx="12" cy="12" r="10" /><path d="M8 12h8" /><path d="M12 8v8" />
      </svg>
    ),
    orders: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
        <path d="M9 12h6" /><path d="M9 16h4" />
      </svg>
    ),
  };

  // ── Data (same as original) ────────────────────────────────────────────────
  const services = [
    {
      icon: icons.food,
      title: "Food Order",
      subtitle: "Order from curated in-room menu",
      onClick: () => navigate("/guest/menu"),
      accent: "from-[#A4005D] to-[#C44A87]",
    },
    {
      icon: icons.housekeeping,
      title: "Housekeeping",
      subtitle: "Request essentials anytime",
      onClick: () => navigate("/guest/housekeeping"),
      accent: "from-[#A4005D] to-[#C44A87]",
    },
  ];

  const explore = [
    { icon: icons.events,    title: "Events",    onClick: () => navigate("/guest/events") },
    { icon: icons.amenities, title: "Amenities", onClick: () => navigate("/guest/hotel-info") },
  ];

  const hasActiveOrder = false;
  const activeOrder = {
    items: [{ name: "Veg Sandwich", qty: 1 }, { name: "Mineral Water", qty: 1 }],
    status: "Preparing",
  };

  return (
    <div
      className={`min-h-screen bg-[#F6EADB] flex flex-col transition-opacity duration-700 ${fadeIn ? "opacity-100" : "opacity-0"}`}
      style={{ maxWidth: 430, margin: "0 auto", paddingBottom: 32 }}
    >
      {/* ── Header ── */}
      <GuestHeader />

      {/* ── Hero ── */}
      <div className="relative w-full overflow-hidden rounded-b-[32px] shadow-[0_8px_32px_rgba(164,0,93,0.15)]" style={{ height: 200 }}>
        <img src={hotelbg} alt="Hotel" className="w-full h-full object-cover" />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/10 to-[#F6EADB] rounded-b-[32px]" />
        {/* Room pill */}
        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-4 py-1.5 text-white text-[11px] font-medium tracking-widest uppercase">
          Room {guest?.roomNumber || "207"}
        </div>
      </div>

      {/* ── Welcome ── */}
      <div className="flex flex-col items-center text-center px-5 pt-4 pb-1 animate-[rise_0.55s_ease_both]">
        <h2 className="text-[38px] font-light text-[#1F1F1F] leading-tight tracking-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Welcome
        </h2>
        <div className="inline-flex items-center gap-1.5 bg-[#A4005D] text-white rounded-full px-4 py-1.5 text-[11.5px] font-medium tracking-[0.07em] mt-1 mb-2 shadow-[0_4px_14px_rgba(164,0,93,0.3)]">
          ✦ &nbsp;Room {guest?.roomNumber || "207"}
        </div>
        <p className="text-[13px] text-[#6B6B6B] font-light tracking-wide">Enjoy your stay with us</p>
      </div>

      {/* ── Gold divider ── */}
      <div className="flex items-center gap-3 mx-5 my-5">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#c9a96e]/50 to-transparent" />
        <span className="text-[11px] font-medium tracking-[0.14em] uppercase text-[#c9a96e]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Our Services
        </span>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#c9a96e]/50 to-transparent" />
      </div>

      {/* ── Service Cards ── */}
      <div className="px-4 flex flex-col gap-3">
        {services.map((svc, i) => (
          <button
            key={svc.title}
            onClick={svc.onClick}
            className="group relative flex items-center gap-4 w-full bg-white rounded-[20px] px-4 py-4 border border-[#c9a96e]/18 shadow-[0_2px_16px_rgba(30,21,16,0.06)] active:scale-[0.98] transition-all duration-200 text-left overflow-hidden"
          >
            {/* Top accent line on hover */}
            <div className={`absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r ${svc.accent} scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-t-[20px]`} />

            {/* Icon */}
            <div className="w-13 h-13 w-[52px] h-[52px] flex-shrink-0 rounded-[15px] bg-[#F6EADB] border border-[#c9a96e]/20 flex items-center justify-center text-[#A4005D]">
              {svc.icon}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-[18px] font-semibold text-[#1F1F1F] leading-tight mb-0.5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {svc.title}
              </p>
              <p className="text-[12px] text-[#6B6B6B] font-light leading-snug">{svc.subtitle}</p>
            </div>

            {/* Arrow */}
            <span className="text-[#c9a96e] text-[22px] opacity-70 flex-shrink-0">›</span>
          </button>
        ))}
      </div>

      {/* ── Your Orders ── */}
      <div className="px-4 mt-5">
        <p className="text-[10.5px] font-semibold tracking-[0.14em] uppercase text-[#6B6B6B] mb-3 pl-0.5">
          Your Orders
        </p>

        {hasActiveOrder ? (
          // Active order
          <div className="bg-white rounded-[20px] border border-[#c9a96e]/18 shadow-[0_2px_16px_rgba(30,21,16,0.06)] p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[18px] font-semibold text-[#1F1F1F]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Current Order
              </span>
              <span className="bg-[#F6EADB] text-[#A4005D] border border-[#c9a96e]/25 rounded-full px-3 py-0.5 text-[11px] font-semibold tracking-wide">
                {activeOrder.status}
              </span>
            </div>
            {activeOrder.items.map((item) => (
              <div key={item.name} className="flex justify-between text-[13px] text-[#5c4a3e] font-light mb-1.5">
                <span>{item.name}</span>
                <span className="text-[#6B6B6B]">×{item.qty}</span>
              </div>
            ))}
          </div>
        ) : (
          // Empty orders
          <div className="bg-white rounded-[20px] border border-[#c9a96e]/18 shadow-[0_2px_16px_rgba(30,21,16,0.06)] p-5 flex items-center gap-4">
            <div className="w-11 h-11 flex-shrink-0 rounded-full bg-[#F6EADB] border border-[#c9a96e]/20 flex items-center justify-center text-[#A4005D]">
              {icons.orders}
            </div>
            <div className="flex-1">
              <p className="text-[15px] font-medium text-[#1F1F1F] leading-tight mb-0.5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                No current orders
              </p>
              <button
                onClick={() => navigate("/guest/orders")}
                className="text-[12px] text-[#6B6B6B] underline underline-offset-2 hover:text-[#A4005D] transition-colors bg-transparent border-none p-0 cursor-pointer"
              >
                View Order History →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Ornament ── */}
      <div className="flex items-center justify-center gap-2 mt-6 opacity-30">
        <div className="w-9 h-px bg-[#c9a96e]" />
        <div className="w-[5px] h-[5px] bg-[#c9a96e] rotate-45" />
        <div className="w-9 h-px bg-[#c9a96e]" />
      </div>

      {/* ── Explore ── */}
      <div className="px-4 mt-5">
        <p className="text-[10.5px] font-semibold tracking-[0.14em] uppercase text-[#6B6B6B] mb-3 pl-0.5">
          Explore
        </p>
        <div className="flex flex-col gap-2.5">
          {explore.map((item) => (
            <button
              key={item.title}
              onClick={item.onClick}
              className="group flex items-center gap-3.5 w-full bg-white rounded-[16px] px-4 py-3.5 border border-[#c9a96e]/18 shadow-[0_2px_12px_rgba(30,21,16,0.05)] active:scale-[0.98] hover:translate-x-1 hover:border-[#e8d5b0] hover:shadow-[0_4px_14px_rgba(201,169,110,0.13)] transition-all duration-200 text-left"
            >
              <div className="w-[42px] h-[42px] flex-shrink-0 rounded-[12px] bg-[#F6EADB] border border-[#c9a96e]/20 flex items-center justify-center text-[#A4005D]">
                {item.icon}
              </div>
              <span className="flex-1 text-[16.5px] font-semibold text-[#1F1F1F]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {item.title}
              </span>
              <span className="text-[#c9a96e] text-[20px] opacity-65">›</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Bottom ornament ── */}
      <div className="flex items-center justify-center gap-2 mt-8 opacity-20">
        <div className="w-16 h-px bg-[#c9a96e]" />
        <div className="w-[5px] h-[5px] bg-[#c9a96e] rotate-45" />
        <div className="w-[5px] h-[5px] bg-[#A4005D] rotate-45" />
        <div className="w-[5px] h-[5px] bg-[#c9a96e] rotate-45" />
        <div className="w-16 h-px bg-[#c9a96e]" />
      </div>
    </div>
  );
}