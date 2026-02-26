import { useNavigate } from "react-router-dom";
import { useGuestAuth } from "../../context/GuestAuthContext";
import hotelbg from "../../assets/hotel-bg.jpg";
import logo from "../../assets/logo.png";
import { useEffect, useState } from "react";

export default function GuestDashboard_Option3C() {
  const { guest } = useGuestAuth();
  const navigate = useNavigate();
  const [fadeIn, setFadeIn] = useState(false);
  const [activeNav, setActiveNav] = useState("home");
  const [hoveredAction, setHoveredAction] = useState(null);
  const [offerIndex, setOfferIndex] = useState(0);

  useEffect(() => { 
    setFadeIn(true);
    const offerTimer = setInterval(() => {
      setOfferIndex(prev => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(offerTimer);
  }, []);

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
    { icon: <FoodIcon />, label: "Food", route: "/guest/menu", tooltip: "Order delicious meals", bgGradient: "from-rose-500 to-pink-500" },
    { icon: <HouseIcon />, label: "Service", route: "/guest/housekeeping", tooltip: "Request housekeeping", bgGradient: "from-teal-500 to-cyan-500" },
    { icon: <EventsIcon />, label: "Events", route: "/guest/events", tooltip: "Explore activities", bgGradient: "from-purple-500 to-indigo-500" },
    { icon: <AmenitiesIcon />, label: "Amenities", route: "/guest/hotel-info", tooltip: "Discover facilities", bgGradient: "from-amber-500 to-orange-500" },
  ];

  const recentOrders = [
    { name: "Caesar Salad", time: "Yesterday, 7:30 PM" },
    { name: "Club Sandwich", time: "2 days ago" },
  ];

  const offers = [
    { title: "20% Off Spa Services", subtitle: "Book today and relax", color: "from-purple-500 to-pink-500" },
    { title: "Complimentary Breakfast", subtitle: "Tomorrow 7-10 AM", color: "from-amber-500 to-orange-500" },
    { title: "Late Checkout Available", subtitle: "Extend your stay stress-free", color: "from-teal-500 to-cyan-500" },
  ];

  const hasActiveOrder = false;
  const navItems = [
    { key: "home", label: "Home", icon: (a) => <HomeNavIcon active={a} />, route: "/guest/dashboard" },
    { key: "orders", label: "Orders", icon: (a) => <OrdersNavIcon active={a} />, route: "/guest/orders" },
    { key: "support", label: "Support", icon: (a) => <SupportNavIcon active={a} />, route: "/guest/support" },
  ];

  const exploreItems = [
    { icon: <EventsIcon />, label: "Hotel Events", sub: "Live music tonight at 8 PM", route: "/guest/events" },
    { icon: <AmenitiesIcon />, label: "Facilities", sub: "Pool, gym, spa - all open", route: "/guest/hotel-info" },
  ];

  return (
    <div className={`fixed inset-0 bg-[#F6EADB] flex flex-col overflow-hidden transition-opacity duration-700 ${fadeIn ? "opacity-100" : "opacity-0"}`}>

      <div className="flex-1 overflow-y-auto" style={{ maxWidth: 430, width: "100%", margin: "0 auto", paddingBottom: 70 }}>

        {/* ── DUAL-LAYER FLOATING BANNER ──────────────────────────────── */}
        <div className="relative mb-5" style={{ height: 190 }}>
          <img src={hotelbg} alt="Hotel" className="w-full h-full object-cover" />
          
          {/* Layered gradients */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-transparent to-black/75" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#A4005D]/50 via-transparent to-purple-900/40" />
          
          {/* Floating elements */}
          <div className="absolute top-4 right-4">
            <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl px-4 py-2.5 shadow-2xl animate-float">
              <p className="text-white text-[9px] font-semibold tracking-[0.14em] uppercase">Elite Member</p>
            </div>
          </div>

          {/* Header Content */}
          <div className="absolute top-7 left-5 right-5 flex items-start justify-between">
            <div className="flex-1">
              <p className="text-white/95 text-[10px] font-light tracking-[0.16em] uppercase mb-1">{greeting}</p>
              <h1 className="text-white text-[31px] font-bold leading-none drop-shadow-2xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {guest?.name || "Valued Guest"}
              </h1>
              <div className="inline-flex items-center gap-1.5 bg-white/25 backdrop-blur-xl border border-white/40 rounded-full px-3 py-1.5 mt-2.5 shadow-2xl">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-white text-[9px] font-bold tracking-[0.12em]">ROOM {guest?.roomNumber}</span>
              </div>
            </div>
            <div className="bg-white/15 backdrop-blur-xl rounded-2xl p-2 border border-white/25 shadow-2xl">
              <img src={logo} alt="Logo" className="w-9 h-9 object-contain opacity-95" />
            </div>
          </div>

          {/* Bottom floating card */}
          <div className="absolute bottom-5 left-5 right-5">
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-white/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[18px] font-bold text-[#1F1F1F]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    Grand Luxe Hotel
                  </p>
                  <p className="text-[9px] text-[#6B6B6B] font-light tracking-wider uppercase mt-0.5">Where Luxury Meets Comfort</p>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── ANIMATED ICON GRID WITH TOOLTIPS ────────────────────────── */}
        <div className="px-4 mb-4">
          <div className="grid grid-cols-4 gap-2.5">
            {quickActions.map((action, idx) => (
              <button
                key={action.label}
                onClick={() => navigate(action.route)}
                onMouseEnter={() => setHoveredAction(idx)}
                onMouseLeave={() => setHoveredAction(null)}
                className="relative bg-white rounded-[18px] p-3 flex flex-col items-center justify-center border border-gray-100 shadow-[0_3px_16px_rgba(0,0,0,0.06)] active:scale-95 hover:shadow-[0_6px_28px_rgba(0,0,0,0.12)] transition-all duration-300"
                style={{
                  minHeight: 95,
                  animationDelay: `${idx * 60}ms`,
                  animation: fadeIn ? 'bounceIn 0.6s ease-out forwards' : 'none'
                }}
              >
                {/* Tooltip */}
                {hoveredAction === idx && (
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-3 py-1.5 rounded-lg text-[9px] font-medium whitespace-nowrap shadow-xl z-10 animate-fade-in">
                    {action.tooltip}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                  </div>
                )}
                
                <div className={`w-12 h-12 rounded-[15px] bg-gradient-to-br ${action.bgGradient} flex items-center justify-center text-white mb-2.5 shadow-lg transition-all duration-300 ${hoveredAction === idx ? 'scale-125 rotate-6' : 'scale-100'}`}>
                  {action.icon}
                </div>
                <p className="text-[11.5px] font-bold text-[#1F1F1F] leading-tight text-center" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {action.label}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* ── MEGA CARD WITH QUICK REORDER ────────────────────────────── */}
        <div className="px-4 mb-4">
          <div className="bg-white rounded-[22px] border border-[#c9a96e]/10 shadow-[0_6px_28px_rgba(30,21,16,0.08)] overflow-hidden">
            
            {/* Orders Section with Reorder */}
            <div className="p-5 border-b border-[#c9a96e]/8">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#6B6B6B]">Your Orders</p>
                <button onClick={() => navigate("/guest/orders")} className="text-[10.5px] text-[#A4005D] font-semibold tracking-wide transition-opacity hover:opacity-70">
                  View All →
                </button>
              </div>

              {hasActiveOrder ? (
                <div>Order details</div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3.5 p-3.5 bg-gradient-to-r from-[#F6EADB] to-[#f0ddc5]/50 rounded-[16px] border border-[#A4005D]/8">
                    <div className="w-10 h-10 flex-shrink-0 rounded-[12px] bg-white border border-[#A4005D]/10 flex items-center justify-center text-[#A4005D] shadow-sm">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                        <rect x="9" y="3" width="6" height="4" rx="1" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-[14px] font-bold text-[#1F1F1F] leading-tight mb-0.5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        No active orders
                      </p>
                      <p className="text-[9.5px] text-[#6B6B6B] font-light">Order your favorite meals</p>
                    </div>
                  </div>

                  {/* Quick Reorder Section */}
                  <div>
                    <p className="text-[9px] font-semibold tracking-wider uppercase text-[#6B6B6B] mb-2">Quick Reorder</p>
                    {recentOrders.map((order, idx) => (
                      <button
                        key={idx}
                        onClick={() => navigate("/guest/menu")}
                        className="w-full flex items-center justify-between p-3 mb-2 last:mb-0 bg-gray-50 hover:bg-gray-100 rounded-[14px] border border-gray-200 transition-all active:scale-98"
                      >
                        <div className="text-left">
                          <p className="text-[12px] font-semibold text-[#1F1F1F]">{order.name}</p>
                          <p className="text-[8.5px] text-[#6B6B6B] font-light">{order.time}</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-[#A4005D] flex items-center justify-center text-white shadow-md">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                            <path d="M12 5v14M5 12h14" />
                          </svg>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Explore Section */}
            <div className="p-5">
              <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#6B6B6B] mb-3.5">Discover</p>
              <div className="flex flex-col gap-2.5">
                {exploreItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => navigate(item.route)}
                    className="flex items-center gap-3.5 w-full px-4 py-3.5 rounded-[16px] bg-gradient-to-r from-[#F6EADB] to-[#f0ddc5]/30 border border-[#A4005D]/8 hover:shadow-md active:scale-98 transition-all duration-200 text-left group"
                  >
                    <div className="w-10 h-10 flex-shrink-0 rounded-[13px] bg-white border border-[#A4005D]/10 flex items-center justify-center text-[#A4005D] shadow-sm group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-[15px] font-bold text-[#1F1F1F] leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        {item.label}
                      </p>
                      <p className="text-[9.5px] text-[#6B6B6B] font-light mt-0.5">{item.sub}</p>
                    </div>
                    <span className="text-[#c9a96e] text-[18px] opacity-50 group-hover:opacity-80 group-hover:translate-x-1 transition-all">›</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── SPECIAL OFFERS CAROUSEL ─────────────────────────────────── */}
        <div className="px-4 pb-3">
          <div className="relative overflow-hidden rounded-[20px] shadow-[0_6px_24px_rgba(0,0,0,0.1)]" style={{ height: 110 }}>
            {offers.map((offer, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-all duration-700 ${idx === offerIndex ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}`}
                style={{ background: `linear-gradient(135deg, var(--tw-gradient-stops))` }}
              >
                <div className={`w-full h-full bg-gradient-to-br ${offer.color} p-5 flex flex-col justify-between`}>
                  <div>
                    <span className="inline-block px-2.5 py-1 bg-white/25 backdrop-blur-sm border border-white/40 rounded-full text-white text-[8px] font-bold tracking-wider uppercase mb-2">
                      Special Offer
                    </span>
                    <p className="text-white text-[19px] font-bold leading-tight drop-shadow-lg" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      {offer.title}
                    </p>
                    <p className="text-white/90 text-[10px] font-light mt-1">{offer.subtitle}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {offers.map((_, dotIdx) => (
                      <div key={dotIdx} className={`h-1.5 rounded-full transition-all ${dotIdx === offerIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/50'}`} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
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
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.3); }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
      `}</style>

    </div>
  );
}
