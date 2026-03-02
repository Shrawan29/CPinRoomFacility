import { useNavigate, useLocation } from "react-router-dom";

const HomeIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z" />
    <path d="M9 21V12h6v9" />
  </svg>
);

const OrdersIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="1" />
    <path d="M9 12h6" /><path d="M9 16h4" />
  </svg>
);

const EventsIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
    <path d="M8 3v3" /><path d="M16 3v3" /><path d="M4 7h16" />
    <path d="M6 6h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
    <path d="M8 11h4" />
  </svg>
);

const HotelIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
    <path d="M3 21h18" />
    <path d="M6 21V7a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v14" />
    <path d="M10 7h4" /><path d="M10 11h4" /><path d="M10 15h4" />
  </svg>
);

const AiIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    <circle cx="9.5" cy="11.5" r="0.7" fill="white" stroke="none" />
    <circle cx="14.5" cy="11.5" r="0.7" fill="white" stroke="none" />
  </svg>
);

const routeToKey = {
  "/guest/dashboard":   "home",
  "/guest/orders":      "orders",
  "/guest/support":     "ai",
  "/guest/events":      "events",
  "/guest/hotel-info":  "hotel",
  "/guest/menu":        "orders",
  "/guest/housekeeping":"home",
  "/guest/cart":        "orders",
};

const navItems = [
  { key: "home",   label: "Home",   route: "/guest/dashboard",  Icon: HomeIcon },
  { key: "orders", label: "Orders", route: "/guest/orders",     Icon: OrdersIcon },
  { key: "events", label: "Events", route: "/guest/events",     Icon: EventsIcon },
  { key: "hotel",  label: "Hotel",  route: "/guest/hotel-info", Icon: HotelIcon },
];

