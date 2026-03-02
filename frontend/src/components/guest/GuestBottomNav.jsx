import { useNavigate, useLocation } from "react-router-dom";

const HomeIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor"
    strokeWidth={active ? "2" : "1.6"} strokeLinecap="round" strokeLinejoin="round"
    style={{ width: 22, height: 22 }}>
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z" />
    <path d="M9 21V12h6v9" />
  </svg>
);

const OrdersIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor"
    strokeWidth={active ? "2" : "1.6"} strokeLinecap="round" strokeLinejoin="round"
    style={{ width: 22, height: 22 }}>
    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="1" />
    <path d="M9 12h6" /><path d="M9 16h4" />
  </svg>
);

const EventsIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor"
    strokeWidth={active ? "2" : "1.6"} strokeLinecap="round" strokeLinejoin="round"
    style={{ width: 22, height: 22 }}>
    <path d="M8 3v3" /><path d="M16 3v3" /><path d="M4 7h16" />
    <path d="M6 6h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
    <path d="M8 11h4" />
  </svg>
);

const HotelIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor"
    strokeWidth={active ? "2" : "1.6"} strokeLinecap="round" strokeLinejoin="round"
    style={{ width: 22, height: 22 }}>
    <path d="M3 21h18" />
    <path d="M6 21V7a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v14" />
    <path d="M10 7h4" /><path d="M10 11h4" /><path d="M10 15h4" />
  </svg>
);

const AiIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.96)" strokeWidth="1.7"
    strokeLinecap="round" strokeLinejoin="round" style={{ width: 23, height: 23 }}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    <circle cx="9.5" cy="11.5" r="0.6" fill="rgba(255,255,255,0.96)" stroke="none" />
    <circle cx="14.5" cy="11.5" r="0.6" fill="rgba(255,255,255,0.96)" stroke="none" />
  </svg>
);

