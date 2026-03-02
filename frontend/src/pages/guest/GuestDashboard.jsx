import { useNavigate } from "react-router-dom";
import { useGuestAuth } from "../../context/GuestAuthContext";
import hotelbg from "../../assets/hotel-bg.jpg";
import logo from "../../assets/logo.png";

import { useEffect, useState, useRef } from "react";
import { getGuestEvents } from "../../services/event.service";

export default function GuestDashboard() {
  const { guest, loading } = useGuestAuth();
  const navigate = useNavigate();
  const [fadeIn, setFadeIn] = useState(false);
  const [activeNav, setActiveNav] = useState("home");
  const [bodyVisible, setBodyVisible] = useState(false);

  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const autoRef = useRef(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    const t1 = setTimeout(() => setFadeIn(true), 50);
    const t2 = setTimeout(() => setBodyVisible(true), 400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    if (!loading && !guest) navigate("/guest/login");
  }, [guest, loading, navigate]);

  useEffect(() => {
    getGuestEvents().then((data) => setUpcomingEvents(data || []));
  }, []);

  useEffect(() => {
    if (upcomingEvents.length === 0) return;
    autoRef.current = setInterval(() => {
      setCurrentEventIndex((prev) => (prev + 1) % upcomingEvents.length);
    }, 4500);
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, [upcomingEvents.length]);

  const touchStartRef = useRef(0);
  const touchEndRef = useRef(0);
  const handleTouchStart = (e) => { touchStartRef.current = e.changedTouches[0].clientX; };
  const handleTouchEnd = (e) => {
    touchEndRef.current = e.changedTouches[0].clientX;
    const distance = touchStartRef.current - touchEndRef.current;
    if (Math.abs(distance) < 50) return;
    if (autoRef.current) clearInterval(autoRef.current);
    setCurrentEventIndex((prev) =>
      distance > 0
        ? (prev + 1) % upcomingEvents.length
        : (prev - 1 + upcomingEvents.length) % upcomingEvents.length
    );
    const timer = setTimeout(() => {
      autoRef.current = setInterval(() => setCurrentEventIndex((p) => (p + 1) % upcomingEvents.length), 4500);
    }, 5000);
    return () => clearTimeout(timer);
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  const greetingIcon = hour < 12 ? "☀️" : hour < 17 ? "🌤️" : "🌙";

  const formatEventDate = (ev) => {
    if (!ev.eventDate) return "";
    const d = new Date(ev.eventDate);
    const today = new Date(); const tomorrow = new Date(); tomorrow.setDate(today.getDate() + 1);
    if (d.toDateString() === today.toDateString()) return "Today";
    if (d.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    return d.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
  };

  const eventGradients = [
    "linear-gradient(160deg,#2d0840 0%,#7B2D8B 100%)",
    "linear-gradient(160deg,#5c001a 0%,#A4005D 100%)",
    "linear-gradient(160deg,#082036 0%,#1a6a8a 100%)",
    "linear-gradient(160deg,#2d1500 0%,#8a5200 100%)",
    "linear-gradient(160deg,#0e2e0e 0%,#2d6b2d 100%)",
  ];

  const hasActiveOrder = false;

  // ── Nav Icons ──
  const navItems = [
    {
      key: "home", label: "Home", route: "/guest/dashboard",
      icon: (a) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={a ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
          <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z" /><path d="M9 21V12h6v9" />
        </svg>
      ),
    },
    {
      key: "orders", label: "Orders", route: "/guest/orders",
      icon: (a) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={a ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
          <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
          <rect x="9" y="3" width="6" height="4" rx="1" /><path d="M9 12h6" /><path d="M9 16h4" />
        </svg>
      ),
    },
    {
      key: "support", label: "Chat", route: "/guest/support",
      icon: (a) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={a ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <circle cx="12" cy="17" r=".5" fill="currentColor" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

        :root {
          --cream: #F0E2D0;
          --cream-dark: #E8D5BC;
          --rose: #A4005D;
          --rose-light: #C44A87;
          --rose-pale: rgba(164,0,93,0.07);
          --text: #1A1410;
          --text-mid: #6B5C52;
          --text-light: #9B8B7E;
          --white: #FFFFFF;
          --card-shadow: 0 4px 24px rgba(26,20,16,0.08);
        }

        * { -webkit-font-smoothing: antialiased; }

        @keyframes heroReveal {
          0%   { opacity:0; transform:scale(1.04); }
          100% { opacity:1; transform:scale(1); }
        }
        @keyframes contentDrift {
          0%   { opacity:0; transform:translateY(8px); }
          100% { opacity:1; transform:translateY(0); }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes pulseDot {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.6; transform:scale(0.7); }
        }
        @keyframes shimmerSlide {
          0%   { transform:translateX(-100%); }
          100% { transform:translateX(100%); }
        }
        @keyframes fadeSlideIn {
          0%   { opacity:0; transform:translateX(24px) scale(0.98); }
          100% { opacity:1; transform:translateX(0) scale(1); }
        }
        @keyframes fadeSlideOut {
          0%   { opacity:1; transform:translateX(0) scale(1); }
          100% { opacity:0; transform:translateX(-24px) scale(0.98); }
        }
        @keyframes waveReveal {
          0%   { stroke-dashoffset:1400; opacity:0; }
          8%   { opacity:1; }
          100% { stroke-dashoffset:0; opacity:1; }
        }
        @keyframes waveGlow {
          0%,100% { opacity:0.4; }
          50%      { opacity:0.85; }
        }
        @keyframes waveRace {
          0%   { stroke-dashoffset:700; }
          100% { stroke-dashoffset:-700; }
        }
        @keyframes delayIn {
          from { opacity:0; }
          to   { opacity:1; }
        }
        @keyframes rowSlide {
          from { opacity:0; transform:translateX(-16px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes tagPop {
          0%   { opacity:0; transform:scale(0.8); }
          60%  { transform:scale(1.05); }
          100% { opacity:1; transform:scale(1); }
        }

        .wave-base {
          stroke-dasharray:1400;
          stroke-dashoffset:1400;
          animation: waveReveal 3s cubic-bezier(0.16,1,0.3,1) 0.3s forwards;
        }
        .wave-shimmer {
          stroke-dasharray:120 1280;
          stroke-dashoffset:700;
          opacity:0;
          animation: waveRace 3s linear 3.4s infinite, delayIn 0.5s ease 3.3s forwards;
        }
        .wave-glow {
          opacity:0;
          animation: waveGlow 4s ease-in-out 3.3s infinite, delayIn 0.8s ease 3.3s forwards;
        }

        .event-card-wrapper {
          position:absolute; inset:0;
          border-radius:20px; overflow:hidden;
          will-change:opacity,transform;
        }
        .event-card-wrapper.active {
          animation: fadeSlideIn 0.65s cubic-bezier(0.22,1,0.36,1) forwards;
          z-index:1;
        }
        .event-card-wrapper.exit {
          animation: fadeSlideOut 0.65s cubic-bezier(0.22,1,0.36,1) forwards;
          z-index:0;
        }

        .action-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .action-card:active { transform:scale(0.97); }

        .explore-row {
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }
        .explore-row:active { transform:scale(0.98); }

        .nav-btn {
          transition: background 0.18s ease, transform 0.13s ease;
        }
        .nav-btn:active { transform:scale(0.91); }

        .shimmer-card::after {
          content:'';
          position:absolute; inset:0;
          background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.14) 50%,transparent 60%);
          animation: shimmerSlide 3s ease-in-out 1.5s infinite;
          pointer-events:none;
          border-radius:inherit;
        }
      `}</style>

      <div style={{
        position:"fixed", inset:0,
        display:"flex", flexDirection:"column",
        background:"var(--cream)",
        opacity: fadeIn ? 1 : 0,
        transition:"opacity 0.6s ease",
        fontFamily:"'DM Sans', system-ui, sans-serif",
      }}>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            SCROLLABLE BODY
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div style={{
          flex:1, overflowY:"auto", overflowX:"hidden",
          maxWidth:430, width:"100%", margin:"0 auto",
          paddingBottom:88,
        }}>

          {/* ════════════════════════════════════════
              HERO — cinematic, full-bleed
          ════════════════════════════════════════ */}
          <div style={{ position:"relative", overflow:"hidden", minHeight:240 }}>

            {/* Background image */}
            <div style={{
              position:"absolute", inset:0,
              animation:"heroReveal 1.2s cubic-bezier(0.22,1,0.36,1) both",
            }}>
              <img src={hotelbg} alt="" style={{
                width:"100%", height:"100%",
                objectFit:"cover", objectPosition:"center 30%",
              }} />
            </div>

            {/* Layered overlays for depth */}
            <div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg, rgba(10,2,6,0.75) 0%, rgba(80,0,38,0.45) 45%, rgba(10,2,6,0.6) 100%)" }} />
            {/* Subtle vignette */}
            <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at 50% 0%, transparent 40%, rgba(0,0,0,0.35) 100%)" }} />

            {/* Decorative orbs */}
            <div style={{
              position:"absolute", top:-60, right:-60, width:220, height:220, borderRadius:"50%",
              background:"radial-gradient(circle, rgba(164,0,93,0.18) 0%, transparent 60%)",
              pointerEvents:"none",
            }} />
            <div style={{
              position:"absolute", bottom:30, left:-50, width:180, height:180, borderRadius:"50%",
              background:"radial-gradient(circle, rgba(196,74,135,0.12) 0%, transparent 60%)",
              pointerEvents:"none",
            }} />

            {/* ── Hero Content ── */}
            <div style={{
              position:"relative", zIndex:2,
              padding:"52px 22px 72px",
              animation:"contentDrift 0.9s cubic-bezier(0.22,1,0.36,1) 0.2s both",
            }}>

              {/* Top row: greeting + logo */}
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:16 }}>

                <div>
                  {/* Greeting line */}
                  <div style={{
                    display:"inline-flex", alignItems:"center", gap:6,
                    marginBottom:6,
                  }}>
                    <span style={{ fontSize:12 }}>{greetingIcon}</span>
                    <span style={{
                      fontSize:9, fontWeight:500, letterSpacing:"0.26em",
                      textTransform:"uppercase", color:"rgba(255,255,255,0.7)",
                    }}>{greeting}</span>
                  </div>

                  {/* Guest name */}
                  <h1 style={{
                    fontFamily:"'Cormorant Garamond', serif",
                    fontSize:36, fontWeight:300, fontStyle:"italic",
                    color:"#fff", lineHeight:1, margin:0,
                    textShadow:"0 2px 20px rgba(0,0,0,0.5)",
                    letterSpacing:"-0.01em",
                  }}>
                    {guest?.name || "Valued Guest"}
                  </h1>
                </div>

                {/* Logo circle */}
                <div style={{
                  width:52, height:52, flexShrink:0,
                  borderRadius:"50%",
                  background:"rgba(255,255,255,0.12)",
                  backdropFilter:"blur(20px)",
                  border:"1px solid rgba(255,255,255,0.25)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  boxShadow:"0 4px 20px rgba(0,0,0,0.25)",
                }}>
                  <img src={logo} alt="Logo" style={{
                    width:33, height:33, objectFit:"contain",
                    filter:"brightness(0) invert(1)", opacity:0.92,
                  }} />
                </div>
              </div>

              {/* Bottom row: room badge + check-in info */}
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                {/* Room pill */}
                <div style={{
                  display:"inline-flex", alignItems:"center", gap:7,
                  background:"rgba(255,255,255,0.1)",
                  backdropFilter:"blur(14px)",
                  border:"1px solid rgba(255,255,255,0.2)",
                  borderRadius:24, padding:"6px 14px",
                }}>
                  <span style={{
                    width:6, height:6, borderRadius:"50%",
                    background:"#86efac",
                    animation:"pulseDot 2s ease-in-out infinite",
                  }} />
                  <span style={{
                    fontSize:10, fontWeight:600, color:"#fff",
                    letterSpacing:"0.16em", textTransform:"uppercase",
                  }}>Room {guest?.roomNumber}</span>
                </div>

                {/* Divider dot */}
                <div style={{ width:3, height:3, borderRadius:"50%", background:"rgba(255,255,255,0.3)" }} />

                {/* Centre Point label */}
                <span style={{
                  fontSize:9, color:"rgba(255,255,255,0.55)",
                  fontWeight:400, letterSpacing:"0.06em",
                }}>Centre Point Nagpur</span>
              </div>
            </div>

            {/* ── Elegant wave transition ── */}
            <div style={{ position:"absolute", bottom:-1, left:0, right:0, zIndex:3, lineHeight:0 }}>
              <svg viewBox="0 0 430 72" fill="none" preserveAspectRatio="none" style={{ width:"100%", height:72, display:"block" }}>
                <path d="M0 24 C55 66, 115 72, 180 46 C230 24, 285 6, 345 38 C378 58, 410 58, 430 42 L430 72 L0 72 Z" fill="var(--cream)" />
                <path className="wave-glow"
                  d="M0 24 C55 66, 115 72, 180 46 C230 24, 285 6, 345 38 C378 58, 410 58, 430 42"
                  fill="none" stroke="url(#wg2)" strokeWidth="8" strokeLinecap="round" />
                <path className="wave-base"
                  d="M0 24 C55 66, 115 72, 180 46 C230 24, 285 6, 345 38 C378 58, 410 58, 430 42"
                  fill="none" stroke="url(#wg1)" strokeWidth="1.8" strokeLinecap="round" />
                <path className="wave-shimmer"
                  d="M0 24 C55 66, 115 72, 180 46 C230 24, 285 6, 345 38 C378 58, 410 58, 430 42"
                  fill="none" stroke="url(#wg3)" strokeWidth="3.5" strokeLinecap="round" />
                <defs>
                  <linearGradient id="wg1" x1="0" y1="0" x2="430" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="transparent" />
                    <stop offset="15%" stopColor="#A4005D" stopOpacity="0.5" />
                    <stop offset="50%" stopColor="#D44F93" stopOpacity="0.9" />
                    <stop offset="85%" stopColor="#A4005D" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                  <linearGradient id="wg2" x1="0" y1="0" x2="430" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="transparent" />
                    <stop offset="40%" stopColor="#C44A87" stopOpacity="0.25" />
                    <stop offset="60%" stopColor="#D44F93" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                  <linearGradient id="wg3" x1="0" y1="0" x2="430" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="transparent" />
                    <stop offset="42%" stopColor="#C44A87" stopOpacity="0.6" />
                    <stop offset="50%" stopColor="#fff" stopOpacity="0.9" />
                    <stop offset="58%" stopColor="#C44A87" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          {/* end hero */}

          {/* ════════════════════════════════════════
              BODY
          ════════════════════════════════════════ */}
          <div style={{ background:"var(--cream)" }}>

            {/* ── QUICK ACTIONS ── */}
            <div style={{ padding:"20px 18px 0" }}>
              <p style={{
                fontSize:9, fontWeight:600, letterSpacing:"0.22em",
                textTransform:"uppercase", color:"var(--text-light)",
                marginBottom:12,
                animation: bodyVisible ? "fadeUp 0.5s ease both" : "none",
              }}>Quick Actions</p>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                {/* Food Order */}
                {[
                  {
                    label:"Food Order", sub:"In-room dining",
                    route:"/guest/menu",
                    accentColor:"#A4005D",
                    accent:"linear-gradient(135deg,#A4005D,#C44A87)",
                    delay:0,
                    icon:(
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width:26, height:26 }}>
                        <path d="M3 11l19-9-9 19-2-8-8-2z" />
                      </svg>
                    ),
                  },
                  {
                    label:"Housekeeping", sub:"Room essentials",
                    route:"/guest/housekeeping",
                    accentColor:"#b07d2a",
                    accent:"linear-gradient(135deg,#c9a96e,#b07d2a)",
                    delay:80,
                    icon:(
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width:26, height:26 }}>
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                    ),
                  },
                ].map((action, i) => (
                  <button
                    key={action.label}
                    onClick={() => navigate(action.route)}
                    className="action-card shimmer-card"
                    style={{
                      background:"#fff", borderRadius:22, padding:"18px 16px 16px",
                      display:"flex", flexDirection:"column", alignItems:"flex-start",
                      border:"1px solid rgba(164,0,93,0.06)",
                      boxShadow:"var(--card-shadow)",
                      cursor:"pointer", minHeight:136, textAlign:"left",
                      position:"relative", overflow:"hidden",
                      animation: bodyVisible ? `fadeUp 0.55s cubic-bezier(0.22,1,0.36,1) ${action.delay}ms both` : "none",
                    }}
                  >
                    {/* Top gradient stripe */}
                    <div style={{
                      position:"absolute", top:0, left:0, right:0, height:3,
                      background:action.accent, borderRadius:"22px 22px 0 0",
                    }} />

                    {/* Icon */}
                    <div style={{
                      width:46, height:46, borderRadius:14,
                      background:`linear-gradient(135deg,rgba(${action.accentColor === "#A4005D" ? "164,0,93" : "176,125,42"},0.1),rgba(${action.accentColor === "#A4005D" ? "196,74,135" : "201,169,110"},0.12))`,
                      border:`1.5px solid rgba(${action.accentColor === "#A4005D" ? "164,0,93" : "176,125,42"},0.14)`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      color:action.accentColor, marginBottom:14,
                    }}>
                      {action.icon}
                    </div>

                    <p style={{
                      fontFamily:"'Cormorant Garamond', serif",
                      fontSize:18, fontWeight:600, color:"var(--text)",
                      lineHeight:1.1, marginBottom:3,
                    }}>{action.label}</p>
                    <p style={{
                      fontSize:10, color:"var(--text-light)",
                      fontWeight:400, letterSpacing:"0.02em",
                    }}>{action.sub}</p>

                    {/* Arrow */}
                    <div style={{
                      position:"absolute", bottom:14, right:14,
                      width:24, height:24, borderRadius:"50%",
                      background:`rgba(${action.accentColor === "#A4005D" ? "164,0,93" : "176,125,42"},0.08)`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      color:action.accentColor, fontSize:12,
                    }}>›</div>
                  </button>
                ))}
              </div>
            </div>

            {/* ── Section Divider ── */}
            <SectionDivider />

            {/* ── UPCOMING EVENTS ── */}
            <div style={{ paddingTop:4 }}>
              <div style={{
                display:"flex", alignItems:"center", justifyContent:"space-between",
                padding:"0 18px", marginBottom:14,
                animation: bodyVisible ? "fadeUp 0.5s ease 0.1s both" : "none",
              }}>
                <p style={{
                  fontSize:9, fontWeight:600, letterSpacing:"0.22em",
                  textTransform:"uppercase", color:"var(--text-light)", margin:0,
                }}>Upcoming Events</p>
                <button onClick={() => navigate("/guest/events")} style={{
                  fontSize:10, color:"var(--rose)", fontWeight:600,
                  background:"none", border:"none", cursor:"pointer",
                  letterSpacing:"0.04em", display:"flex", alignItems:"center", gap:3,
                }}>
                  View All <span style={{ fontSize:14, lineHeight:1 }}>›</span>
                </button>
              </div>

              {upcomingEvents.length === 0 ? (
                <div style={{ padding:"0 18px 10px" }}>
                  <div style={{
                    background:"#fff", borderRadius:18, padding:"28px 20px",
                    textAlign:"center", border:"1px solid rgba(164,0,93,0.06)",
                    boxShadow:"var(--card-shadow)",
                  }}>
                    <div style={{ fontSize:28, marginBottom:8 }}>🎭</div>
                    <p style={{
                      fontFamily:"'Cormorant Garamond', serif",
                      fontSize:16, color:"var(--text-mid)", fontWeight:300, fontStyle:"italic",
                      margin:0,
                    }}>No upcoming events</p>
                    <p style={{ fontSize:10, color:"var(--text-light)", marginTop:4, marginBottom:0 }}>
                      Check back soon
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ padding:"0 18px" }}>
                    {/* Card container */}
                    <div style={{
                      position:"relative", width:"100%",
                      aspectRatio:"16/9", borderRadius:20,
                      overflow:"hidden",
                      boxShadow:"0 12px 40px rgba(26,20,16,0.18)",
                    }}
                      onTouchStart={handleTouchStart}
                      onTouchEnd={handleTouchEnd}
                    >
                      {upcomingEvents.map((ev, i) => {
                        const evTime = ev.eventTime || "";
                        const evDate = formatEventDate(ev);
                        const bg = ev.gradient || eventGradients[i % eventGradients.length];
                        const isActive = i === currentEventIndex;
                        const wasActive = i === (currentEventIndex - 1 + upcomingEvents.length) % upcomingEvents.length;
                        return (
                          <div
                            key={ev.id || ev._id || i}
                            className={`event-card-wrapper ${isActive ? "active" : wasActive ? "exit" : ""}`}
                            onClick={() => navigate("/guest/events")}
                            style={{ background:bg, cursor:"pointer" }}
                          >
                            {ev.image && (
                              <>
                                <img src={ev.image} alt={ev.title || ev.name} style={{
                                  position:"absolute", inset:0, width:"100%", height:"100%",
                                  objectFit:"cover", objectPosition:"center", zIndex:0,
                                }} />
                                <div style={{
                                  position:"absolute", inset:0, zIndex:1,
                                  background:"linear-gradient(to bottom, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.04) 35%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,0.85) 100%)",
                                }} />
                              </>
                            )}
                            {!ev.image && (
                              <div style={{
                                position:"absolute", inset:0, zIndex:1,
                                background:"radial-gradient(ellipse at 65% 15%, rgba(255,255,255,0.14) 0%, transparent 55%)",
                              }} />
                            )}

                            {/* Content */}
                            <div style={{
                              position:"relative", zIndex:2,
                              padding:"14px 16px 16px",
                              height:"100%", display:"flex", flexDirection:"column", justifyContent:"flex-end",
                            }}>
                              {ev.tag && (
                                <div style={{
                                  position:"absolute", top:14, left:16,
                                  fontSize:8, fontWeight:700, letterSpacing:"0.14em",
                                  textTransform:"uppercase", padding:"3px 9px", borderRadius:6,
                                  background:"rgba(255,255,255,0.15)", color:"rgba(255,255,255,0.9)",
                                  border:"1px solid rgba(255,255,255,0.22)", backdropFilter:"blur(8px)",
                                  animation:"tagPop 0.4s ease both",
                                }}>{ev.tag}</div>
                              )}
                              <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
                                {(evDate || evTime) && (
                                  <div style={{
                                    display:"inline-flex", alignItems:"center", gap:6,
                                    background:"rgba(0,0,0,0.32)", backdropFilter:"blur(8px)",
                                    border:"1px solid rgba(249,168,212,0.2)",
                                    borderRadius:6, padding:"3px 9px", alignSelf:"flex-start",
                                  }}>
                                    {evDate && <span style={{ fontSize:9, fontWeight:700, color:"#F9A8D4", letterSpacing:"0.14em", textTransform:"uppercase" }}>{evDate}</span>}
                                    {evDate && evTime && <span style={{ fontSize:8, color:"rgba(249,168,212,0.35)", fontWeight:300 }}>·</span>}
                                    {evTime && <span style={{ fontSize:9, fontWeight:500, color:"rgba(255,255,255,0.78)", letterSpacing:"0.04em" }}>{evTime}</span>}
                                  </div>
                                )}
                                <p style={{
                                  fontFamily:"'Cormorant Garamond', serif",
                                  fontSize:22, fontWeight:700, color:"#fff", lineHeight:1.1, margin:0,
                                  textShadow:"0 2px 16px rgba(0,0,0,0.55)",
                                }}>{ev.title || ev.name}</p>
                                {ev.description && (
                                  <p style={{
                                    fontSize:11, color:"rgba(255,255,255,0.68)", fontWeight:400,
                                    lineHeight:1.4, margin:0,
                                    display:"-webkit-box", WebkitLineClamp:1,
                                    WebkitBoxOrient:"vertical", overflow:"hidden",
                                  }}>{ev.description}</p>
                                )}
                                {(ev.location || ev.venue) && (
                                  <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="#F9A8D4" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width:10, height:10, flexShrink:0 }}>
                                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                      <circle cx="12" cy="10" r="3" />
                                    </svg>
                                    <span style={{ fontSize:10, color:"rgba(255,255,255,0.65)", fontWeight:400 }}>
                                      {ev.location || ev.venue}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Progress dots */}
                  <div style={{ display:"flex", justifyContent:"center", gap:5, marginTop:12, paddingBottom:2 }}>
                    {upcomingEvents.map((_, i) => (
                      <button key={i} onClick={() => setCurrentEventIndex(i)} style={{
                        width: i === currentEventIndex ? 20 : 5,
                        height:5, borderRadius:3,
                        background: i === currentEventIndex ? "var(--rose)" : "rgba(164,0,93,0.2)",
                        transition:"all 0.3s cubic-bezier(0.22,1,0.36,1)",
                        cursor:"pointer", border:"none", padding:0,
                      }} />
                    ))}
                  </div>
                </>
              )}
            </div>

            <SectionDivider />

            {/* ── YOUR ORDERS ── */}
            <div style={{ padding:"4px 18px 0" }}>
              <div style={{
                display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12,
                animation: bodyVisible ? "fadeUp 0.5s ease 0.15s both" : "none",
              }}>
                <p style={{
                  fontSize:9, fontWeight:600, letterSpacing:"0.22em",
                  textTransform:"uppercase", color:"var(--text-light)", margin:0,
                }}>Your Orders</p>
                <button onClick={() => navigate("/guest/orders")} style={{
                  fontSize:10, color:"var(--rose)", fontWeight:600,
                  background:"none", border:"none", cursor:"pointer",
                  display:"flex", alignItems:"center", gap:3,
                }}>
                  View All <span style={{ fontSize:14, lineHeight:1 }}>›</span>
                </button>
              </div>

              {hasActiveOrder ? (
                <div style={{
                  background:"#fff", borderRadius:20,
                  border:"1px solid rgba(164,0,93,0.08)",
                  boxShadow:"var(--card-shadow)", padding:"16px 18px",
                  animation:"fadeUp 0.5s ease both",
                }}>
                  {/* order content */}
                </div>
              ) : (
                <div style={{
                  background:"#fff", borderRadius:20,
                  border:"1px solid rgba(164,0,93,0.06)",
                  boxShadow:"var(--card-shadow)",
                  padding:"16px 18px",
                  display:"flex", alignItems:"center", gap:14,
                  animation: bodyVisible ? "fadeUp 0.55s ease 0.2s both" : "none",
                }}>
                  <div style={{
                    width:46, height:46, flexShrink:0, borderRadius:14,
                    background:"linear-gradient(135deg,rgba(164,0,93,0.07),rgba(196,74,135,0.1))",
                    border:"1.5px solid rgba(164,0,93,0.1)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    color:"var(--rose)",
                  }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width:22, height:22 }}>
                      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                      <rect x="9" y="3" width="6" height="4" rx="1" />
                      <path d="M9 12h6" /><path d="M9 16h4" />
                    </svg>
                  </div>
                  <div style={{ flex:1 }}>
                    <p style={{
                      fontFamily:"'Cormorant Garamond', serif",
                      fontSize:16, fontWeight:600, color:"var(--text)",
                      margin:"0 0 3px 0",
                    }}>No active orders</p>
                    <p style={{ fontSize:10, color:"var(--text-light)", fontWeight:400, margin:0 }}>
                      Your requests will appear here
                    </p>
                  </div>
                  <button onClick={() => navigate("/guest/menu")} style={{
                    flexShrink:0, padding:"7px 14px", borderRadius:12,
                    background:"linear-gradient(135deg,#A4005D,#C44A87)",
                    color:"#fff", border:"none", cursor:"pointer",
                    fontSize:11, fontWeight:600, letterSpacing:"0.03em",
                    boxShadow:"0 3px 12px rgba(164,0,93,0.28)",
                  }}>Order</button>
                </div>
              )}
            </div>

            <SectionDivider />

            {/* ── EXPLORE ── */}
            <div style={{ padding:"4px 18px 28px" }}>
              <p style={{
                fontSize:9, fontWeight:600, letterSpacing:"0.22em",
                textTransform:"uppercase", color:"var(--text-light)",
                marginBottom:12,
                animation: bodyVisible ? "fadeUp 0.5s ease 0.2s both" : "none",
              }}>Explore</p>

              <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
                {[
                  {
                    label:"All Events", sub:"Experiences & activities",
                    route:"/guest/events",
                    delay:250,
                    icon:(
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width:22, height:22 }}>
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                        <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
                      </svg>
                    ),
                  },
                  {
                    label:"Amenities", sub:"Facilities & services",
                    route:"/guest/hotel-info",
                    delay:320,
                    icon:(
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width:22, height:22 }}>
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <path d="M9 22V12h6v10" />
                      </svg>
                    ),
                  },
                ].map((item, i) => (
                  <button
                    key={item.label}
                    onClick={() => navigate(item.route)}
                    className="explore-row"
                    style={{
                      display:"flex", alignItems:"center", gap:14,
                      width:"100%", background:"#fff", borderRadius:18,
                      padding:"14px 16px",
                      border:"1px solid rgba(164,0,93,0.06)",
                      boxShadow:"var(--card-shadow)",
                      cursor:"pointer", textAlign:"left",
                      animation: bodyVisible ? `rowSlide 0.5s cubic-bezier(0.22,1,0.36,1) ${item.delay}ms both` : "none",
                    }}
                  >
                    <div style={{
                      width:44, height:44, flexShrink:0, borderRadius:13,
                      background:"linear-gradient(135deg,rgba(164,0,93,0.07),rgba(196,74,135,0.1))",
                      border:"1.5px solid rgba(164,0,93,0.1)",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      color:"var(--rose)",
                    }}>{item.icon}</div>

                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{
                        fontFamily:"'Cormorant Garamond', serif",
                        fontSize:17, fontWeight:600, color:"var(--text)",
                        margin:"0 0 2px 0", lineHeight:1.1,
                      }}>{item.label}</p>
                      <p style={{ fontSize:10, color:"var(--text-light)", fontWeight:400, margin:0 }}>
                        {item.sub}
                      </p>
                    </div>

                    <div style={{
                      width:30, height:30, borderRadius:"50%", flexShrink:0,
                      background:"var(--rose-pale)",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      color:"var(--rose)", fontSize:16, fontWeight:300,
                    }}>›</div>
                  </button>
                ))}
              </div>
            </div>

          </div>
          {/* end body */}
        </div>
        {/* end scroll */}

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            BOTTOM NAV
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div style={{
          flexShrink:0,
          background:"rgba(248,238,228,0.97)", backdropFilter:"blur(24px)",
          borderTop:"1px solid rgba(164,0,93,0.1)",
          boxShadow:"0 -4px 24px rgba(26,20,16,0.07)",
          maxWidth:430, width:"100%", margin:"0 auto",
          paddingBottom:"env(safe-area-inset-bottom, 0px)",
        }}>
          <div style={{
            display:"flex", alignItems:"center", justifyContent:"space-around",
            padding:"8px 8px 6px",
          }}>
            {navItems.map((item) => {
              const isActive = activeNav === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => { setActiveNav(item.key); navigate(item.route); }}
                  className="nav-btn"
                  style={{
                    position:"relative",
                    display:"flex", flexDirection:"column", alignItems:"center", gap:3,
                    padding:"6px 26px", borderRadius:16,
                    background: isActive ? "rgba(164,0,93,0.08)" : "transparent",
                    border:"none", cursor:"pointer",
                  }}
                >
                  <span style={{
                    color: isActive ? "var(--rose)" : "var(--text-light)",
                    transition:"color 0.2s ease",
                  }}>{item.icon(isActive)}</span>
                  <span style={{
                    fontSize:7, fontWeight:700, letterSpacing:"0.14em",
                    textTransform:"uppercase",
                    color: isActive ? "var(--rose)" : "var(--text-light)",
                    transition:"color 0.2s ease",
                  }}>{item.label}</span>
                  {isActive && (
                    <div style={{
                      position:"absolute", bottom:0, left:"50%",
                      transform:"translateX(-50%)",
                      width:16, height:2, borderRadius:1,
                      background:"var(--rose)",
                    }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </>
  );
}

// ── Reusable section divider ──────────────────────────────────────────
function SectionDivider() {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, margin:"22px 18px" }}>
      <div style={{ flex:1, height:"1px", background:"linear-gradient(to right, transparent, rgba(164,0,93,0.15), transparent)" }} />
      <div style={{
        width:4, height:4,
        background:"rgba(164,0,93,0.25)",
        transform:"rotate(45deg)", flexShrink:0,
      }} />
      <div style={{ flex:1, height:"1px", background:"linear-gradient(to right, transparent, rgba(164,0,93,0.15), transparent)" }} />
    </div>
  );
}