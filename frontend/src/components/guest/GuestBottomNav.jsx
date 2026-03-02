import { useNavigate, useLocation } from "react-router-dom";

/* Nav icons (22px) */
const HomeIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={active ? "2" : "1.5"} strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z" />
    <path d="M9 21V12h6v9" />
  </svg>
);

const OrdersIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={active ? "2" : "1.5"} strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="1" />
    <path d="M9 12h6" /><path d="M9 16h4" />
  </svg>
);

const EventsIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={active ? "2" : "1.5"} strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
    <path d="M8 3v3" /><path d="M16 3v3" /><path d="M4 7h16" />
    <path d="M6 6h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
    <path d="M8 11h4" />
  </svg>
);

const HotelIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={active ? "2" : "1.5"} strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
    <path d="M3 21h18" />
    <path d="M6 21V7a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v14" />
    <path d="M10 7h4" /><path d="M10 11h4" /><path d="M10 15h4" />
  </svg>
);

const AiIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    <circle cx="9.5" cy="11" r="0.5" fill="#fff" stroke="none" />
    <circle cx="14.5" cy="11" r="0.5" fill="#fff" stroke="none" />
  </svg>
);

const routeToKey = {
  "/guest/dashboard": "home",
  "/guest/orders": "orders",
  "/guest/support": "ai",
  "/guest/events": "events",
  "/guest/hotel-info": "hotel",
  "/guest/menu": "orders",
  "/guest/housekeeping": "home",
  "/guest/cart": "orders",
};

const navItems = [
  { key: "home",       label: "Home",   route: "/guest/dashboard",  Icon: HomeIcon },
  { key: "orders",     label: "Orders", route: "/guest/orders",     Icon: OrdersIcon },
  { key: "events",     label: "Events", route: "/guest/events",     Icon: EventsIcon },
  { key: "hotel info", label: "Hotel",  route: "/guest/hotel-info", Icon: HotelIcon },
];