const routeToKey = {
  "/guest/dashboard":  "home",
  "/guest/orders":     "orders",
  "/guest/support":    "ai",
  "/guest/events":     "events",
  "/guest/hotel-info": "hotel",
  "/guest/menu":       "orders",
  "/guest/housekeeping":"home",
  "/guest/cart":       "orders",
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

  // The bar background color — must match exactly for the SVG cutout trick
  const BAR_BG = "rgba(243,234,222,0.96)";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');

        @keyframes navUp {
          from { opacity:0; transform:translateY(100%); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes orbIn {
          0%   { opacity:0; transform:translateX(-50%) scale(0.5) translateY(16px); }
          65%  { transform:translateX(-50%) scale(1.07) translateY(-2px); }
          100% { opacity:1; transform:translateX(-50%) scale(1) translateY(0); }
        }
        @keyframes tabIn {
          from { opacity:0; transform:translateY(8px); }
          to   { opacity:1; transform:translateY(0); }
        }
        /* Smooth ripple from orb center outward */
        @keyframes rippleOut {
          0%   { transform:scale(1);    opacity:0.55; }
          100% { transform:scale(1.80); opacity:0;    }
        }
        /* Orb glow pulse */
        @keyframes orbGlow {
          0%,100% { box-shadow: 0 4px 16px rgba(164,0,93,0.42), 0 2px 6px rgba(0,0,0,0.20); }
          50%     { box-shadow: 0 6px 28px rgba(164,0,93,0.65), 0 2px 6px rgba(0,0,0,0.20); }
        }
        /* Active indicator slide in */
        @keyframes indicatorIn {
          from { width:0; opacity:0; }
          to   { opacity:1; }
        }

        .gbn-root {
          animation: navUp 0.42s cubic-bezier(0.22,1,0.36,1) both;
        }
        .gbn-tab {
          animation: tabIn 0.35s ease both;
          transition: transform 0.16s ease;
        }
        .gbn-tab:active { transform: scale(0.85) !important; }

        .gbn-orb-btn {
          animation: orbIn 0.52s cubic-bezier(0.22,1,0.36,1) 0.08s both;
        }
        .gbn-orb-btn:active .gbn-orb-inner { transform: scale(0.88); }

        .gbn-orb-inner {
          animation: orbGlow 3s ease-in-out 1.2s infinite;
          transition: transform 0.2s cubic-bezier(0.22,1,0.36,1);
        }

        /* Two ripple rings */
        .gbn-ripple {
          position: absolute; inset: 0; border-radius: 50%;
          border: 1.5px solid rgba(196,74,135,0.55);
          animation: rippleOut 2.6s ease-out 1.4s infinite;
          pointer-events: none;
        }
        .gbn-ripple-2 {
          animation-delay: 2.7s;
        }
      `}</style>

      {/* Root container */}
      <div className="gbn-root" style={{
        position: "relative",
        zIndex: 9999,
        flexShrink: 0,
        maxWidth: 430,
        width: "100%",
        margin: "0 auto",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        /* Lift the orb above the bar via overflow visible on this container */
        overflow: "visible",
      }}>

        {/*
          ── The SVG that draws the bar shape + notch cutout ──
          This is position:absolute, covers full width, sits visually behind tabs
          Height = 72px bar + 28px notch area above = 100px total
        */}
        <svg
          viewBox="0 0 430 100"
          preserveAspectRatio="none"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: 100,
            zIndex: 0,
            filter: "drop-shadow(0 -4px 20px rgba(26,20,16,0.12))",
            overflow: "visible",
          }}
        >
          {/* Bar with smooth notch cutout using cubic bezier curves */}
          <path
            d={`
              M0,100 L0,28
              C0,24 4,24 8,24
              L172,24
              C180,24 183,22 186,16
              Q192,4 215,4
              Q238,4 244,16
              C247,22 250,24 258,24
              L422,24
              C426,24 430,24 430,28
              L430,100 Z
            `}
            fill={BAR_BG}
            style={{
              backdropFilter: "blur(28px)",
            }}
          />
          {/* Subtle top border line */}
          <path
            d={`
              M0,28
              C0,24 4,24 8,24
              L172,24
              C180,24 183,22 186,16
              Q192,4 215,4
              Q238,4 244,16
              C247,22 250,24 258,24
              L422,24
              C426,24 430,24 430,28
            `}
            fill="none"
            stroke="rgba(255,255,255,0.60)"
            strokeWidth="1"
          />
        </svg>

        {/* Glass blur layer — same shape as SVG, behind tabs */}
        <div style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          height: 72,
          background: BAR_BG,
          backdropFilter: "blur(28px) saturate(1.8)",
          WebkitBackdropFilter: "blur(28px) saturate(1.8)",
          zIndex: 0,
        }} />

        {/* ── Floating orb button — positioned above notch ── */}
        <button
          className="gbn-orb-btn"
          onClick={() => navigate("/guest/support")}
          style={{
            position: "absolute",
            bottom: 72 - 28,           // sits so bottom half is in the bar
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
          }}
        >
          {/* Ripple rings */}
          <div className="gbn-ripple" />
          <div className="gbn-ripple gbn-ripple-2" />

          {/* Orb core */}
          <div className="gbn-orb-inner" style={{
            width: 54,
            height: 54,
            borderRadius: "50%",
            background: "linear-gradient(148deg, #D44F93 0%, #A4005D 55%, #780040 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid rgba(255,255,255,0.22)",
            position: "relative",
            overflow: "hidden",
            flexShrink: 0,
          }}>
            {/* Top gloss */}
            <div style={{
              position: "absolute",
              top: 0, left: 0, right: 0, height: "40%",
              background: "linear-gradient(180deg,rgba(255,255,255,0.22) 0%,transparent 100%)",
              borderRadius: "50% 50% 0 0",
              pointerEvents: "none",
            }} />
            <AiIcon />
          </div>
        </button>

        {/* ── Nav tabs row ── */}
        <div style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          height: 72,
          padding: "0 0 2px",
        }}>

          {/* Left 2 tabs */}
          {[navItems[0], navItems[1]].map((item, i) => {
            const isActive = activeKey === item.key;
            return (
              <button
                key={item.key}
                className="gbn-tab"
                onClick={() => navigate(item.route)}
                style={{
                  animationDelay: `${0.10 + i * 0.06}s`,
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                  height: "100%",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  position: "relative",
                }}
              >
                {/* Top active bar */}
                <div style={{
                  position: "absolute",
                  top: 0, left: "50%",
                  transform: "translateX(-50%)",
                  width: isActive ? 28 : 0,
                  height: 2.5,
                  borderRadius: "0 0 4px 4px",
                  background: "linear-gradient(90deg,#C44A87,#A4005D)",
                  transition: "width 0.38s cubic-bezier(0.22,1,0.36,1)",
                  opacity: isActive ? 1 : 0,
                }} />

                <span style={{
                  color: isActive ? "#A4005D" : "#b0a090",
                  transition: "color 0.22s ease, transform 0.22s cubic-bezier(0.22,1,0.36,1)",
                  transform: isActive ? "translateY(-1px) scale(1.10)" : "scale(1)",
                  lineHeight: 1,
                  display: "flex",
                }}>
                  <item.Icon active={isActive} />
                </span>
                <span style={{
                  fontSize: 10,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "#A4005D" : "#b0a090",
                  letterSpacing: "0.02em",
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  lineHeight: 1,
                  transition: "color 0.22s ease",
                }}>
                  {item.label}
                </span>
              </button>
            );
          })}

          {/* Center spacer (under the orb) */}
          <div style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            height: "100%",
            paddingBottom: 8,
            pointerEvents: "none",
          }}>
            <span style={{
              fontSize: 10,
              fontWeight: isAiActive ? 600 : 400,
              color: isAiActive ? "#A4005D" : "#b0a090",
              letterSpacing: "0.02em",
              fontFamily: "'DM Sans', system-ui, sans-serif",
              lineHeight: 1,
              transition: "color 0.22s ease",
            }}>
              AI Chat
            </span>
          </div>

          {/* Right 2 tabs */}
          {[navItems[2], navItems[3]].map((item, i) => {
            const isActive = activeKey === item.key;
            return (
              <button
                key={item.key}
                className="gbn-tab"
                onClick={() => navigate(item.route)}
                style={{
                  animationDelay: `${0.22 + i * 0.06}s`,
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                  height: "100%",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  position: "relative",
                }}
              >
                {/* Top active bar */}
                <div style={{
                  position: "absolute",
                  top: 0, left: "50%",
                  transform: "translateX(-50%)",
                  width: isActive ? 28 : 0,
                  height: 2.5,
                  borderRadius: "0 0 4px 4px",
                  background: "linear-gradient(90deg,#C44A87,#A4005D)",
                  transition: "width 0.38s cubic-bezier(0.22,1,0.36,1)",
                  opacity: isActive ? 1 : 0,
                }} />

                <span style={{
                  color: isActive ? "#A4005D" : "#b0a090",
                  transition: "color 0.22s ease, transform 0.22s cubic-bezier(0.22,1,0.36,1)",
                  transform: isActive ? "translateY(-1px) scale(1.10)" : "scale(1)",
                  lineHeight: 1,
                  display: "flex",
                }}>
                  <item.Icon active={isActive} />
                </span>
                <span style={{
                  fontSize: 10,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "#A4005D" : "#b0a090",
                  letterSpacing: "0.02em",
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  lineHeight: 1,
                  transition: "color 0.22s ease",
                }}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}