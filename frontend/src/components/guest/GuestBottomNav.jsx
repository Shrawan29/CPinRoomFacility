import { useNavigate, useLocation } from "react-router-dom";

/*  Nav icons (20px, thin stroke)  */
const HomeIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z" />
    <path d="M9 21V12h6v9" />
  </svg>
);

const OrdersIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="1" />
    <path d="M9 12h6" /><path d="M9 16h4" />
  </svg>
);

const EventsIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
    <path d="M8 3v3" /><path d="M16 3v3" /><path d="M4 7h16" />
    <path d="M6 6h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
    <path d="M8 11h4" />
  </svg>
);

const HotelIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
    <path d="M3 21h18" />
    <path d="M6 21V7a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v14" />
    <path d="M10 7h4" /><path d="M10 11h4" /><path d="M10 15h4" />
  </svg>
);

/* AI center icon */
const AiIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
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
    if (pathname.startsWith("/guest/events")) activeKey = "events";
    else if (pathname.startsWith("/guest/orders")) activeKey = "orders";
    else activeKey = "home";
  }

  const leftItems = navItems.slice(0, 2);
  const rightItems = navItems.slice(2);
  const isAiActive = activeKey === "ai";

  const renderNavItem = (item) => {
    const isActive = activeKey === item.key;
    return (
      <button
        key={item.key}
        onClick={() => navigate(item.route)}
        className="gbn-tab"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
          padding: "8px 0 6px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          position: "relative",
        }}
      >
        <span style={{
          color: isActive ? "#A78BFA" : "rgba(255,255,255,0.45)",
          transition: "color 0.25s ease",
        }}>
          <item.Icon active={isActive} />
        </span>
        <span style={{
          fontSize: 9,
          fontWeight: isActive ? 600 : 400,
          letterSpacing: "0.02em",
          color: isActive ? "#A78BFA" : "rgba(255,255,255,0.4)",
          transition: "color 0.25s ease",
        }}>{item.label}</span>
      </button>
    );
  };

  return (
    <>
      <style>{`
        @keyframes gbnSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes gbnOrbPulse {
          0%   { box-shadow: 0 0 20px 4px rgba(139,92,246,0.35), 0 4px 16px rgba(0,0,0,0.3); }
          50%  { box-shadow: 0 0 28px 8px rgba(139,92,246,0.5), 0 4px 16px rgba(0,0,0,0.3); }
          100% { box-shadow: 0 0 20px 4px rgba(139,92,246,0.35), 0 4px 16px rgba(0,0,0,0.3); }
        }
        .gbn-bar {
          animation: gbnSlideUp 0.4s cubic-bezier(0.22,1,0.36,1) both;
        }
        .gbn-tab {
          transition: transform 0.15s ease;
        }
        .gbn-tab:active { transform: scale(0.88); }
        .gbn-center-btn:active .gbn-orb { transform: scale(0.92); }
        .gbn-orb {
          animation: gbnOrbPulse 3s ease-in-out infinite;
          transition: transform 0.2s ease;
        }
      `}</style>

      {/* Outer wrapper with notch cutout */}
      <div className="gbn-bar" style={{
        flexShrink: 0,
        maxWidth: 430,
        width: "100%",
        margin: "0 auto",
        position: "relative",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}>

        {/* The dark bar */}
        <div style={{
          background: "linear-gradient(180deg, #1E1E2E 0%, #16161F 100%)",
          borderRadius: "20px 20px 0 0",
          position: "relative",
          overflow: "visible",
        }}>

          {/* SVG notch cutout at the top center */}
          <svg
            viewBox="0 0 430 20"
            preserveAspectRatio="none"
            style={{
              position: "absolute",
              top: -19,
              left: 0,
              right: 0,
              width: "100%",
              height: 20,
              display: "block",
            }}
          >
            <path
              d="M0 20 L0 0 L175 0 Q175 0, 180 0 Q195 0, 200 18 Q205 20, 215 20 Q225 20, 230 18 Q245 0, 250 0 Q255 0, 255 0 L430 0 L430 20 Z"
              fill="#1E1E2E"
            />
          </svg>

          {/* Center floating orb button */}
          <button
            onClick={() => navigate("/guest/support")}
            className="gbn-center-btn"
            style={{
              position: "absolute",
              top: -30,
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
            <div className="gbn-orb" style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: "linear-gradient(145deg, #8B5CF6, #6D28D9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: isAiActive ? "2px solid rgba(167,139,250,0.6)" : "none",
            }}>
              <AiIcon />
            </div>
          </button>

          {/* Nav items row */}
          <div style={{
            display: "flex",
            alignItems: "flex-end",
            padding: "0 8px 2px",
          }}>
            {leftItems.map((item) => renderNavItem(item))}

            {/* Spacer for center button */}
            <div style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: 26,
              paddingBottom: 6,
            }}>
              <span style={{
                fontSize: 9,
                fontWeight: isAiActive ? 600 : 400,
                letterSpacing: "0.02em",
                color: isAiActive ? "#A78BFA" : "rgba(255,255,255,0.4)",
                transition: "color 0.25s ease",
              }}>AI Chat</span>
            </div>

            {rightItems.map((item) => renderNavItem(item))}
          </div>
        </div>
      </div>
    </>
  );
}