export default function GuestBottomNav() {
  const navigate  = useNavigate();
  const location  = useLocation();

  const pathname = location.pathname;
  let activeKey = routeToKey[pathname] || "";
  if (!activeKey) {
    if (pathname.startsWith("/guest/events"))  activeKey = "events";
    else if (pathname.startsWith("/guest/orders")) activeKey = "orders";
    else activeKey = "home";
  }

  const leftItems  = navItems.slice(0, 2);
  const rightItems = navItems.slice(2);
  const isAiActive = activeKey === "ai";

  const renderNavItem = (item, idx, delayBase) => {
    const isActive = activeKey === item.key;
    return (
      <button
        key={item.key}
        onClick={() => navigate(item.route)}
        className="gbn-tab"
        style={{
          animationDelay: `${delayBase + idx * 0.06}s`,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          padding: "10px 0 8px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          position: "relative",
        }}
      >
        {/* Active glow pill behind icon */}
        <div style={{
          position: "absolute",
          top: 6,
          left: "50%",
          transform: "translateX(-50%)",
          width: isActive ? 40 : 0,
          height: 32,
          borderRadius: 12,
          background: "linear-gradient(135deg,rgba(164,0,93,0.13),rgba(196,74,135,0.08))",
          transition: "width 0.4s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease",
          opacity: isActive ? 1 : 0,
          backdropFilter: isActive ? "blur(6px)" : "none",
          border: isActive ? "1px solid rgba(164,0,93,0.12)" : "none",
        }} />

        <span style={{
          color: isActive ? "#A4005D" : "#9a8a80",
          transition: "color 0.3s ease, transform 0.3s ease",
          transform: isActive ? "scale(1.1) translateY(-1px)" : "scale(1)",
          position: "relative", zIndex: 1,
        }}>
          <item.Icon active={isActive} />
        </span>

        <span style={{
          fontSize: 9.5,
          fontWeight: isActive ? 700 : 400,
          letterSpacing: "0.04em",
          color: isActive ? "#A4005D" : "#9a8a80",
          transition: "color 0.3s ease, transform 0.3s ease",
          transform: isActive ? "translateY(-1px)" : "translateY(0)",
          fontFamily: "'DM Sans', system-ui, sans-serif",
        }}>{item.label}</span>

        {/* Active dot */}
        <div style={{
          position: "absolute",
          bottom: 3,
          left: "50%",
          transform: "translateX(-50%)",
          width: isActive ? 4 : 0,
          height: 4,
          borderRadius: "50%",
          background: "#A4005D",
          boxShadow: isActive ? "0 0 6px rgba(164,0,93,0.5)" : "none",
          transition: "width 0.35s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease, box-shadow 0.3s ease",
          opacity: isActive ? 1 : 0,
        }} />
      </button>
    );
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');

        /* ── Entry animations ── */
        @keyframes gbnSlideUp {
          from { opacity:0; transform:translateY(28px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes gbnTabPop {
          0%   { opacity:0; transform:scale(0.72) translateY(10px); }
          65%  { transform:scale(1.04) translateY(-1px); }
          100% { opacity:1; transform:scale(1) translateY(0); }
        }
        @keyframes gbnOrbEntry {
          0%   { opacity:0; transform:translateX(-50%) scale(0.3) translateY(24px); }
          55%  { transform:translateX(-50%) scale(1.1) translateY(-3px); }
          100% { opacity:1; transform:translateX(-50%) scale(1) translateY(0); }
        }
        @keyframes gbnIconBounce {
          0%   { transform:scale(1); }
          40%  { transform:scale(1.28); }
          100% { transform:scale(1.1); }
        }

        /* ── Orb ring: smooth slow wave pulse ── */
        @keyframes orbRingWave {
          0%   { transform:translateX(-50%) scale(1);   opacity:0.55; }
          40%  { transform:translateX(-50%) scale(1.14); opacity:0.22; }
          100% { transform:translateX(-50%) scale(1);   opacity:0.55; }
        }
        /* Outer second ring, offset phase */
        @keyframes orbRingWave2 {
          0%   { transform:translateX(-50%) scale(1);   opacity:0.28; }
          50%  { transform:translateX(-50%) scale(1.22); opacity:0.08; }
          100% { transform:translateX(-50%) scale(1);   opacity:0.28; }
        }
        /* Orb inner glow breathe */
        @keyframes orbGlowBreathe {
          0%,100% { box-shadow: 0 0 0 0 rgba(164,0,93,0), 0 6px 20px rgba(164,0,93,0.35), 0 2px 8px rgba(0,0,0,0.18); }
          50%     { box-shadow: 0 0 0 8px rgba(164,0,93,0.06), 0 8px 28px rgba(164,0,93,0.50), 0 2px 8px rgba(0,0,0,0.18); }
        }

        /* ── Wave shimmer across the bar top-border ── */
        @keyframes barWaveShimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 300% center; }
        }

        .gbn-bar   { animation: gbnSlideUp 0.52s cubic-bezier(0.22,1,0.36,1) both; }
        .gbn-tab   { animation: gbnTabPop  0.48s cubic-bezier(0.22,1,0.36,1) both; transition:transform 0.16s ease; }
        .gbn-tab:active { transform:scale(0.86); }

        .gbn-center-btn { animation: gbnOrbEntry 0.62s cubic-bezier(0.22,1,0.36,1) 0.12s both; }
        .gbn-center-btn:active .gbn-orb-core { transform:scale(0.88); }

        .gbn-orb-core {
          animation: orbGlowBreathe 3.2s ease-in-out 0.8s infinite;
          transition: transform 0.22s cubic-bezier(0.22,1,0.36,1);
        }
        .gbn-ring-1 {
          animation: orbRingWave  3.2s ease-in-out 0.8s infinite;
        }
        .gbn-ring-2 {
          animation: orbRingWave2 3.2s ease-in-out 1.4s infinite;
        }

        .gbn-icon-active { animation: gbnIconBounce 0.4s cubic-bezier(0.22,1,0.36,1); }

        /* Wave shimmer line at the top of the bar */
        .gbn-shimmer-bar {
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            transparent 20%,
            rgba(164,0,93,0.55) 38%,
            rgba(212,79,147,0.9) 50%,
            rgba(164,0,93,0.55) 62%,
            transparent 80%,
            transparent 100%
          );
          background-size: 200% 100%;
          animation: barWaveShimmer 4s cubic-bezier(0.4,0,0.6,1) 0.6s infinite;
        }
      `}</style>

      <div className="gbn-bar" style={{
        flexShrink: 0,
        maxWidth: 430,
        width: "100%",
        margin: "0 auto",
        position: "relative",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}>

        {/* ── Shimmer wave line sits above the bar ── */}
        <div className="gbn-shimmer-bar" />

        {/* ── The glass bar itself ── */}
        <div style={{
          background: "rgba(245,236,224,0.38)",
          backdropFilter: "blur(32px) saturate(1.8) brightness(1.06)",
          WebkitBackdropFilter: "blur(32px) saturate(1.8) brightness(1.06)",
          borderRadius: "20px 20px 0 0",
          border: "1px solid rgba(255,255,255,0.45)",
          borderBottom: "none",
          boxShadow: "0 -6px 32px rgba(26,20,16,0.08), inset 0 1px 0 rgba(255,255,255,0.55)",
          position: "relative",
          overflow: "visible",
        }}>

          {/* SVG notch cutout */}
          <svg
            viewBox="0 0 430 28"
            preserveAspectRatio="none"
            style={{
              position: "absolute",
              top: -27,
              left: 0,
              right: 0,
              width: "100%",
              height: 28,
              display: "block",
              filter: "drop-shadow(0 -3px 10px rgba(26,20,16,0.06))",
            }}
          >
            <path
              d="M0 28 L0 28 L168 28 Q176 28, 181 22 Q192 4, 215 4 Q238 4, 249 22 Q254 28, 262 28 L430 28 L430 28 Z"
              fill="rgba(245,236,224,0.38)"
              style={{ backdropFilter: "blur(32px)" }}
            />
            {/* Notch border highlight */}
            <path
              d="M168 28 Q176 28, 181 22 Q192 4, 215 4 Q238 4, 249 22 Q254 28, 262 28"
              fill="none"
              stroke="rgba(255,255,255,0.42)"
              strokeWidth="1"
            />
          </svg>

          {/* ── Center floating orb with smooth ring waves ── */}
          <button
            onClick={() => navigate("/guest/support")}
            className="gbn-center-btn"
            style={{
              position: "absolute",
              top: -32,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 10,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              padding: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Outer ring 2 — slowest, most diffuse */}
            <div className="gbn-ring-2" style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 72,
              height: 72,
              marginTop: -36,
              marginLeft: -36,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(164,0,93,0.18) 0%, rgba(164,0,93,0.04) 60%, transparent 100%)",
              pointerEvents: "none",
            }} />

            {/* Outer ring 1 — medium */}
            <div className="gbn-ring-1" style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 72,
              height: 72,
              marginTop: -36,
              marginLeft: -36,
              borderRadius: "50%",
              border: "1.5px solid rgba(164,0,93,0.35)",
              pointerEvents: "none",
            }} />

            {/* Orb core */}
            <div className="gbn-orb-core" style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "linear-gradient(145deg, #C44A87 0%, #A4005D 60%, #7a0044 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1.5px solid rgba(255,255,255,0.22)",
              position: "relative",
              overflow: "hidden",
            }}>
              {/* Inner gloss */}
              <div style={{
                position: "absolute",
                top: 0, left: 0, right: 0,
                height: "45%",
                background: "linear-gradient(to bottom, rgba(255,255,255,0.22), transparent)",
                borderRadius: "50% 50% 0 0",
                pointerEvents: "none",
              }} />
              <AiIcon />
            </div>
          </button>

          {/* ── Nav items row ── */}
          <div style={{
            display: "flex",
            alignItems: "flex-end",
            padding: "0 8px 4px",
          }}>
            {leftItems.map((item, idx) => renderNavItem(item, idx, 0.12))}

            {/* Center spacer + AI Chat label */}
            <div style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: 28,
              paddingBottom: 8,
            }}>
              <span style={{
                fontSize: 9.5,
                fontWeight: isAiActive ? 700 : 400,
                letterSpacing: "0.04em",
                color: isAiActive ? "#A4005D" : "#9a8a80",
                transition: "color 0.3s ease",
                fontFamily: "'DM Sans', system-ui, sans-serif",
              }}>AI Chat</span>
            </div>

            {rightItems.map((item, idx) => renderNavItem(item, idx, 0.28))}
          </div>
        </div>
      </div>
    </>
  );
}