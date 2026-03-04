import { memo } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const HomeIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 21, height: 21 }}>
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z" />
    <path d="M9 21V12h6v9" />
  </svg>
);
const OrdersIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 21, height: 21 }}>
    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="1" />
    <path d="M9 12h6" /><path d="M9 16h4" />
  </svg>
);
const EventsIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 21, height: 21 }}>
    <path d="M8 3v3" /><path d="M16 3v3" /><path d="M4 7h16" />
    <path d="M6 6h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
    <path d="M8 11h4" />
  </svg>
);
const HotelIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 21, height: 21 }}>
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
  { key: "home",   label: "Home",   route: "/guest/dashboard",  Icon: HomeIcon },
  { key: "orders", label: "Orders", route: "/guest/orders",     Icon: OrdersIcon },
  { key: "events", label: "Events", route: "/guest/events",     Icon: EventsIcon },
  { key: "hotel",  label: "Hotel",  route: "/guest/hotel-info", Icon: HotelIcon },
];

// ORB_SIZE and PILL constants — single source of truth
const ORB   = 54;   // orb diameter px
const PILL_H = 64;  // pill height px
const SIDE_M = 14;  // pill side margin px
// How far orb center sits above pill top edge
const ORB_LIFT = 20;

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

  const Tab = ({ item, delay }) => {
    const on = activeKey === item.key;
    return (
      <button onClick={() => navigate(item.route)}
        className="gbn-tab"
        style={{
          animationDelay: `${delay}s`,
          flex: 1, height: "100%",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: 4, padding: 0,
          background: "transparent", border: "none",
          cursor: "pointer", position: "relative",
          WebkitTapHighlightColor: "transparent",
          transition: "transform 0.14s ease",
        }}
        onPointerDown={e  => e.currentTarget.style.transform = "scale(0.86)"}
        onPointerUp={e    => e.currentTarget.style.transform = "scale(1)"}
        onPointerLeave={e => e.currentTarget.style.transform = "scale(1)"}
      >
        <span style={{
          display: "flex",
          color: on ? "#A4005D" : "#b5a898",
          transition: "color 0.22s, transform 0.22s cubic-bezier(0.22,1,0.36,1)",
          transform: on ? "translateY(-1px) scale(1.1)" : "scale(1)",
        }}>
          <item.Icon active={on} />
        </span>
        <span style={{
          fontSize: 9.5, lineHeight: 1,
          fontWeight: on ? 600 : 400,
          color: on ? "#A4005D" : "#b5a898",
          fontFamily: "'DM Sans', system-ui, sans-serif",
          letterSpacing: "0.01em",
          transition: "color 0.22s",
        }}>{item.label}</span>
        <div style={{
          position: "absolute", bottom: 6,
          width: on ? 20 : 0, height: 2.5, borderRadius: 2,
          background: "linear-gradient(90deg,#C44A87,#A4005D)",
          transition: "width 0.32s cubic-bezier(0.22,1,0.36,1)",
        }} />
      </button>
    );
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes gbnUp  { from{opacity:0;transform:translateY(60px)} to{opacity:1;transform:translateY(0)} }
        @keyframes gbnTab { from{opacity:0;transform:translateY(8px)}  to{opacity:1;transform:translateY(0)} }
        @keyframes gbnOrb { 0%{opacity:0;transform:translateX(-50%) scale(0.4)} 65%{transform:translateX(-50%) scale(1.06)} 100%{opacity:1;transform:translateX(-50%) scale(1)} }
        @keyframes rippleOut { 0%{transform:scale(1);opacity:0.5} 100%{transform:scale(2.2);opacity:0} }
        @keyframes orbBreathe {
          0%,100%{box-shadow:0 4px 18px rgba(164,0,93,0.40),0 2px 6px rgba(0,0,0,0.16)}
          50%    {box-shadow:0 6px 28px rgba(164,0,93,0.65),0 2px 6px rgba(0,0,0,0.16)}
        }
        .gbn-root { animation: gbnUp 0.44s cubic-bezier(0.22,1,0.36,1) both; }
        .gbn-tab  { animation: gbnTab 0.34s ease both; }
        .gbn-orb-btn { animation: gbnOrb 0.50s cubic-bezier(0.22,1,0.36,1) 0.1s both; }
        .gbn-orb-btn:active .orb-core { transform: scale(0.88) !important; }
        .orb-core { animation: orbBreathe 2.8s ease-in-out 1s infinite; transition: transform 0.18s cubic-bezier(0.22,1,0.36,1) !important; }
        .rpl  { animation: rippleOut 2.8s ease-out 1.0s infinite; }
        .rpl2 { animation: rippleOut 2.8s ease-out 2.4s infinite; }
      `}</style>

      {/*
        LAYOUT STRATEGY:
        - Outer wrapper: position:relative, contains BOTH the pill and the orb
        - Pill: display block, margin:0 SIDE_M, height PILL_H
        - Orb: position:absolute on the WRAPPER
            top = -(ORB/2) + (PILL_H/2) - ORB_LIFT   → sits centered on pill top edge, lifted by ORB_LIFT
            left = 50%  (of wrapper = full width)
            transform = translateX(-50%)
        This means orb is always perfectly centered over the pill notch regardless of margins.
      */}
      <div className="gbn-root" style={{
        flexShrink: 0,
        position: "relative",
        zIndex: 9999,
        width: "100%",
        maxWidth: 430,
        margin: "0 auto",
        // paddingBottom for safe area goes here but MUST be accounted for in orb top calc
        // We use marginBottom on the pill instead so wrapper height stays predictable
      }}>

        {/* PILL */}
        <div style={{
          margin: `0 ${SIDE_M}px`,
          height: PILL_H,
          borderRadius: PILL_H / 2,
          background: "linear-gradient(to bottom, rgba(255,251,245,0.97), rgba(244,235,222,0.88))",
          backdropFilter: "blur(28px) saturate(1.8)",
          WebkitBackdropFilter: "blur(28px) saturate(1.8)",
          border: "1.2px solid rgba(255,255,255,0.68)",
          boxShadow: "0 8px 32px rgba(26,20,16,0.13), 0 2px 8px rgba(26,20,16,0.07), inset 0 1px 0 rgba(255,255,255,0.72)",
          position: "relative",
          overflow: "visible",
          marginBottom: "env(safe-area-inset-bottom, 8px)",
        }}>

          {/* Notch — matches page bg, punches visual hole at top-center */}
          <div style={{
            position: "absolute",
            top: -(ORB_LIFT + ORB * 0.3),
            left: "50%",
            transform: "translateX(-50%)",
            width: ORB + 18,
            height: ORB_LIFT + ORB * 0.55,
            background: "#eddfc5",
            borderRadius: `0 0 ${(ORB + 18) / 2}px ${(ORB + 18) / 2}px`,
            zIndex: 0,
            pointerEvents: "none",
          }} />

          {/* Top gloss strip */}
          <div style={{
            position: "absolute", top: 0, left: 16, right: 16, height: 1,
            background: "rgba(255,255,255,0.75)",
            borderRadius: "32px 32px 0 0",
            pointerEvents: "none", zIndex: 3,
          }} />

          {/* Nav row */}
          <div style={{
            position: "relative", zIndex: 2,
            display: "flex", alignItems: "center",
            height: "100%", padding: "0 6px",
          }}>
            <Tab item={navItems[0]} delay={0.10} />
            <Tab item={navItems[1]} delay={0.15} />

            {/* Center slot — just the label, orb floats above */}
            <div style={{
              flex: 1, height: "100%",
              display: "flex", alignItems: "flex-end",
              justifyContent: "center", paddingBottom: 7,
              pointerEvents: "none",
            }}>
              <span style={{
                fontSize: 9.5, lineHeight: 1,
                fontWeight: isAiActive ? 600 : 400,
                color: isAiActive ? "#A4005D" : "#b5a898",
                fontFamily: "'DM Sans', system-ui, sans-serif",
                transition: "color 0.22s",
              }}>AI Chat</span>
            </div>

            <Tab item={navItems[2]} delay={0.20} />
            <Tab item={navItems[3]} delay={0.25} />
          </div>
        </div>

        {/*
          ORB — absolutely positioned on the outer wrapper.
          top: pill sits at y=0 of wrapper (no top margin/padding on wrapper).
          We want orb center to be at y = ORB_LIFT above pill top = -(ORB/2 - ORB_LIFT... wait.
          Pill top = 0. Orb center should be at y = -ORB_LIFT from pill top.
          Orb top edge = orb_center_y - ORB/2 = -ORB_LIFT - ORB/2
        */}
        <button
          className="gbn-orb-btn"
          onClick={() => navigate("/guest/support")}
          style={{
            position: "absolute",
            top: -(ORB_LIFT + ORB / 2),   // = -(20 + 27) = -47 from wrapper top = lifted above pill
            left: "50%",
            // animation handles translateX(-50%) already via gbnOrb keyframe
            zIndex: 20,
            border: "none", background: "transparent",
            cursor: "pointer", padding: 0,
            width: ORB, height: ORB,
            display: "flex", alignItems: "center", justifyContent: "center",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          <div className="rpl"  style={{ position:"absolute", inset:0, borderRadius:"50%", border:"1.5px solid rgba(196,74,135,0.48)", pointerEvents:"none" }} />
          <div className="rpl2" style={{ position:"absolute", inset:0, borderRadius:"50%", border:"1.5px solid rgba(196,74,135,0.30)", pointerEvents:"none" }} />

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

      </div>
    </>
  );
}

export default memo(GuestBottomNav);