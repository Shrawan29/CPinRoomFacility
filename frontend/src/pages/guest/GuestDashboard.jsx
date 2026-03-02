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
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  const formatEventTime = (ev) => ev.eventTime || "";
  const formatEventDate = (ev) => {
    if (ev.eventDate) {
      const d = new Date(ev.eventDate);
      const today = new Date();
      const tomorrow = new Date(); tomorrow.setDate(today.getDate() + 1);
      if (d.toDateString() === today.toDateString()) return "Today";
      if (d.toDateString() === tomorrow.toDateString()) return "Tomorrow";
      return d.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
    }
    return "";
  };

  const eventGradients = [
    "linear-gradient(160deg,#2d0840 0%,#7B2D8B 100%)",
    "linear-gradient(160deg,#5c001a 0%,#A4005D 100%)",
    "linear-gradient(160deg,#082036 0%,#1a6a8a 100%)",
    "linear-gradient(160deg,#2d1500 0%,#8a5200 100%)",
    "linear-gradient(160deg,#0e2e0e 0%,#2d6b2d 100%)",
  ];

  const quickActions = [
    { icon: <FoodIcon />, label: "Food Order", sub: "In-room dining", route: "/guest/menu", accent: "linear-gradient(135deg,#A4005D,#C44A87)", iconBg: "rgba(164,0,93,0.07)", iconColor: "#A4005D", orb: "radial-gradient(circle,#A4005D,transparent)" },
    { icon: <HouseIcon />, label: "Housekeeping", sub: "Room essentials", route: "/guest/housekeeping", accent: "linear-gradient(135deg,#c9a96e,#b8883a)", iconBg: "rgba(160,120,40,0.08)", iconColor: "#a07828", orb: "radial-gradient(circle,#a07828,transparent)" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { -webkit-font-smoothing: antialiased; box-sizing: border-box; }

        @keyframes heroFade { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes blob1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(14px,-12px) scale(1.09)} }
        @keyframes blob2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-12px,14px) scale(1.07)} }
        @keyframes pulseDot { 0%,100%{box-shadow:0 0 0 0 rgba(134,239,172,0.6)} 50%{box-shadow:0 0 0 6px rgba(134,239,172,0)} }

        @keyframes waveDraw  { 0%{stroke-dashoffset:1400;opacity:0} 5%{opacity:1} 100%{stroke-dashoffset:0;opacity:1} }
        @keyframes waveGlow  { 0%,100%{opacity:.45} 50%{opacity:.88} }
        @keyframes waveRace  { 0%{stroke-dashoffset:700} 100%{stroke-dashoffset:-700} }
        @keyframes waveAura  { 0%,100%{opacity:.15;stroke-width:10} 50%{opacity:.28;stroke-width:15} }
        @keyframes waveRace2 { 0%{stroke-dashoffset:-400} 100%{stroke-dashoffset:400} }
        @keyframes delayFadeIn { 0%{opacity:0} 100%{opacity:1} }

        .wave-base { stroke-dasharray:1400; stroke-dashoffset:1400; animation:waveDraw 2.8s cubic-bezier(0.16,1,0.3,1) 0.2s forwards; }
        .wave-glow  { opacity:0; animation:waveGlow 4.5s ease-in-out 3.1s infinite, delayFadeIn 0.8s ease 3.0s forwards; }
        .wave-aura  { opacity:0; animation:waveAura 6s ease-in-out 3.1s infinite, delayFadeIn 1s ease 3.0s forwards; }
        .wave-race  { stroke-dasharray:130 1270; stroke-dashoffset:700; opacity:0; animation:waveRace 3.2s linear 3.1s infinite, delayFadeIn 0.6s ease 3.0s forwards; }
        .wave-race2 { stroke-dasharray:60 1340; stroke-dashoffset:-400; opacity:0; animation:waveRace2 5.5s linear 3.3s infinite, delayFadeIn 0.7s ease 3.2s forwards; }

        @keyframes cardIn  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(22px)} to{opacity:1;transform:translateX(0)} }
        @keyframes slideOut{ from{opacity:1;transform:translateX(0)} to{opacity:0;transform:translateX(-22px)} }
        @keyframes shimmer { 0%{transform:translateX(-130%)} 100%{transform:translateX(130%)} }

        .event-active { animation:slideIn .65s cubic-bezier(.22,1,.36,1) forwards; z-index:1; }
        .event-exit   { animation:slideOut .65s cubic-bezier(.22,1,.36,1) forwards; z-index:0; }

        .ac-card {
          position:relative; overflow:hidden;
          background:linear-gradient(145deg,rgba(255,255,255,0.38),rgba(255,248,238,0.28));
          border:1px solid rgba(255,255,255,0.55);
          border-radius:20px; padding:16px 14px 14px;
          display:flex; flex-direction:column; align-items:flex-start;
          cursor:pointer; text-align:left;
          box-shadow:0 4px 20px rgba(100,60,20,.09),0 1px 3px rgba(100,60,20,.05),inset 0 1px 0 rgba(255,255,255,.75);
          backdrop-filter:blur(36px) saturate(2.0) brightness(1.05);
          -webkit-backdrop-filter:blur(36px) saturate(2.0) brightness(1.05);
          transition:transform .25s cubic-bezier(.22,1,.36,1),box-shadow .25s ease;
        }
        .ac-card:hover { transform:translateY(-3px); box-shadow:0 10px 34px rgba(100,60,20,.14),inset 0 1px 0 rgba(255,255,255,.75); }
        .ac-card:active { transform:scale(.96); }
        .ac-shimmer { position:absolute;inset:0;background:linear-gradient(105deg,transparent 36%,rgba(255,255,255,.55) 50%,transparent 64%);transform:translateX(-130%);pointer-events:none;border-radius:inherit; }
        .ac-card:hover .ac-shimmer { animation:shimmer .55s ease forwards; }
        .ac-card:hover .ac-arrow { color:#a07828; transform:translateX(2px); }

        .dot-btn { height:4px; border-radius:3px; width:4px; background:rgba(120,80,40,.2); border:none; cursor:pointer; padding:0; transition:all .35s cubic-bezier(.22,1,.36,1); }
        .dot-btn.on { width:20px; background:#A4005D; }
      `}</style>

      {/* ROOT — fixed, full screen, no scroll */}
      <div style={{
        position: "fixed", inset: 0,
        display: "flex", flexDirection: "column",
        background: `
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.032'/%3E%3C/svg%3E"),
          linear-gradient(160deg,#f5e8d5 0%,#eddfc5 45%,#e8d6ba 100%)
        `,
        opacity: fadeIn ? 1 : 0,
        transition: "opacity 0.5s ease",
        paddingBottom: "env(safe-area-inset-bottom)",
        fontFamily: "'DM Sans', system-ui, sans-serif",
        overflow: "hidden",
      }}>

        <div style={{
          flex: 1, display: "flex", flexDirection: "column",
          maxWidth: 430, width: "100%", margin: "0 auto",
          overflow: "hidden",
        }}>

          {/* ══ HERO — 100% original ══ */}
          <div style={{
            position: "relative", overflow: "hidden", flexShrink: 0,
            animation: "heroFade 0.65s cubic-bezier(0.22,1,0.36,1) both",
          }}>
            <img src={hotelbg} alt="Hotel" style={{
              position: "absolute", inset: 0, width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "center top",
            }} />
            <div style={{ position:"absolute", inset:0, background:"linear-gradient(170deg,rgba(6,0,3,0.88) 0%,rgba(100,0,50,0.48) 50%,rgba(6,0,3,0.70) 100%)" }} />
            <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at 50% 0%,transparent 45%,rgba(0,0,0,0.3) 100%)" }} />
            <div style={{ position:"absolute", top:-50, right:-50, width:180, height:180, borderRadius:"50%", background:"radial-gradient(circle,rgba(164,0,93,0.22),transparent 65%)", animation:"blob1 7s ease-in-out infinite", pointerEvents:"none" }} />
            <div style={{ position:"absolute", bottom:20, left:-40, width:150, height:150, borderRadius:"50%", background:"radial-gradient(circle,rgba(196,74,135,0.15),transparent 65%)", animation:"blob2 9s ease-in-out infinite", pointerEvents:"none" }} />

            <div style={{ position:"relative", zIndex:2, padding:"40px 20px 56px" }}>
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:8 }}>
                <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                  <p style={{ fontSize:9, color:"rgba(255,255,255,.82)", fontWeight:500, letterSpacing:".24em", textTransform:"uppercase", textShadow:"0 1px 10px rgba(0,0,0,.9)", margin:0, lineHeight:1 }}>{greeting}</p>
                  <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:40, fontWeight:300, fontStyle:"italic", color:"#fff", lineHeight:1, margin:0, textShadow:"0 2px 20px rgba(0,0,0,.5)", letterSpacing:"-.01em" }}>
                    {guest?.name || "Valued Guest"}
                  </h1>
                </div>
                <div style={{ width:54, height:54, background:"rgba(255,255,255,.14)", backdropFilter:"blur(18px)", border:"1px solid rgba(255,255,255,.28)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:"0 4px 20px rgba(0,0,0,.2)" }}>
                  <img src={logo} alt="Logo" style={{ width:36, height:36, objectFit:"contain", filter:"brightness(0) invert(1)", opacity:.95 }} />
                </div>
              </div>
              <div style={{ display:"inline-flex", alignItems:"center", gap:7, border:"1px solid rgba(255,255,255,.2)", background:"rgba(255,255,255,.1)", backdropFilter:"blur(12px)", borderRadius:20, padding:"5px 13px", boxShadow:"0 2px 10px rgba(0,0,0,.15)" }}>
                <span style={{ width:6, height:6, borderRadius:"50%", background:"#86efac", flexShrink:0, animation:"pulseDot 2.2s ease-in-out infinite" }} />
                <span style={{ fontSize:9, fontWeight:700, color:"#fff", letterSpacing:".16em", textTransform:"uppercase" }}>ROOM {guest?.roomNumber}</span>
              </div>
            </div>

            {/* Wave */}
            <div style={{ position:"absolute", bottom:-1, left:0, right:0, zIndex:3, lineHeight:0 }}>
              <svg viewBox="0 0 430 80" fill="none" preserveAspectRatio="none" style={{ width:"100%", height:80, display:"block" }}>
                <path d="M0 28 C50 70,110 76,175 50 C225 28,280 10,340 42 C375 62,408 62,430 44 L430 80 L0 80 Z" fill="#eddfc5" />
                <path className="wave-aura" d="M0 28 C50 70,110 76,175 50 C225 28,280 10,340 42 C375 62,408 62,430 44" fill="none" stroke="url(#wG2)" strokeWidth="12" strokeLinecap="round" />
                <path className="wave-base" d="M0 28 C50 70,110 76,175 50 C225 28,280 10,340 42 C375 62,408 62,430 44" fill="none" stroke="url(#wG1)" strokeWidth="2.2" strokeLinecap="round" />
                <path className="wave-glow" d="M0 28 C50 70,110 76,175 50 C225 28,280 10,340 42 C375 62,408 62,430 44" fill="none" stroke="url(#wG2)" strokeWidth="7" strokeLinecap="round" />
                <path className="wave-race" d="M0 28 C50 70,110 76,175 50 C225 28,280 10,340 42 C375 62,408 62,430 44" fill="none" stroke="url(#wG3)" strokeWidth="4" strokeLinecap="round" />
                <path className="wave-race2" d="M0 28 C50 70,110 76,175 50 C225 28,280 10,340 42 C375 62,408 62,430 44" fill="none" stroke="url(#wG2)" strokeWidth="5" strokeLinecap="round" />
                <defs>
                  <linearGradient id="wG1" x1="0" y1="0" x2="430" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="transparent"/><stop offset="12%" stopColor="#A4005D" stopOpacity=".65"/>
                    <stop offset="42%" stopColor="#D44F93"/><stop offset="72%" stopColor="#A4005D" stopOpacity=".75"/>
                    <stop offset="100%" stopColor="transparent"/>
                  </linearGradient>
                  <linearGradient id="wG2" x1="0" y1="0" x2="430" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="transparent"/><stop offset="18%" stopColor="#A4005D" stopOpacity=".22"/>
                    <stop offset="50%" stopColor="#D44F93" stopOpacity=".32"/><stop offset="82%" stopColor="#A4005D" stopOpacity=".18"/>
                    <stop offset="100%" stopColor="transparent"/>
                  </linearGradient>
                  <linearGradient id="wG3" x1="0" y1="0" x2="430" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="transparent"/><stop offset="38%" stopColor="#C44A87" stopOpacity=".7"/>
                    <stop offset="52%" stopColor="#ffffff" stopOpacity="1"/><stop offset="66%" stopColor="#C44A87" stopOpacity=".55"/>
                    <stop offset="100%" stopColor="transparent"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          {/* end hero */}

          {/* ══ BODY — flex column fills remaining space, NO scroll ══ */}
          <div style={{ flex:1, display:"flex", flexDirection:"column", padding:"12px 16px 8px", overflow:"hidden", minHeight:0 }}>

            {/* QUICK ACTIONS */}
            <div style={{ flexShrink:0, marginBottom:10 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                <div style={{ width:14, height:1, background:"#A4005D", opacity:.5 }} />
                <span style={{ fontSize:8, fontWeight:600, letterSpacing:".26em", textTransform:"uppercase", color:"#8a7a70" }}>Quick Actions</span>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                {quickActions.map((action, i) => (
                  <button key={action.label} onClick={() => navigate(action.route)} className="ac-card"
                    style={{ animation: cardsVisible ? `cardIn .5s cubic-bezier(.22,1,.36,1) ${i * 80}ms both` : "none" }}
                  >
                    <div className="ac-shimmer" />
                    <div style={{ position:"absolute", top:-22, right:-22, width:88, height:88, borderRadius:"50%", pointerEvents:"none", opacity:.13, filter:"blur(18px)", background:action.orb }} />
                    <div style={{ position:"absolute", top:0, left:0, right:0, height:3, borderRadius:"20px 20px 0 0", background:action.accent }} />
                    <div style={{
                      width:42, height:42, borderRadius:12,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      marginBottom:10, flexShrink:0,
                      background:action.iconBg, color:action.iconColor,
                      border:"1.5px solid rgba(164,0,93,0.10)",
                      position:"relative", overflow:"hidden",
                    }}>
                      <div style={{ position:"absolute", inset:0, background:"linear-gradient(145deg,rgba(255,255,255,.4) 0%,transparent 55%)" }} />
                      <span style={{ position:"relative", zIndex:1 }}>{action.icon}</span>
                    </div>
                    <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:17, fontWeight:600, color:"#1A1410", lineHeight:1.05, marginBottom:2 }}>{action.label}</p>
                    <p style={{ fontSize:9, fontWeight:400, color:"#8a7a70" }}>{action.sub}</p>
                    <div className="ac-arrow" style={{ position:"absolute", bottom:11, right:12, color:"rgba(164,0,93,0.32)", fontSize:16, lineHeight:1, transition:"all .22s" }}>›</div>
                  </button>
                ))}
              </div>
            </div>

            {/* DIVIDER */}
            <div style={{ flexShrink:0, display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
              <div style={{ flex:1, height:1, background:"linear-gradient(to right,transparent,rgba(164,0,93,.18),transparent)" }} />
              <div style={{ width:4, height:4, background:"rgba(164,0,93,.28)", transform:"rotate(45deg)", flexShrink:0 }} />
              <div style={{ flex:1, height:1, background:"linear-gradient(to right,transparent,rgba(164,0,93,.18),transparent)" }} />
            </div>

            {/* UPCOMING EVENTS — takes remaining flex space */}
            <div style={{ flex:1, display:"flex", flexDirection:"column", minHeight:0 }}>
              <div style={{ flexShrink:0, display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ width:14, height:1, background:"#A4005D", opacity:.5 }} />
                  <span style={{ fontSize:8, fontWeight:600, letterSpacing:".26em", textTransform:"uppercase", color:"#8a7a70" }}>Upcoming Events</span>
                </div>
                <button onClick={() => navigate("/guest/events")} style={{ fontSize:10, color:"#A4005D", fontWeight:600, background:"none", border:"none", cursor:"pointer", letterSpacing:".04em", display:"flex", alignItems:"center", gap:2 }}>
                  View All <span style={{ fontSize:14 }}>›</span>
                </button>
              </div>

              {upcomingEvents.length === 0 ? (
                <div style={{
                  flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                  background:"linear-gradient(145deg,rgba(255,252,248,0.92),rgba(252,244,232,0.88))",
                  borderRadius:18, border:"1px solid rgba(164,0,93,.06)",
                  boxShadow:"0 4px 20px rgba(26,20,16,.06)",
                }}>
                  <div style={{ fontSize:26, marginBottom:6 }}>🎭</div>
                  <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, color:"#8a7a70", fontWeight:300, fontStyle:"italic", margin:0 }}>No upcoming events</p>
                  <p style={{ fontSize:10, color:"#a89890", marginTop:3, marginBottom:0 }}>Check back soon</p>
                </div>
              ) : (
                <div style={{ flex:1, display:"flex", flexDirection:"column", minHeight:0 }}>
                  {/* Event card fills all available vertical space */}
                  <div
                    style={{
                      flex:1, position:"relative", borderRadius:18, overflow:"hidden", minHeight:0, maxHeight:"42vh",
                      boxShadow:"0 12px 40px rgba(26,20,16,.16)", cursor:"pointer",
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
                          style={{ position:"absolute", inset:0, borderRadius:18, overflow:"hidden", background:bg, display:"block", willChange:"opacity,transform" }}
                        >
                          {ev.image && (
                            <img src={ev.image} alt={ev.title || ev.name} style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", objectPosition:"center", zIndex:0, transform:isActive ? "scale(1.04)" : "scale(1)", transition:"transform 8s ease" }} />
                          )}
                          <div style={{ position:"absolute", inset:0, zIndex:1, background:"linear-gradient(to bottom,rgba(0,0,0,.28) 0%,rgba(0,0,0,.08) 30%,rgba(0,0,0,.55) 65%,rgba(0,0,0,.82) 100%)" }} />
                          <div style={{ position:"relative", zIndex:2, padding:"12px 16px 16px", height:"100%", display:"flex", flexDirection:"column", justifyContent:"flex-end" }}>
                            {ev.tag && (
                              <div style={{ position:"absolute", top:12, left:14, fontSize:8, fontWeight:700, letterSpacing:".14em", textTransform:"uppercase", padding:"4px 10px", borderRadius:8, background:"rgba(255,255,255,.14)", color:"rgba(255,255,255,.9)", border:"1px solid rgba(255,255,255,.22)", backdropFilter:"blur(8px)" }}>{ev.tag}</div>
                            )}
                            <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
                              {(evDate || evTime) && (
                                <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(0,0,0,.32)", backdropFilter:"blur(8px)", border:"1px solid rgba(249,168,212,.22)", borderRadius:6, padding:"4px 10px", alignSelf:"flex-start" }}>
                                  {evDate && <span style={{ fontSize:9, fontWeight:700, color:"#F9A8D4", letterSpacing:".16em", textTransform:"uppercase" }}>{evDate}</span>}
                                  {evDate && evTime && <span style={{ fontSize:8, color:"rgba(249,168,212,.4)", fontWeight:300 }}>·</span>}
                                  {evTime && <span style={{ fontSize:9, fontWeight:500, color:"rgba(255,255,255,.8)", letterSpacing:".06em" }}>{evTime}</span>}
                                </div>
                              )}
                              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:700, color:"#fff", lineHeight:1.1, margin:0, textShadow:"0 2px 14px rgba(0,0,0,.6)" }}>{ev.title || ev.name}</p>
                              {ev.description && (
                                <p style={{ fontSize:11.5, color:"rgba(255,255,255,.72)", fontWeight:400, lineHeight:1.4, margin:0, display:"-webkit-box", WebkitLineClamp:1, WebkitBoxOrient:"vertical", overflow:"hidden", textShadow:"0 1px 4px rgba(0,0,0,.4)" }}>{ev.description}</p>
                              )}
                              {(ev.location || ev.venue) && (
                                <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                                  <svg viewBox="0 0 24 24" fill="none" stroke="#F9A8D4" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width:11, height:11, flexShrink:0 }}>
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                                  </svg>
                                  <span style={{ fontSize:11, color:"rgba(255,255,255,.7)", fontWeight:400 }}>{ev.location || ev.venue}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Dots */}
                  <div style={{ flexShrink:0, display:"flex", justifyContent:"center", gap:6, marginTop:8 }}>
                    {upcomingEvents.map((_, i) => (
                      <button key={i} className={`dot-btn${i === currentEventIndex ? " on" : ""}`} onClick={() => goToEvent(i)} />
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
          {/* end body */}

        </div>

        <GuestBottomNav />
      </div>
    </>
  );
}