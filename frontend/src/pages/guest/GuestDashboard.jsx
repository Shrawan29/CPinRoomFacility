import { useNavigate } from "react-router-dom";
import { useGuestAuth } from "../../context/GuestAuthContext";
import GuestBottomNav from "../../components/guest/GuestBottomNav";
import hotelbg from "../../assets/hotel-bg.jpg";
import logo from "../../assets/logo.png";

import { useEffect, useState, useRef } from "react";
import { getGuestEvents } from "../../services/event.service";

const FoodIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
    <path d="M6 18h12" /><path d="M7 18v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1" />
    <path d="M8 12h8" /><path d="M5 12a7 7 0 0 1 14 0" /><path d="M12 9v-1" />
  </svg>
);

const HouseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z" />
    <path d="M9 21V12h6v9" />
  </svg>
);

export default function GuestDashboard() {
  const { guest, loading } = useGuestAuth();
  const navigate = useNavigate();
  const [fadeIn, setFadeIn] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const autoRef = useRef(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [exitIndex, setExitIndex] = useState(null);

  useEffect(() => {
    const t1 = setTimeout(() => setFadeIn(true), 50);
    const t2 = setTimeout(() => setCardsVisible(true), 300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    if (!loading && !guest) navigate("/guest/login");
  }, [guest, loading, navigate]);

  useEffect(() => {
    getGuestEvents().then((data) => setUpcomingEvents(data || []));
  }, []);

  const goToEvent = (i) => {
    if (i === currentEventIndex) return;
    setExitIndex(currentEventIndex);
    setCurrentEventIndex(i);
    setTimeout(() => setExitIndex(null), 700);
  };

  useEffect(() => {
    if (upcomingEvents.length === 0) return;
    autoRef.current = setInterval(() => {
      setCurrentEventIndex((prev) => {
        const next = (prev + 1) % upcomingEvents.length;
        setExitIndex(prev);
        setTimeout(() => setExitIndex(null), 700);
        return next;
      });
    }, 4500);
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, [upcomingEvents.length]);

  const touchStartRef = useRef(0);
  const handleTouchStart = (e) => { touchStartRef.current = e.changedTouches[0].clientX; };
  const handleTouchEnd = (e) => {
    const distance = touchStartRef.current - e.changedTouches[0].clientX;
    if (Math.abs(distance) < 50) return;
    clearInterval(autoRef.current);
    if (distance > 0) goToEvent((currentEventIndex + 1) % upcomingEvents.length);
    else goToEvent((currentEventIndex - 1 + upcomingEvents.length) % upcomingEvents.length);
    setTimeout(() => {
      autoRef.current = setInterval(() => {
        setCurrentEventIndex((prev) => {
          const next = (prev + 1) % upcomingEvents.length;
          setExitIndex(prev);
          setTimeout(() => setExitIndex(null), 700);
          return next;
        });
      }, 4500);
    }, 5000);
  };

  const hour = new Date().getHours();
  const greeting = hour < 5 ? "Good Night" : hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  const formatEventTime = (ev) => ev.eventTime || "";
  const formatEventDate = (ev) => {
    if (ev.eventDate) {
      const d = new Date(ev.eventDate);
      const today = new Date();
      const tomorrow = new Date(); tomorrow.setDate(today.getDate() + 1);
      if (d.toDateString() === today.toDateString()) return "Tonight";
      if (d.toDateString() === tomorrow.toDateString()) return "Tomorrow";
      return d.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
    }
    return "";
  };

  const eventGradients = [
    "linear-gradient(155deg,#3b0764 0%,#7c3aed 40%,#be185d 100%)",
    "linear-gradient(155deg,#064e3b 0%,#047857 40%,#0e7490 100%)",
    "linear-gradient(155deg,#431407 0%,#9a3412 40%,#c9a96e 100%)",
    "linear-gradient(155deg,#082036 0%,#1a6a8a 60%,#0e4a6e 100%)",
    "linear-gradient(155deg,#0e2e0e 0%,#2d6b2d 60%,#1a5a3a 100%)",
  ];

  const quickActions = [
    { icon: <FoodIcon />, label: "Food Order", sub: "In-room dining", route: "/guest/menu", accent: "linear-gradient(90deg,#9d174d,#be185d,#ec4899)", iconBg: "rgba(190,24,93,0.07)", iconColor: "#be185d", orb: "radial-gradient(circle,#be185d,transparent)" },
    { icon: <HouseIcon />, label: "Housekeeping", sub: "Room essentials", route: "/guest/housekeeping", accent: "linear-gradient(90deg,#7a5a14,#c9a96e,#e4c98a)", iconBg: "rgba(160,120,40,0.08)", iconColor: "#a07828", orb: "radial-gradient(circle,#a07828,transparent)" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600&family=Jost:wght@200;300;400;500;600&display=swap');
        * { -webkit-font-smoothing: antialiased; box-sizing: border-box; }

        @keyframes heroFade { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes float1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(10px,-12px)} }
        @keyframes float2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-8px,10px)} }
        @keyframes float3 { 0%,100%{transform:translate(0,0)} 60%{transform:translate(7px,8px)} }
        @keyframes pulseBeat { 0%,100%{transform:scale(1)} 50%{transform:scale(.6);opacity:.5} }
        @keyframes pulseRing { 0%,100%{opacity:.3} 50%{opacity:.7} }
        @keyframes lineGlow { 0%,100%{opacity:.3} 50%{opacity:.7} }

        @keyframes waveDraw { 0%{stroke-dashoffset:1400;opacity:0} 5%{opacity:1} 100%{stroke-dashoffset:0;opacity:1} }
        @keyframes waveGlow { 0%,100%{opacity:.4} 50%{opacity:.85} }
        @keyframes waveRace { 0%{stroke-dashoffset:700} 100%{stroke-dashoffset:-700} }
        @keyframes waveAura { 0%,100%{opacity:.14;stroke-width:10px} 50%{opacity:.26;stroke-width:14px} }
        @keyframes waveRace2 { 0%{stroke-dashoffset:-400} 100%{stroke-dashoffset:400} }
        @keyframes din { from{opacity:0} to{opacity:1} }

        .wb { stroke-dasharray:1400; stroke-dashoffset:1400; animation:waveDraw 2.8s cubic-bezier(.16,1,.3,1) .2s forwards; }
        .wg { opacity:0; animation:waveGlow 4.5s ease-in-out 3.1s infinite, din .8s ease 3s forwards; }
        .wa { opacity:0; animation:waveAura 6s ease-in-out 3.1s infinite, din 1s ease 3s forwards; }
        .wr { stroke-dasharray:130 1270; stroke-dashoffset:700; opacity:0; animation:waveRace 3.2s linear 3.1s infinite, din .6s ease 3s forwards; }
        .wr2 { stroke-dasharray:60 1340; stroke-dashoffset:-400; opacity:0; animation:waveRace2 5.5s linear 3.3s infinite, din .7s ease 3.2s forwards; }

        @keyframes cardSlideIn { from{opacity:0;transform:translateX(26px)} to{opacity:1;transform:translateX(0)} }
        @keyframes cardSlideOut { from{opacity:1;transform:translateX(0)} to{opacity:0;transform:translateX(-26px)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideRight { from{opacity:0;transform:translateX(-16px)} to{opacity:1;transform:translateX(0)} }
        @keyframes shimmer { 0%{transform:translateX(-130%)} 100%{transform:translateX(130%)} }

        .event-active { animation: cardSlideIn .65s cubic-bezier(.22,1,.36,1) forwards; z-index:1; }
        .event-exit   { animation: cardSlideOut .65s cubic-bezier(.22,1,.36,1) forwards; z-index:0; }

        .ac-card {
          position:relative; overflow:hidden;
          background:linear-gradient(145deg,rgba(255,250,244,0.92) 0%,rgba(250,240,226,0.88) 100%);
          border:1px solid rgba(255,255,255,0.72);
          border-radius:24px; padding:22px 18px 20px;
          display:flex; flex-direction:column; align-items:flex-start;
          cursor:pointer; min-height:150px; text-align:left;
          box-shadow:0 8px 32px rgba(100,60,20,.13),0 2px 8px rgba(100,60,20,.06),inset 0 1px 0 rgba(255,255,255,.8);
          backdrop-filter:blur(10px);
          transition:transform .25s cubic-bezier(.22,1,.36,1),box-shadow .25s ease,border-color .25s ease;
        }
        .ac-card:hover { transform:translateY(-4px); box-shadow:0 20px 60px rgba(100,60,20,.18),0 4px 16px rgba(100,60,20,.08),inset 0 1px 0 rgba(255,255,255,.8); border-color:rgba(255,255,255,.9); }
        .ac-card:active { transform:scale(.96); }
        .ac-shimmer { position:absolute;inset:0;background:linear-gradient(105deg,transparent 36%,rgba(255,255,255,.6) 50%,transparent 64%);transform:translateX(-130%);pointer-events:none;border-radius:inherit; }
        .ac-card:hover .ac-shimmer { animation:shimmer .6s ease forwards; }
        .ac-card:hover .ac-arrow { color:#a07828; transform:translateX(2px); }

        .xr-btn {
          display:flex; align-items:center; gap:14px; width:100%;
          background:linear-gradient(145deg,rgba(255,250,244,0.92),rgba(250,240,226,0.88));
          border:1px solid rgba(255,255,255,0.72); border-radius:20px; padding:16px 18px;
          cursor:pointer; text-align:left;
          box-shadow:0 8px 32px rgba(100,60,20,.13),inset 0 1px 0 rgba(255,255,255,.8);
          backdrop-filter:blur(10px);
          transition:transform .22s cubic-bezier(.22,1,.36,1),box-shadow .22s ease;
        }
        .xr-btn:hover { transform:translateX(4px); box-shadow:0 20px 60px rgba(100,60,20,.18),inset 0 1px 0 rgba(255,255,255,.8); }
        .xr-btn:active { transform:scale(.98); }
        .xr-btn:hover .xr-arrow { color:#a07828; transform:translateX(3px); }

        .dot-btn { height:4px; border-radius:3px; width:4px; background:rgba(120,80,40,.2); border:none; cursor:pointer; padding:0; transition:all .35s cubic-bezier(.22,1,.36,1); }
        .dot-btn.active { width:22px; background:#be185d; }

        .medring { animation: pulseRing 3.5s ease-in-out infinite; }
        .cdot-beat { animation: pulseBeat 2.2s ease-in-out infinite; }
        .fl1 { animation: lineGlow 5s ease-in-out infinite; }
        .fl2 { animation: lineGlow 5s ease-in-out 1.5s infinite; }
      `}</style>

      <div style={{
        position: "fixed", inset: 0,
        display: "flex", flexDirection: "column",
        background: "#ede3d4",
        opacity: fadeIn ? 1 : 0,
        transition: "opacity 0.5s ease",
        paddingBottom: "env(safe-area-inset-bottom)",
        fontFamily: "'Jost', system-ui, sans-serif",
      }}>
        <div style={{
          flex: 1, overflowY: "auto", overflowX: "hidden",
          maxWidth: 430, width: "100%", margin: "0 auto",
          paddingBottom: "80px", scrollbarWidth: "none",
        }}>

          {/* ══ HERO ══ */}
          <div style={{
            position: "relative", overflow: "hidden", minHeight: 272,
            background: "linear-gradient(148deg,#180008 0%,#500028 26%,#802000 58%,#220c00 100%)",
            animation: "heroFade 0.65s cubic-bezier(0.22,1,0.36,1) both",
          }}>
            {/* Noise texture overlay */}
            <div style={{
              position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`,
              opacity: .5,
            }} />

            {/* Orbs */}
            <div style={{ position:"absolute", top:-90, right:-60, width:290, height:290, borderRadius:"50%", background:"radial-gradient(circle,rgba(190,24,93,.4) 0%,transparent 65%)", animation:"float1 8s ease-in-out infinite", zIndex:2, filter:"blur(2px)", pointerEvents:"none" }} />
            <div style={{ position:"absolute", bottom:-30, left:-80, width:250, height:250, borderRadius:"50%", background:"radial-gradient(circle,rgba(160,80,0,.32) 0%,transparent 65%)", animation:"float2 11s ease-in-out infinite", zIndex:2, filter:"blur(2px)", pointerEvents:"none" }} />
            <div style={{ position:"absolute", top:"28%", right:"12%", width:130, height:130, borderRadius:"50%", background:"radial-gradient(circle,rgba(201,169,110,.22) 0%,transparent 60%)", animation:"float3 13s ease-in-out infinite", zIndex:2, pointerEvents:"none" }} />

            {/* Scan lines */}
            <div style={{ position:"absolute", inset:0, zIndex:2, pointerEvents:"none", overflow:"hidden" }}>
              <div className="fl1" style={{ position:"absolute", top:"30%", width:"100%", height:1, background:"linear-gradient(90deg,transparent,rgba(201,169,110,.2),transparent)" }} />
              <div className="fl2" style={{ position:"absolute", top:"63%", width:"68%", right:0, height:1, background:"linear-gradient(90deg,transparent,rgba(201,169,110,.2),transparent)" }} />
            </div>

            {/* Hero content */}
            <div style={{ position:"relative", zIndex:4, padding:"50px 22px 72px" }}>
              {/* Eyebrow */}
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
                <div style={{ width:22, height:1, background:"#c9a96e", opacity:.7 }} />
                <span style={{ fontSize:9, fontWeight:500, letterSpacing:".3em", textTransform:"uppercase", color:"#c9a96e" }}>Centre Point Nagpur</span>
                <div style={{ width:22, height:1, background:"#c9a96e", opacity:.7 }} />
              </div>

              {/* Name row */}
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:20 }}>
                <div>
                  <span style={{ display:"block", fontSize:12, fontStyle:"normal", fontWeight:300, fontFamily:"'Jost',sans-serif", letterSpacing:".16em", textTransform:"uppercase", color:"rgba(255,255,255,.52)", marginBottom:6 }}>
                    {greeting}
                  </span>
                  <h1 style={{
                    fontFamily:"'Cormorant Garamond',serif", fontSize:44, fontWeight:300, fontStyle:"italic",
                    color:"rgba(255,255,255,.97)", lineHeight:.93, letterSpacing:"-.02em",
                    textShadow:"0 6px 36px rgba(0,0,0,.55)", margin:0,
                  }}>
                    {guest?.name || "Valued Guest"}
                  </h1>
                </div>

                {/* Medallion */}
                <div style={{ flexShrink:0, width:58, height:58, borderRadius:"50%", position:"relative", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <div className="medring" style={{ position:"absolute", inset:-5, borderRadius:"50%", border:"1px solid rgba(201,169,110,.2)" }} />
                  <div style={{
                    width:52, height:52, borderRadius:"50%",
                    background:"rgba(255,255,255,.12)", backdropFilter:"blur(20px)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    border:"1px solid rgba(255,255,255,.18)",
                    boxShadow:"inset 0 1px 0 rgba(255,255,255,.22)",
                  }}>
                    <img src={logo} alt="Logo" style={{ width:30, height:30, objectFit:"contain", filter:"brightness(0) invert(1)", opacity:.95 }} />
                  </div>
                </div>
              </div>

              {/* Room chip */}
              <div style={{
                display:"inline-flex", alignItems:"center", gap:8,
                background:"rgba(255,255,255,.10)", backdropFilter:"blur(18px)",
                border:"1px solid rgba(255,255,255,.2)", borderRadius:100,
                padding:"7px 18px 7px 12px",
                boxShadow:"0 2px 14px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.1)",
              }}>
                <span className="cdot-beat" style={{ width:7, height:7, borderRadius:"50%", background:"#4ade80", flexShrink:0, boxShadow:"0 0 6px rgba(74,222,128,.7)" }} />
                <span style={{ fontSize:9, fontWeight:600, color:"rgba(255,255,255,.95)", letterSpacing:".2em", textTransform:"uppercase" }}>
                  ROOM {guest?.roomNumber}
                </span>
                <div style={{ width:1, height:12, background:"rgba(255,255,255,.22)" }} />
                <span style={{ fontSize:8, fontWeight:400, color:"rgba(255,255,255,.58)", letterSpacing:".08em" }}>Active Stay</span>
              </div>
            </div>

            {/* Wave */}
            <div style={{ position:"absolute", bottom:-1, left:0, right:0, zIndex:5, lineHeight:0 }}>
              <svg viewBox="0 0 430 82" fill="none" preserveAspectRatio="none" style={{ width:"100%", height:82, display:"block" }}>
                <path d="M0 28 C50 72,110 78,175 50 C225 28,280 10,340 42 C375 62,408 62,430 44 L430 82 L0 82 Z" fill="#ede3d4" />
                <path className="wa" d="M0 28 C50 72,110 78,175 50 C225 28,280 10,340 42 C375 62,408 62,430 44" fill="none" stroke="url(#wg2)" strokeWidth="12" strokeLinecap="round" />
                <path className="wb" d="M0 28 C50 72,110 78,175 50 C225 28,280 10,340 42 C375 62,408 62,430 44" fill="none" stroke="url(#wg1)" strokeWidth="2.2" strokeLinecap="round" />
                <path className="wg" d="M0 28 C50 72,110 78,175 50 C225 28,280 10,340 42 C375 62,408 62,430 44" fill="none" stroke="url(#wg2)" strokeWidth="7" strokeLinecap="round" />
                <path className="wr" d="M0 28 C50 72,110 78,175 50 C225 28,280 10,340 42 C375 62,408 62,430 44" fill="none" stroke="url(#wg3)" strokeWidth="4" strokeLinecap="round" />
                <path className="wr2" d="M0 28 C50 72,110 78,175 50 C225 28,280 10,340 42 C375 62,408 62,430 44" fill="none" stroke="url(#wg2)" strokeWidth="5" strokeLinecap="round" />
                <defs>
                  <linearGradient id="wg1" x1="0" y1="0" x2="430" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="transparent" /><stop offset="12%" stopColor="#be185d" stopOpacity=".65" />
                    <stop offset="42%" stopColor="#ec4899" /><stop offset="72%" stopColor="#be185d" stopOpacity=".75" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                  <linearGradient id="wg2" x1="0" y1="0" x2="430" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="transparent" /><stop offset="18%" stopColor="#be185d" stopOpacity=".22" />
                    <stop offset="50%" stopColor="#ec4899" stopOpacity=".32" /><stop offset="82%" stopColor="#be185d" stopOpacity=".18" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                  <linearGradient id="wg3" x1="0" y1="0" x2="430" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="transparent" /><stop offset="38%" stopColor="#c9a96e" stopOpacity=".75" />
                    <stop offset="52%" stopColor="#fff" stopOpacity="1" /><stop offset="66%" stopColor="#c9a96e" stopOpacity=".6" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* ══ BODY ══ */}
          <div style={{ background:"#ede3d4" }}>

            {/* QUICK ACTIONS */}
            <div style={{ padding:"22px 20px 0" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
                <div style={{ width:16, height:1, background:"#a07828", opacity:.6 }} />
                <span style={{ fontSize:8.5, fontWeight:600, letterSpacing:".28em", textTransform:"uppercase", color:"#a07828" }}>Quick Actions</span>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                {quickActions.map((action, i) => (
                  <button key={action.label} onClick={() => navigate(action.route)} className="ac-card"
                    style={{ animation: cardsVisible ? `slideUp .5s cubic-bezier(.22,1,.36,1) ${i * 80}ms both` : "none" }}
                  >
                    <div className="ac-shimmer" />
                    {/* Orb */}
                    <div style={{ position:"absolute", top:-28, right:-28, width:110, height:110, borderRadius:"50%", pointerEvents:"none", opacity:.16, filter:"blur(24px)", background:action.orb }} />
                    {/* Top stripe */}
                    <div style={{ position:"absolute", top:0, left:0, right:0, height:3, borderRadius:"24px 24px 0 0", background:action.accent }} />
                    {/* Icon */}
                    <div style={{
                      width:50, height:50, borderRadius:16,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      marginBottom:18, flexShrink:0,
                      background:action.iconBg, color:action.iconColor,
                      border:"1px solid rgba(255,255,255,.7)",
                      boxShadow:"0 2px 8px rgba(100,60,20,.08),0 1px 2px rgba(100,60,20,.04)",
                      position:"relative", overflow:"hidden",
                    }}>
                      <div style={{ position:"absolute", inset:0, background:"linear-gradient(145deg,rgba(255,255,255,.5) 0%,transparent 60%)" }} />
                      <span style={{ position:"relative", zIndex:1 }}>{action.icon}</span>
                    </div>
                    <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontWeight:600, color:"#1c110a", lineHeight:1.05, marginBottom:4 }}>{action.label}</p>
                    <p style={{ fontSize:10, fontWeight:300, color:"#a89080", letterSpacing:".04em" }}>{action.sub}</p>
                    <div className="ac-arrow" style={{ position:"absolute", bottom:17, right:17, width:28, height:28, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", border:"1px solid rgba(180,140,100,.2)", fontSize:14, color:"#a89080", background:"rgba(255,255,255,.5)", transition:"all .22s" }}>›</div>
                  </button>
                ))}
              </div>
            </div>

            {/* DIVIDER */}
            <div style={{ display:"flex", alignItems:"center", gap:10, margin:"26px 20px" }}>
              <div style={{ flex:1, height:1, background:"linear-gradient(to right,transparent,rgba(160,120,40,.2),transparent)" }} />
              <div style={{ width:5, height:5, flexShrink:0, background:"#a07828", opacity:.38, transform:"rotate(45deg)" }} />
              <div style={{ flex:1, height:1, background:"linear-gradient(to right,transparent,rgba(160,120,40,.2),transparent)" }} />
            </div>

            {/* UPCOMING EVENTS */}
            <div style={{ paddingTop:4 }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 20px", marginBottom:14 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ width:16, height:1, background:"#a07828", opacity:.6 }} />
                  <span style={{ fontSize:8.5, fontWeight:600, letterSpacing:".28em", textTransform:"uppercase", color:"#a07828" }}>Upcoming Events</span>
                </div>
                <button onClick={() => navigate("/guest/events")} style={{ fontSize:10, fontWeight:400, color:"#6b5545", background:"none", border:"none", cursor:"pointer", letterSpacing:".06em", transition:"color .2s" }}>
                  View All ›
                </button>
              </div>

              {upcomingEvents.length === 0 ? (
                <div style={{ padding:"0 20px 10px" }}>
                  <div style={{
                    background:"linear-gradient(145deg,rgba(255,250,244,0.92),rgba(250,240,226,0.88))",
                    borderRadius:26, padding:"28px 20px",
                    textAlign:"center", border:"1px solid rgba(255,255,255,.72)",
                    boxShadow:"0 8px 32px rgba(100,60,20,.13)",
                  }}>
                    <div style={{ fontSize:28, marginBottom:8 }}>🎭</div>
                    <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, color:"#6b5545", fontWeight:300, fontStyle:"italic", margin:0 }}>No upcoming events</p>
                    <p style={{ fontSize:10, color:"#a89080", marginTop:4, marginBottom:0, fontWeight:300 }}>Check back soon</p>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ padding:"0 20px" }}>
                    <div
                      style={{
                        position:"relative", width:"100%", aspectRatio:"16/9",
                        borderRadius:26, overflow:"hidden",
                        boxShadow:"0 20px 60px rgba(100,60,20,.18),0 4px 16px rgba(100,60,20,.08),0 0 0 1px rgba(180,140,100,.12)",
                        cursor:"pointer",
                      }}
                      onTouchStart={handleTouchStart}
                      onTouchEnd={handleTouchEnd}
                    >
                      {upcomingEvents.map((ev, i) => {
                        const evTime = formatEventTime(ev);
                        const evDate = formatEventDate(ev);
                        const bg = ev.gradient || eventGradients[i % eventGradients.length];
                        const isActive = i === currentEventIndex;
                        const isExit = i === exitIndex;
                        if (!isActive && !isExit) return null;
                        return (
                          <div
                            key={ev.id || ev._id || i}
                            className={isActive ? "event-active" : "event-exit"}
                            onClick={() => navigate("/guest/events")}
                            style={{
                              position:"absolute", inset:0, borderRadius:26, overflow:"hidden",
                              background:bg, display:"block", willChange:"opacity,transform",
                            }}
                          >
                            {ev.image && (
                              <>
                                <img src={ev.image} alt={ev.title || ev.name} style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", objectPosition:"center", zIndex:0, transform: isActive ? "scale(1.05)" : "scale(1)", transition:"transform 8s ease" }} />
                              </>
                            )}
                            {/* Scrim */}
                            <div style={{
                              position:"absolute", inset:0, zIndex:1,
                              background:"linear-gradient(to bottom,rgba(0,0,0,.14) 0%,rgba(0,0,0,.02) 26%,rgba(0,0,0,.54) 60%,rgba(0,0,0,.92) 100%)",
                            }} />
                            <div style={{ position:"absolute", inset:0, zIndex:1, background:"linear-gradient(to right,rgba(0,0,0,.28) 0%,transparent 32%,transparent 68%,rgba(0,0,0,.18) 100%)" }} />

                            {/* Content */}
                            <div style={{ position:"relative", zIndex:2, padding:"14px 18px 20px", height:"100%", display:"flex", flexDirection:"column", justifyContent:"flex-end" }}>
                              {ev.tag && (
                                <div style={{
                                  position:"absolute", top:14, left:16,
                                  fontSize:7.5, fontWeight:600, letterSpacing:".17em", textTransform:"uppercase",
                                  padding:"5px 13px", borderRadius:100,
                                  background:"rgba(201,169,110,.22)", color:"#f5d99a",
                                  border:"1px solid rgba(201,169,110,.38)", backdropFilter:"blur(10px)",
                                }}>{ev.tag}</div>
                              )}
                              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                                {(evDate || evTime) && (
                                  <div style={{
                                    display:"inline-flex", alignItems:"center", gap:6,
                                    background:"rgba(0,0,0,.38)", backdropFilter:"blur(12px)",
                                    border:"1px solid rgba(255,255,255,.14)", borderRadius:100,
                                    padding:"5px 13px", alignSelf:"flex-start",
                                  }}>
                                    {evDate && <span style={{ fontSize:8.5, fontWeight:600, color:"#fbcfe8", letterSpacing:".14em", textTransform:"uppercase" }}>{evDate}</span>}
                                    {evDate && evTime && <span style={{ fontSize:8, color:"rgba(251,207,232,.3)" }}>·</span>}
                                    {evTime && <span style={{ fontSize:8.5, fontWeight:400, color:"rgba(255,255,255,.78)", letterSpacing:".05em" }}>{evTime}</span>}
                                  </div>
                                )}
                                <p style={{
                                  fontFamily:"'Cormorant Garamond',serif",
                                  fontSize:26, fontWeight:700, color:"#fff",
                                  lineHeight:1.03, margin:0,
                                  textShadow:"0 2px 18px rgba(0,0,0,.7)",
                                }}>{ev.title || ev.name}</p>
                                {ev.description && (
                                  <p style={{
                                    fontSize:11, color:"rgba(255,255,255,.58)", fontWeight:300,
                                    lineHeight:1.5, margin:0,
                                    display:"-webkit-box", WebkitLineClamp:1,
                                    WebkitBoxOrient:"vertical", overflow:"hidden",
                                  }}>{ev.description}</p>
                                )}
                                {(ev.location || ev.venue) && (
                                  <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="#fbcfe8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width:11, height:11, flexShrink:0 }}>
                                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                                    </svg>
                                    <span style={{ fontSize:10.5, color:"rgba(255,255,255,.5)", fontWeight:300 }}>{ev.location || ev.venue}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dots */}
                  <div style={{ display:"flex", justifyContent:"center", gap:5, paddingBottom:4, marginTop:14 }}>
                    {upcomingEvents.map((_, i) => (
                      <button key={i} className={`dot-btn${i === currentEventIndex ? " active" : ""}`} onClick={() => goToEvent(i)} />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* DIVIDER */}
            <div style={{ display:"flex", alignItems:"center", gap:10, margin:"26px 20px 4px" }}>
              <div style={{ flex:1, height:1, background:"linear-gradient(to right,transparent,rgba(160,120,40,.2),transparent)" }} />
              <div style={{ width:5, height:5, flexShrink:0, background:"#a07828", opacity:.38, transform:"rotate(45deg)" }} />
              <div style={{ flex:1, height:1, background:"linear-gradient(to right,transparent,rgba(160,120,40,.2),transparent)" }} />
            </div>

          </div>
        </div>

        <GuestBottomNav />
      </div>
    </>
  );
}