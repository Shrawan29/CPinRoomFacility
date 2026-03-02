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

/* AI center icon */
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
  { key: "home",   label: "Home",   route: "/guest/dashboard",  Icon: HomeIcon },
  { key: "orders", label: "Orders", route: "/guest/orders",     Icon: OrdersIcon },
  { key: "events", label: "Events", route: "/guest/events",     Icon: EventsIcon },
  { key: "hotel info",  label: "Hotel",  route: "/guest/hotel-info", Icon: HotelIcon },
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
        <span className={isActive ? "gbn-icon-active" : ""} style={{
          color: isActive ? "#A4005D" : "#9a8a80",
          transition: "color 0.3s ease, transform 0.3s ease",
          transform: isActive ? "scale(1.1)" : "scale(1)",
        }}>
          <item.Icon active={isActive} />
        </span>
        <span style={{
          fontSize: 10,
          fontWeight: isActive ? 700 : 400,
          letterSpacing: "0.04em",
          color: isActive ? "#A4005D" : "#9a8a80",
          transition: "color 0.3s ease, transform 0.3s ease",
          transform: isActive ? "translateY(-1px)" : "translateY(0)",
        }}>{item.label}</span>
        {/* Active indicator dot */}
        <div style={{
          position: "absolute",
          bottom: 4,
          left: "50%",
          transform: "translateX(-50%)",
          width: isActive ? 4 : 0,
          height: 4,
          borderRadius: "50%",
          background: "#A4005D",
          transition: "width 0.3s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease",
          opacity: isActive ? 1 : 0,
        }} />
      </button>
    );
  };

  return (
    <>
      <style>{`
        @keyframes gbnSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes gbnTabPop {
          0%   { opacity: 0; transform: scale(0.7) translateY(8px); }
          70%  { transform: scale(1.05) translateY(-1px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes gbnOrbPulse {
          0%   { box-shadow: 0 0 18px 4px rgba(164,0,93,0.28), 0 4px 14px rgba(0,0,0,0.12); }
          50%  { box-shadow: 0 0 28px 8px rgba(164,0,93,0.45), 0 4px 14px rgba(0,0,0,0.12); }
          100% { box-shadow: 0 0 18px 4px rgba(164,0,93,0.28), 0 4px 14px rgba(0,0,0,0.12); }
        }
        @keyframes gbnOrbEntry {
          0%   { opacity: 0; transform: translateX(-50%) scale(0.3) translateY(20px); }
          60%  { transform: translateX(-50%) scale(1.08) translateY(-2px); }
          100% { opacity: 1; transform: translateX(-50%) scale(1) translateY(0); }
        }
        @keyframes gbnNotchReveal {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .gbn-bar {
          animation: gbnSlideUp 0.5s cubic-bezier(0.22,1,0.36,1) both;
        }
        .gbn-tab {
          animation: gbnTabPop 0.45s cubic-bezier(0.22,1,0.36,1) both;
          transition: transform 0.15s ease;
        }
        .gbn-tab:active { transform: scale(0.88); }
        .gbn-center-btn {
          animation: gbnOrbEntry 0.6s cubic-bezier(0.22,1,0.36,1) 0.15s both;
        }
        .gbn-center-btn:active .gbn-orb { transform: scale(0.9); }
        .gbn-orb {
          animation: gbnOrbPulse 3s ease-in-out 0.8s infinite;
          transition: transform 0.2s cubic-bezier(0.22,1,0.36,1);
        }
        .gbn-notch {
          animation: gbnNotchReveal 0.4s ease 0.1s both;
        }
        .gbn-icon-active {
          animation: gbnIconBounce 0.4s cubic-bezier(0.22,1,0.36,1);
        }
        @keyframes gbnIconBounce {
          0%   { transform: scale(1); }
          40%  { transform: scale(1.25); }
          100% { transform: scale(1.1); }
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

        {/* The cream bar */}
        <div style={{
          background: "rgba(242,232,220,0.97)",
          backdropFilter: "blur(20px)",
          borderRadius: "22px 22px 0 0",
          borderTop: "1px solid rgba(164,0,93,0.06)",
          boxShadow: "0 -4px 24px rgba(26,20,16,0.08)",
          position: "relative",
          overflow: "visible",
        }}>

          {/* SVG notch cutout */}
          <svg
            className="gbn-notch"
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
              filter: "drop-shadow(0 -2px 8px rgba(26,20,16,0.06))",
            }}
          >
            <path
              d="M0 28 L0 28 L168 28 Q176 28, 181 22 Q192 4, 215 4 Q238 4, 249 22 Q254 28, 262 28 L430 28 L430 28 Z"
              fill="rgba(242,232,220,0.97)"
            />
          </svg>

          {/* Center floating orb */}
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
            <div className="gbn-orb" style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "linear-gradient(145deg, #C44A87, #A4005D)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: isAiActive ? "2.5px solid rgba(164,0,93,0.3)" : "none",
            }}>
              <AiIcon />
            </div>
          </button>

          {/* Nav items row */}
          <div style={{
            display: "flex",
            alignItems: "flex-end",
            padding: "0 10px 4px",
          }}>
            {leftItems.map((item, idx) => renderNavItem(item, idx, 0.12))}

            {/* Center spacer + label */}
            <div style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: 28,
              paddingBottom: 8,
            }}>
              <span style={{
                fontSize: 10,
                fontWeight: isAiActive ? 700 : 400,
                letterSpacing: "0.04em",
                color: isAiActive ? "#A4005D" : "#9a8a80",
                transition: "color 0.3s ease",
              }}>AI Chat</span>
            </div>

            {rightItems.map((item, idx) => renderNavItem(item, idx, 0.28))}
          </div>
        </div>
      </div>
    </>
  );
}