export default function GuestBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const pathname = location.pathname;
  let activeKey = routeToKey[pathname] || "";
  if (!activeKey) {
    if (pathname.startsWith("/guest/events"))      activeKey = "events";
    else if (pathname.startsWith("/guest/orders")) activeKey = "orders";
    else                                            activeKey = "home";
  }

  const isAiActive = activeKey === "ai";

  // Must exactly match the page/body background so the notch "cuts through"
  const PAGE_BG   = "#eddfc5";
  // Bar fill color
  const BAR_COLOR = "rgba(243,234,221,0.97)";

  const NavBtn = ({ item, delay }) => {
    const isActive = activeKey === item.key;
    return (
      <button
        onClick={() => navigate(item.route)}
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 5,
          height: "100%",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          position: "relative",
          padding: 0,
          WebkitTapHighlightColor: "transparent",
          animation: `gbnTabIn 0.35s ease ${delay}s both`,
          transition: "transform 0.14s ease",
        }}
        onPointerDown={e => e.currentTarget.style.transform = "scale(0.87)"}
        onPointerUp={e => e.currentTarget.style.transform = "scale(1)"}
        onPointerLeave={e => e.currentTarget.style.transform = "scale(1)"}
      >
        {/* Active top pill */}
        <div style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: isActive ? 26 : 0,
          height: 2.5,
          borderRadius: "0 0 3px 3px",
          background: "linear-gradient(90deg, #C44A87, #A4005D)",
          transition: "width 0.35s cubic-bezier(0.22,1,0.36,1)",
        }} />

        <span style={{
          display: "flex",
          color: isActive ? "#A4005D" : "#b5a496",
          transition: "color 0.22s, transform 0.22s cubic-bezier(0.22,1,0.36,1)",
          transform: isActive ? "translateY(-1px) scale(1.12)" : "scale(1)",
        }}>
          <item.Icon active={isActive} />
        </span>

        <span style={{
          fontSize: 10,
          fontWeight: isActive ? 600 : 400,
          color: isActive ? "#A4005D" : "#b5a496",
          fontFamily: "'DM Sans', system-ui, sans-serif",
          letterSpacing: "0.01em",
          transition: "color 0.22s",
          lineHeight: 1,
        }}>
          {item.label}
        </span>
      </button>
    );
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');

        @keyframes gbnSlideUp {
          from { opacity:0; transform:translateY(100%); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes gbnTabIn {
          from { opacity:0; transform:translateY(10px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes gbnOrbIn {
          0%   { opacity:0; transform:translateX(-50%) scale(0.4) translateY(12px); }
          60%  { transform:translateX(-50%) scale(1.08) translateY(-2px); }
          100% { opacity:1; transform:translateX(-50%) scale(1) translateY(0); }
        }
        @keyframes gbnRipple {
          0%   { transform:scale(1);    opacity:0.5; }
          100% { transform:scale(1.9);  opacity:0;   }
        }
        @keyframes gbnOrbGlow {
          0%,100% { box-shadow:0 4px 18px rgba(164,0,93,0.45), 0 2px 8px rgba(0,0,0,0.18); }
          50%     { box-shadow:0 5px 28px rgba(164,0,93,0.68), 0 2px 8px rgba(0,0,0,0.18); }
        }
      `}</style>

      {/* ── Outermost wrapper — full z elevation ── */}
      <div style={{
        position: "relative",
        zIndex: 9999,
        flexShrink: 0,
        maxWidth: 430,
        width: "100%",
        margin: "0 auto",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        animation: "gbnSlideUp 0.42s cubic-bezier(0.22,1,0.36,1) both",
      }}>

        {/*
          ══ NOTCH BRIDGE ══
          A thin strip at the very top that matches the PAGE background color.
          This visually "punches through" the bar where the orb sits,
          making the notch look seamless — same trick used in real iOS tab bars.
          Height = how tall the notch cutout is (40px), centered over the orb.
        */}
        <div style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: 80,
          height: 40,
          background: PAGE_BG,
          borderRadius: "0 0 40px 40px",
          zIndex: 1,
          pointerEvents: "none",
        }} />

        {/* ── Glass bar ── */}
        <div style={{
          position: "relative",
          zIndex: 2,
          background: BAR_COLOR,
          backdropFilter: "blur(30px) saturate(1.8)",
          WebkitBackdropFilter: "blur(30px) saturate(1.8)",
          borderTop: "1px solid rgba(255,255,255,0.55)",
          boxShadow: "0 -2px 20px rgba(26,20,16,0.09), inset 0 1px 0 rgba(255,255,255,0.65)",
          overflow: "visible",
        }}>

          {/* ── Nav row ── */}
          <div style={{
            display: "flex",
            alignItems: "stretch",
            height: 66,
          }}>
            <NavBtn item={navItems[0]} delay={0.10} />
            <NavBtn item={navItems[1]} delay={0.15} />

            {/* Center slot — just holds the label, orb floats above */}
            <div style={{
              flex: 1,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              paddingBottom: 8,
              pointerEvents: "none",
            }}>
              <span style={{
                fontSize: 10,
                fontWeight: isAiActive ? 600 : 400,
                color: isAiActive ? "#A4005D" : "#b5a496",
                fontFamily: "'DM Sans', system-ui, sans-serif",
                transition: "color 0.22s",
                lineHeight: 1,
              }}>
                AI Chat
              </span>
            </div>

            <NavBtn item={navItems[2]} delay={0.20} />
            <NavBtn item={navItems[3]} delay={0.25} />
          </div>
        </div>

        {/* ── Floating orb — rendered last so it's always on top ── */}
        <button
          onClick={() => navigate("/guest/support")}
          style={{
            position: "absolute",
            top: -26,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 20,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            padding: 0,
            width: 56,
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            WebkitTapHighlightColor: "transparent",
            animation: "gbnOrbIn 0.5s cubic-bezier(0.22,1,0.36,1) 0.1s both",
          }}
          onPointerDown={e => {
            const orb = e.currentTarget.querySelector(".orb-inner");
            if (orb) orb.style.transform = "scale(0.88)";
          }}
          onPointerUp={e => {
            const orb = e.currentTarget.querySelector(".orb-inner");
            if (orb) orb.style.transform = "";
          }}
          onPointerLeave={e => {
            const orb = e.currentTarget.querySelector(".orb-inner");
            if (orb) orb.style.transform = "";
          }}
        >
          {/* Ripple 1 */}
          <div style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            border: "1.5px solid rgba(196,74,135,0.55)",
            animation: "gbnRipple 2.6s ease-out 1.3s infinite",
            pointerEvents: "none",
          }} />
          {/* Ripple 2 — offset */}
          <div style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            border: "1.5px solid rgba(196,74,135,0.40)",
            animation: "gbnRipple 2.6s ease-out 2.6s infinite",
            pointerEvents: "none",
          }} />

          {/* Orb core */}
          <div className="orb-inner" style={{
            width: 54,
            height: 54,
            borderRadius: "50%",
            background: "linear-gradient(148deg, #D44F93 0%, #A4005D 58%, #76003e 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1.5px solid rgba(255,255,255,0.18)",
            position: "relative",
            overflow: "hidden",
            animation: "gbnOrbGlow 2.8s ease-in-out 1.2s infinite",
            transition: "transform 0.18s cubic-bezier(0.22,1,0.36,1)",
          }}>
            {/* Gloss */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: "42%",
              background: "linear-gradient(180deg, rgba(255,255,255,0.22), transparent)",
              borderRadius: "50% 50% 0 0",
              pointerEvents: "none",
            }} />
            <AiIcon />
          </div>
        </button>

      </div>
    </>
  );
}