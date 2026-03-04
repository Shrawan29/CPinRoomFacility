import { memo } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const HomeIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z" />
    <path d="M9 21V12h6v9" />
  </svg>
);
const OrdersIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="1" />
    <path d="M9 12h6" /><path d="M9 16h4" />
  </svg>
);
const EventsIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
    <path d="M8 3v3" /><path d="M16 3v3" /><path d="M4 7h16" />
    <path d="M6 6h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
    <path d="M8 11h4" />
  </svg>
);
const HotelIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
    <path d="M3 21h18" />
    <path d="M6 21V7a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v14" />
    <path d="M10 7h4" /><path d="M10 11h4" /><path d="M10 15h4" />
  </svg>
);
const AiIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.95)" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    <circle cx="9.5" cy="11.5" r="0.65" fill="rgba(255,255,255,0.95)" stroke="none" />
    <circle cx="14.5" cy="11.5" r="0.65" fill="rgba(255,255,255,0.95)" stroke="none" />
  </svg>
);

const routeToKey = {
  "/guest/dashboard":    "home",
  "/guest/orders":       "orders",
  "/guest/support":      "ai",
  "/guest/events":       "events",
  "/guest/hotel-info":   "hotel",
  "/guest/menu":         "orders",
  "/guest/housekeeping": "home",
  "/guest/cart":         "orders",
};

const navItems = [
  { key: "home",   label: "Home",       route: "/guest/dashboard",  Icon: HomeIcon },
  { key: "orders", label: "Orders",     route: "/guest/orders",     Icon: OrdersIcon },
  { key: "events", label: "Events",     route: "/guest/events",     Icon: EventsIcon },
  { key: "hotel",  label: "Hotel Info", route: "/guest/hotel-info", Icon: HotelIcon },
];

const PILL_H = 64;
const SIDE_M = 14;
const ORB    = 46;

function GuestBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  let activeKey = routeToKey[location.pathname] || "";
  if (!activeKey) {
    if (location.pathname.startsWith("/guest/events"))      activeKey = "events";
    else if (location.pathname.startsWith("/guest/orders")) activeKey = "orders";
    else                                                     activeKey = "home";
  }
  const isAiActive = activeKey === "ai";

  // Render a single tab button — Icon stored in variable to avoid JSX bracket notation error
  const Tab = ({ item, delay }) => {
    const on = activeKey === item.key;
    const IconComponent = item.Icon;
    return (
      <button
        className="gbn-tab-btn gbn-tab"
        style={{ animationDelay: `${delay}s` }}
        onClick={() => navigate(item.route)}
      >
        <span style={{ color: on ? "#A4005D" : "#b5a898", transition: "color 0.22s",
          transform: on ? "scale(1.08)" : "scale(1)", display: "flex", transition: "color 0.22s, transform 0.22s" }}>
          <IconComponent active={on} />
        </span>
        <span style={{
          fontSize: 9, lineHeight: 1,
          fontWeight: on ? 600 : 500,
          color: on ? "#A4005D" : "#b5a898",
          fontFamily: "'DM Sans', system-ui, sans-serif",
          letterSpacing: "0.01em",
          transition: "color 0.22s",
        }}>{item.label}</span>
      </button>
    );
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes gbnUp  { from{opacity:0;transform:translateY(60px)} to{opacity:1;transform:translateY(0)} }
        @keyframes gbnTab { from{opacity:0;transform:translateY(8px)}  to{opacity:1;transform:translateY(0)} }
        @keyframes orbPop { 0%{opacity:0;transform:scale(0.5)} 65%{transform:scale(1.08)} 100%{opacity:1;transform:scale(1)} }
        @keyframes rippleOut { 0%{transform:scale(1);opacity:0.4} 100%{transform:scale(2);opacity:0} }
        @keyframes orbBreathe {
          0%,100%{box-shadow:0 4px 18px rgba(164,0,93,0.38),0 2px 6px rgba(0,0,0,0.12)}
          50%    {box-shadow:0 6px 26px rgba(164,0,93,0.62),0 2px 6px rgba(0,0,0,0.12)}
        }
        .gbn-root { animation: gbnUp 0.44s cubic-bezier(0.22,1,0.36,1) both; }
        .gbn-tab  { animation: gbnTab 0.34s ease both; }
        .gbn-orb  { animation: orbPop 0.42s cubic-bezier(0.22,1,0.36,1) 0.1s both; }
        .orb-core { animation: orbBreathe 2.8s ease-in-out 0.6s infinite; transition: transform 0.18s cubic-bezier(0.22,1,0.36,1) !important; }
        .gbn-orb:active .orb-core { transform: scale(0.88) !important; }
        .rpl  { animation: rippleOut 2.8s ease-out 0.6s infinite; }
        .rpl2 { animation: rippleOut 2.8s ease-out 2.0s infinite; }
        .gbn-tab-btn {
          flex: 1; height: 100%;
          display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px;
          background: transparent; border: none; cursor: pointer; padding: 0;
          -webkit-tap-highlight-color: transparent;
          transition: transform 0.14s ease;
        }
        .gbn-tab-btn:active { transform: scale(0.84); }
      `}</style>

      <div className="gbn-root" style={{
        position: "fixed",
        bottom: 0, left: 0, right: 0,
        zIndex: 9999,
        maxWidth: 430,
        margin: "0 auto",
        paddingBottom: "max(12px, env(safe-area-inset-bottom, 12px))",
        overflow: "visible",
      }}>

        {/* PILL */}
        <div style={{
          margin: `0 ${SIDE_M}px`,
          height: PILL_H,
          borderRadius: PILL_H / 2,
          background: "linear-gradient(to bottom, rgba(255,251,245,0.97), rgba(244,235,222,0.88))",
          backdropFilter: "blur(38px) saturate(1.8)",
          WebkitBackdropFilter: "blur(38px) saturate(1.8)",
          border: "1.2px solid rgba(255,255,255,0.68)",
          boxShadow: "0 8px 32px rgba(26,20,16,0.13), 0 2px 8px rgba(26,20,16,0.07), inset 0 1px 0 rgba(255,255,255,0.72)",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
        }}>

          {/* Inner top gloss */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: "38%",
            background: "linear-gradient(to bottom, rgba(255,255,255,0.70), rgba(255,255,255,0))",
            pointerEvents: "none", zIndex: 3,
          }} />

          {/* Home, Orders */}
          <Tab item={navItems[0]} delay={0.08} />
          <Tab item={navItems[1]} delay={0.13} />

          {/* CENTER ORB */}
          <div style={{
            flex: 1, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 3,
          }}>
            <button
              className="gbn-orb"
              onClick={() => navigate("/guest/support")}
              style={{
                width: ORB, height: ORB,
                background: "none", border: "none",
                cursor: "pointer", padding: 0,
                position: "relative",
                display: "flex", alignItems: "center", justifyContent: "center",
                WebkitTapHighlightColor: "transparent",
                zIndex: 4,
              }}
            >
              <div className="rpl"  style={{ position:"absolute", inset:0, borderRadius:"50%", border:"1.5px solid rgba(196,74,135,0.45)", pointerEvents:"none" }} />
              <div className="rpl2" style={{ position:"absolute", inset:0, borderRadius:"50%", border:"1.5px solid rgba(196,74,135,0.28)", pointerEvents:"none" }} />
              <div className="orb-core" style={{
                width: ORB, height: ORB, borderRadius: "50%",
                background: "linear-gradient(148deg, #D44F93 0%, #A4005D 56%, #76003e 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "1.5px solid rgba(255,255,255,0.22)",
                position: "relative", overflow: "hidden",
              }}>
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: "44%",
                  background: "linear-gradient(180deg, rgba(255,255,255,0.28) 0%, transparent 100%)",
                  borderRadius: "50% 50% 0 0", pointerEvents: "none",
                }} />
                <AiIcon />
              </div>
            </button>
            <span style={{
              fontSize: 9, lineHeight: 1,
              fontWeight: isAiActive ? 600 : 500,
              color: isAiActive ? "#A4005D" : "#b5a898",
              fontFamily: "'DM Sans', system-ui, sans-serif",
              letterSpacing: "0.01em",
              transition: "color 0.22s",
            }}>AI Chat</span>
          </div>

          {/* Events, Hotel Info */}
          <Tab item={navItems[2]} delay={0.18} />
          <Tab item={navItems[3]} delay={0.23} />

        </div>
      </div>
    </>
  );
}

export default memo(GuestBottomNav);