import { useNavigate, useLocation } from "react-router-dom";

const HomeIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor"
    strokeWidth={active ? "2" : "1.6"} strokeLinecap="round" strokeLinejoin="round"
    style={{ width: 21, height: 21 }}>
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z" />
    <path d="M9 21V12h6v9" />
  </svg>
);

const OrdersIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor"
    strokeWidth={active ? "2" : "1.6"} strokeLinecap="round" strokeLinejoin="round"
    style={{ width: 21, height: 21 }}>
    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="1" />
    <path d="M9 12h6" /><path d="M9 16h4" />
  </svg>
);

const EventsIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor"
    strokeWidth={active ? "2" : "1.6"} strokeLinecap="round" strokeLinejoin="round"
    style={{ width: 21, height: 21 }}>
    <path d="M8 3v3" /><path d="M16 3v3" /><path d="M4 7h16" />
    <path d="M6 6h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
    <path d="M8 11h4" />
  </svg>
);

const HotelIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor"
    strokeWidth={active ? "2" : "1.6"} strokeLinecap="round" strokeLinejoin="round"
    style={{ width: 21, height: 21 }}>
    <path d="M3 21h18" />
    <path d="M6 21V7a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v14" />
    <path d="M10 7h4" /><path d="M10 11h4" /><path d="M10 15h4" />
  </svg>
);

const AiIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.95)" strokeWidth="1.7"
    strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    <circle cx="9.5" cy="11.5" r="0.6" fill="rgba(255,255,255,0.95)" stroke="none" />
    <circle cx="14.5" cy="11.5" r="0.6" fill="rgba(255,255,255,0.95)" stroke="none" />
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
    if (pathname.startsWith("/guest/events"))       activeKey = "events";
    else if (pathname.startsWith("/guest/orders"))  activeKey = "orders";
    else                                             activeKey = "home";
  }

  const leftItems  = navItems.slice(0, 2);
  const rightItems = navItems.slice(2);
  const isAiActive = activeKey === "ai";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');

        /* ─── Entry ─── */
        @keyframes navSlideUp {
          from { opacity:0; transform:translateY(100%); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes orbDrop {
          0%   { opacity:0; transform:scale(0.4) translateY(20px); }
          60%  { transform:scale(1.06) translateY(-2px); }
          100% { opacity:1; transform:scale(1) translateY(0); }
        }
        @keyframes tabFadeIn {
          from { opacity:0; transform:translateY(10px); }
          to   { opacity:1; transform:translateY(0); }
        }

        /* ─── Orb ripple — two offset rings expanding outward ─── */
        @keyframes ripple {
          0%   { transform:scale(1);    opacity:0.6; }
          100% { transform:scale(1.65); opacity:0; }
        }

        /* ─── Orb glow breathe ─── */
        @keyframes orbBreathe {
          0%,100% { box-shadow: 0 4px 18px rgba(164,0,93,0.40), 0 2px 6px rgba(0,0,0,0.22); }
          50%     { box-shadow: 0 6px 26px rgba(164,0,93,0.62), 0 2px 6px rgba(0,0,0,0.22); }
        }

        /* ─── Active pill indicator ─── */
        @keyframes pillIn {
          from { transform:translateX(-50%) scaleX(0); opacity:0; }
          to   { transform:translateX(-50%) scaleX(1); opacity:1; }
        }

        .nav-wrap {
          animation: navSlideUp 0.45s cubic-bezier(0.22,1,0.36,1) both;
        }
        .nav-tab {
          animation: tabFadeIn 0.38s ease both;
        }
        .nav-tab:active { transform:scale(0.87) !important; }

        .orb-btn {
          animation: orbDrop 0.55s cubic-bezier(0.22,1,0.36,1) 0.1s both;
        }
        .orb-btn:active .orb-core {
          transform: scale(0.90);
        }
        .orb-core {
          animation: orbBreathe 3s ease-in-out 1s infinite;
          transition: transform 0.2s cubic-bezier(0.22,1,0.36,1);
        }

        .ripple-ring {
          position:absolute;
          inset:0;
          border-radius:50%;
          border: 1.5px solid rgba(164,0,93,0.5);
          animation: ripple 2.8s ease-out 1.2s infinite;
          pointer-events:none;
        }
        .ripple-ring-2 {
          animation-delay: 2.2s;
        }
      `}</style>

      {/* ── Outer wrapper: sits above everything ── */}
      <div className="nav-wrap" style={{
        position: "relative",
        zIndex: 9999,
        flexShrink: 0,
        maxWidth: 430,
        width: "100%",
        margin: "0 auto",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}>

        {/* ── Floating orb — rendered OUTSIDE the bar so z-index is independent ── */}
        <button
          className="orb-btn"
          onClick={() => navigate("/guest/support")}
          style={{
            position: "absolute",
            top: -28,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            padding: 0,
            width: 58,
            height: 58,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Ripple rings */}
          <div className="ripple-ring" />
          <div className="ripple-ring ripple-ring-2" />

          {/* Orb core */}
          <div className="orb-core" style={{
            width: 54,
            height: 54,
            borderRadius: "50%",
            background: "linear-gradient(150deg, #D44F93 0%, #A4005D 55%, #7a003f 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1.5px solid rgba(255,255,255,0.20)",
            position: "relative",
            overflow: "hidden",
            flexShrink: 0,
          }}>
            {/* Gloss highlight */}
            <div style={{
              position: "absolute",
              top: 0, left: 0, right: 0,
              height: "42%",
              background: "linear-gradient(180deg, rgba(255,255,255,0.20) 0%, transparent 100%)",
              borderRadius: "50% 50% 0 0",
              pointerEvents: "none",
            }} />
            <AiIcon />
          </div>
        </button>

        {/* ── Glass bar ── */}
        <div style={{
          background: "rgba(246,237,226,0.72)",
          backdropFilter: "blur(28px) saturate(1.7)",
          WebkitBackdropFilter: "blur(28px) saturate(1.7)",
          borderTop: "1px solid rgba(255,255,255,0.52)",
          boxShadow: "0 -4px 24px rgba(26,20,16,0.10), inset 0 1px 0 rgba(255,255,255,0.60)",
          position: "relative",
          zIndex: 1,
          overflow: "visible",
        }}>

          {/* ── Nav row: 5 slots, center is the orb placeholder ── */}
          <div style={{
            display: "flex",
            alignItems: "center",
            height: 62,
            padding: "0 4px",
          }}>

            {/* Left 2 tabs */}
            {leftItems.map((item, i) => {
              const isActive = activeKey === item.key;
              return (
                <button
                  key={item.key}
                  className="nav-tab"
                  onClick={() => navigate(item.route)}
                  style={{
                    animationDelay: `${0.08 + i * 0.06}s`,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 3,
                    height: "100%",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    position: "relative",
                    transition: "transform 0.18s ease",
                  }}
                >
                  {/* Active top line indicator */}
                  <div style={{
                    position: "absolute",
                    top: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: isActive ? 24 : 0,
                    height: 2,
                    borderRadius: "0 0 3px 3px",
                    background: "linear-gradient(90deg, #C44A87, #A4005D)",
                    transition: "width 0.4s cubic-bezier(0.22,1,0.36,1)",
                    opacity: isActive ? 1 : 0,
                  }} />

                  <span style={{
                    color: isActive ? "#A4005D" : "#a89888",
                    transition: "color 0.25s ease, transform 0.25s cubic-bezier(0.22,1,0.36,1)",
                    transform: isActive ? "translateY(-1px) scale(1.08)" : "translateY(0) scale(1)",
                    lineHeight: 1,
                  }}>
                    <item.Icon active={isActive} />
                  </span>

                  <span style={{
                    fontSize: 9.5,
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? "#A4005D" : "#a89888",
                    letterSpacing: "0.03em",
                    transition: "color 0.25s ease",
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    lineHeight: 1,
                  }}>
                    {item.label}
                  </span>
                </button>
              );
            })}

            {/* Center slot — empty space for the orb */}
            <div style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-end",
              height: "100%",
              paddingBottom: 6,
            }}>
              <span style={{
                fontSize: 9.5,
                fontWeight: isAiActive ? 600 : 400,
                color: isAiActive ? "#A4005D" : "#a89888",
                letterSpacing: "0.03em",
                fontFamily: "'DM Sans', system-ui, sans-serif",
                lineHeight: 1,
                transition: "color 0.25s ease",
              }}>AI Chat</span>
            </div>

            {/* Right 2 tabs */}
            {rightItems.map((item, i) => {
              const isActive = activeKey === item.key;
              return (
                <button
                  key={item.key}
                  className="nav-tab"
                  onClick={() => navigate(item.route)}
                  style={{
                    animationDelay: `${0.20 + i * 0.06}s`,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 3,
                    height: "100%",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    position: "relative",
                    transition: "transform 0.18s ease",
                  }}
                >
                  {/* Active top line indicator */}
                  <div style={{
                    position: "absolute",
                    top: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: isActive ? 24 : 0,
                    height: 2,
                    borderRadius: "0 0 3px 3px",
                    background: "linear-gradient(90deg, #C44A87, #A4005D)",
                    transition: "width 0.4s cubic-bezier(0.22,1,0.36,1)",
                    opacity: isActive ? 1 : 0,
                  }} />

                  <span style={{
                    color: isActive ? "#A4005D" : "#a89888",
                    transition: "color 0.25s ease, transform 0.25s cubic-bezier(0.22,1,0.36,1)",
                    transform: isActive ? "translateY(-1px) scale(1.08)" : "translateY(0) scale(1)",
                    lineHeight: 1,
                  }}>
                    <item.Icon active={isActive} />
                  </span>

                  <span style={{
                    fontSize: 9.5,
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? "#A4005D" : "#a89888",
                    letterSpacing: "0.03em",
                    transition: "color 0.25s ease",
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    lineHeight: 1,
                  }}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}