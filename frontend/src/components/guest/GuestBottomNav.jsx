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
    <circle cx="9.5" cy="11.5" r="0.7" fill="rgba(255,255,255,0.95)" stroke="none" />
    <circle cx="14.5" cy="11.5" r="0.7" fill="rgba(255,255,255,0.95)" stroke="none" />
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

/**
 * NavBarShape — draws the pill bar with a smooth convex arch (bump UP) at center-top.
 * Matches the reference image: bar rises up at center to cradle the orb like a pedestal.
 *
 * Parameters:
 *   W  = bar width
 *   H  = bar height (not counting arch)
 *   R  = outer pill corner radius
 *   AW = arch footprint width (how wide the raised bump is)
 *   AH = arch height (how far above the bar top the bump rises)
 *   FR = fillet radius at arch shoulders (smooth transition, like reference)
 */
function NavBarShape({ W = 390, H = 64, R = 32, AW = 82, AH = 26, FR = 14 }) {
  const cx   = W / 2;
  const TOP  = AH;       // bar top in SVG coords (arch peak = 0)
  const BOT  = TOP + H;  // bar bottom

  // Arch shoulder x positions
  const lx = cx - AW / 2;
  const rx = cx + AW / 2;

  // Bezier control points for the arch curve
  // We use two cubic bezier segments: left-shoulder → peak → right-shoulder
  // Control handles pull horizontally to make a wide, smooth arch
  const cpPull = AW * 0.30;

  /*
   * Full path (clockwise):
   *
   *  top-left corner
   *    → flat top going right
   *    → left fillet (concave, curving from flat up into arch)
   *    → arch bezier (convex bump, left-shoulder → peak → right-shoulder)
   *    → right fillet (curving back down to flat)
   *    → flat top going right
   *  top-right corner
   *    → right side down
   *  bottom-right corner
   *    → bottom going left
   *  bottom-left corner
   *    → left side up
   *  back to start
   */
  const path = [
    `M ${R} ${TOP}`,

    // flat top-left section up to left fillet start
    `L ${lx - FR} ${TOP}`,

    // LEFT FILLET — small concave quarter-round curving UP into arch
    // from (lx-FR, TOP) → (lx, TOP-FR)
    `Q ${lx} ${TOP} ${lx} ${TOP - FR}`,

    // ARCH — two cubic bezier halves, peak at (cx, 0)
    `C ${lx} ${TOP - FR - cpPull * 0.5} ${cx - cpPull} ${0} ${cx} ${0}`,
    `C ${cx + cpPull} ${0} ${rx} ${TOP - FR - cpPull * 0.5} ${rx} ${TOP - FR}`,

    // RIGHT FILLET — mirror of left
    `Q ${rx} ${TOP} ${rx + FR} ${TOP}`,

    // flat top-right section
    `L ${W - R} ${TOP}`,

    // top-right outer corner
    `Q ${W} ${TOP} ${W} ${TOP + R}`,

    // right side
    `L ${W} ${BOT - R}`,

    // bottom-right outer corner
    `Q ${W} ${BOT} ${W - R} ${BOT}`,

    // bottom
    `L ${R} ${BOT}`,

    // bottom-left outer corner
    `Q ${0} ${BOT} ${0} ${BOT - R}`,

    // left side
    `L ${0} ${TOP + R}`,

    // top-left outer corner
    `Q ${0} ${TOP} ${R} ${TOP}`,

    `Z`,
  ].join(" ");

  const svgH = AH + H; // total SVG canvas height

  return (
    <svg
      viewBox={`0 0 ${W} ${svgH}`}
      preserveAspectRatio="none"
      style={{
        position: "absolute",
        top:  -AH,   // push SVG up so arch renders above the div
        left:  0,
        width: "100%",
        height: svgH,
        overflow: "visible",
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <defs>
        <linearGradient id="ng1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="rgba(255,252,247,0.98)" />
          <stop offset="100%" stopColor="rgba(244,235,222,0.88)" />
        </linearGradient>
        <linearGradient id="ns1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.68)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <clipPath id="nc1"><path d={path} /></clipPath>
        <filter id="nsh" x="-8%" y="-20%" width="116%" height="140%">
          <feDropShadow dx="0" dy="5"  stdDeviation="12" floodColor="rgba(26,18,12,0.14)" />
          <feDropShadow dx="0" dy="1"  stdDeviation="3"  floodColor="rgba(26,18,12,0.07)" />
        </filter>
      </defs>

      {/* shadow layer */}
      <path d={path} fill="rgba(240,230,216,0.9)" filter="url(#nsh)" />

      {/* glass body */}
      <path d={path} fill="url(#ng1)" />

      {/* top-face shine clipped to shape */}
      <rect x="0" y={TOP} width={W} height={H * 0.38}
        fill="url(#ns1)" clipPath="url(#nc1)" />

      {/* border */}
      <path d={path} fill="none"
        stroke="rgba(255,255,255,0.68)" strokeWidth="1.2" />
    </svg>
  );
}

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

  const ARCH_H = 26;
  const BAR_H  = 64;
  // Orb sits so its center aligns with arch peak; orb diameter = 54px so half = 27
  const ORB_SIZE = 54;
  const orbTop   = -(ARCH_H + ORB_SIZE / 2 - 4); // slight overlap so orb nests in arch

  const Tab = ({ item, delay }) => {
    const on = activeKey === item.key;
    return (
      <button
        onClick={() => navigate(item.route)}
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
          width: on ? 20 : 0, height: 2.5,
          borderRadius: 2,
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

        @keyframes gbnUp {
          from { opacity:0; transform:translateY(60px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes gbnTab {
          from { opacity:0; transform:translateY(8px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes gbnOrb {
          0%   { opacity:0; transform:translateX(-50%) scale(0.4) translateY(12px); }
          62%  { transform:translateX(-50%) scale(1.07) translateY(-2px); }
          100% { opacity:1; transform:translateX(-50%) scale(1) translateY(0); }
        }
        @keyframes rippleOut {
          0%   { transform:scale(1);   opacity:0.5; }
          100% { transform:scale(2.2); opacity:0;   }
        }
        @keyframes orbBreathe {
          0%,100% { box-shadow: 0 4px 18px rgba(164,0,93,0.38), 0 2px 6px rgba(0,0,0,0.15); }
          50%     { box-shadow: 0 0 0 6px rgba(164,0,93,0.08), 0 6px 28px rgba(164,0,93,0.60), 0 2px 6px rgba(0,0,0,0.16); }
        }

        .gbn-root { animation: gbnUp  0.44s cubic-bezier(0.22,1,0.36,1) both; }
        .gbn-tab  { animation: gbnTab 0.34s ease both; }
        .gbn-orb-btn { animation: gbnOrb 0.50s cubic-bezier(0.22,1,0.36,1) 0.1s both; }
        .gbn-orb-btn:active .orb-core { transform: scale(0.88) !important; }
        .orb-core {
          animation: orbBreathe 2.8s ease-in-out 1s infinite;
          transition: transform 0.18s cubic-bezier(0.22,1,0.36,1) !important;
        }
        .rpl  { animation: rippleOut 2.8s ease-out infinite; }
        .rpl2 { animation-delay: 1.4s; }
      `}</style>

      <div className="gbn-root" style={{
        flexShrink: 0,
        position: "relative",
        zIndex: 9999,
        width: "100%",
        maxWidth: 430,
        margin: "0 auto",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}>

        {/* Bar wrapper — 12px side margins, height = BAR_H only */}
        <div style={{
          margin: "0 12px",
          height: BAR_H,
          position: "relative",
          overflow: "visible",
        }}>
          {/* SVG shape: arch protrudes ARCH_H above this div */}
          <NavBarShape W={390} H={BAR_H} R={32} AW={84} AH={ARCH_H} FR={14} />

          {/* Nav tabs */}
          <div style={{
            position: "relative", zIndex: 2,
            display: "flex", alignItems: "center",
            height: "100%", padding: "0 6px",
          }}>
            <Tab item={navItems[0]} delay={0.10} />
            <Tab item={navItems[1]} delay={0.15} />

            {/* Center gap for orb */}
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

        {/* ORB — floats centered, nestled in the arch */}
        <button
          className="gbn-orb-btn"
          onClick={() => navigate("/guest/support")}
          style={{
            position: "absolute",
            top: orbTop,
            left: "50%",
            zIndex: 20,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            padding: 0,
            width: ORB_SIZE + 2,
            height: ORB_SIZE + 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          <div className="rpl" style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            border: "1.5px solid rgba(196,74,135,0.44)",
            pointerEvents: "none",
          }} />
          <div className="rpl rpl2" style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            border: "1.5px solid rgba(196,74,135,0.26)",
            pointerEvents: "none",
          }} />

          <div className="orb-core" style={{
            width: ORB_SIZE, height: ORB_SIZE,
            borderRadius: "50%",
            background: "linear-gradient(148deg, #D44F93 0%, #A4005D 56%, #76003e 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "1.5px solid rgba(255,255,255,0.22)",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: "44%",
              background: "linear-gradient(180deg, rgba(255,255,255,0.28) 0%, transparent 100%)",
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