import { useNavigate } from "react-router-dom";
import { useGuestAuth } from "../../context/GuestAuthContext";
import GuestBottomNav from "../../components/guest/GuestBottomNav";
import logo from "../../assets/logo.png";

import { useEffect, useState, useRef } from "react";
import { getGuestEvents } from "../../services/event.service";

/* ─── SVG Icons ─── */
const FoodIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
    <path d="M6 18h12" /><path d="M7 18v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1" />
    <path d="M8 12h8" /><path d="M5 12a7 7 0 0 1 14 0" /><path d="M12 9v-1" />
  </svg>
);
const HouseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const CalIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
    <path d="M8 3v3" /><path d="M16 3v3" /><path d="M4 7h16" />
    <path d="M6 6h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
    <path d="M8 11h4" />
  </svg>
);
const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
    <circle cx="12" cy="12" r="10" /><path d="M8 12h8" /><path d="M12 8v8" />
  </svg>
);
const PinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#fbcfe8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 11, height: 11, flexShrink: 0 }}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export default function GuestDashboard() {
  const { guest, loading } = useGuestAuth();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [exitIndex, setExitIndex] = useState(null);
  const autoRef = useRef(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const touchStartRef = useRef(0);

  useEffect(() => {
    const t1 = setTimeout(() => setMounted(true), 50);
    const t2 = setTimeout(() => setCardsVisible(true), 400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    if (!loading && !guest) navigate("/guest/login");
  }, [guest, loading, navigate]);

  useEffect(() => {
    getGuestEvents().then((data) => setUpcomingEvents(data || []));
  }, []);

  useEffect(() => {
    if (upcomingEvents.length < 2) return;
    autoRef.current = setInterval(() => goEvent((prev) => (prev + 1) % upcomingEvents.length), 4500);
    return () => clearInterval(autoRef.current);
  }, [upcomingEvents.length]);

  const goEvent = (fn) => {
    setCurrentEventIndex((prev) => {
      const next = typeof fn === "function" ? fn(prev) : fn;
      if (next === prev) return prev;
      setExitIndex(prev);
      setTimeout(() => setExitIndex(null), 700);
      return next;
    });
  };

  const handleTouchStart = (e) => { touchStartRef.current = e.changedTouches[0].clientX; };
  const handleTouchEnd = (e) => {
    const d = touchStartRef.current - e.changedTouches[0].clientX;
    if (Math.abs(d) < 50) return;
    clearInterval(autoRef.current);
    if (d > 0) goEvent((p) => (p + 1) % upcomingEvents.length);
    else goEvent((p) => (p - 1 + upcomingEvents.length) % upcomingEvents.length);
    setTimeout(() => {
      autoRef.current = setInterval(() => goEvent((p) => (p + 1) % upcomingEvents.length), 4500);
    }, 5000);
  };

  const hour = new Date().getHours();
  const greeting = hour < 5 ? "Good Night" : hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  const formatEventDate = (ev) => {
    if (!ev.eventDate) return "";
    const d = new Date(ev.eventDate);
    const today = new Date(); const tom = new Date(); tom.setDate(today.getDate() + 1);
    if (d.toDateString() === today.toDateString()) return "Tonight";
    if (d.toDateString() === tom.toDateString()) return "Tomorrow";
    return d.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
  };

  const eventGradients = [
    "linear-gradient(155deg,#3b0764 0%,#7c3aed 40%,#be185d 100%)",
    "linear-gradient(155deg,#064e3b 0%,#047857 40%,#0e7490 100%)",
    "linear-gradient(155deg,#431407 0%,#9a3412 40%,#c9a96e 100%)",
    "linear-gradient(155deg,#1e1b4b 0%,#4338ca 40%,#be185d 100%)",
    "linear-gradient(155deg,#0c4a6e 0%,#0369a1 40%,#7c3aed 100%)",
  ];

  const quickActions = [
    { icon: <FoodIcon />, label: "Food Order", sub: "In-room dining", route: "/guest/menu", accent: "linear-gradient(90deg,#9d174d,#be185d,#ec4899)", glow: "#be185d", iconBg: "rgba(190,24,93,.07)", iconColor: "#be185d" },
    { icon: <HouseIcon />, label: "Housekeeping", sub: "Room essentials", route: "/guest/housekeeping", accent: "linear-gradient(90deg,#7a5a14,#c9a96e,#e4c98a)", glow: "#a07828", iconBg: "rgba(160,120,40,.08)", iconColor: "#a07828" },
  ];

  const exploreItems = [
    { icon: <CalIcon />, label: "All Events", sub: "Experiences & activities", route: "/guest/events" },
    { icon: <PlusIcon />, label: "Amenities", sub: "Facilities & services", route: "/guest/amenities" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600&family=Jost:wght@200;300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        * { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }

        :root {
          --bg: #ede3d4;
          --rose: #be185d; --rose-pale: rgba(190,24,93,0.08);
          --gold: #a07828; --gold-mid: #c9a96e; --gold-pale: rgba(160,120,40,0.1);
          --text-hi: #1c110a; --text-mid: #6b5545; --text-lo: #a89080;
          --shadow-sm: 0 2px 8px rgba(100,60,20,.08), 0 1px 2px rgba(100,60,20,.04);
          --shadow-md: 0 8px 32px rgba(100,60,20,.13), 0 2px 8px rgba(100,60,20,.06);
          --shadow-lg: 0 20px 60px rgba(100,60,20,.18), 0 4px 16px rgba(100,60,20,.08);
        }

        /* ── BACKGROUND BOKEH ORBS ── */
        @keyframes bgFloat1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(18px,-22px) scale(1.07)} }
        @keyframes bgFloat2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-16px,18px) scale(1.09)} }
        @keyframes bgFloat3 { 0%,100%{transform:translate(0,0)} 40%{transform:translate(12px,14px)} 80%{transform:translate(-9px,-10px)} }
        @keyframes bgFloat4 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(22px,12px)} }
        @keyframes bgRing   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes bgStreak { 0%,100%{opacity:.25} 50%{opacity:.65} }
        .bg-orb1 { animation: bgFloat1 16s ease-in-out infinite; }
        .bg-orb2 { animation: bgFloat2 20s ease-in-out infinite; }
        .bg-orb3 { animation: bgFloat3 24s ease-in-out infinite; }
        .bg-orb4 { animation: bgFloat4 21s ease-in-out infinite; }
        .bg-ring1 { animation: bgRing 55s linear infinite; }
        .bg-ring2 { animation: bgRing 38s linear infinite reverse; }
        .bg-ring3 { animation: bgRing 46s linear infinite; }
        .bg-streak { animation: bgStreak 10s ease-in-out infinite; }

        /* ── WAVE ANIMATIONS ── */
        @keyframes waveDraw  { 0%{stroke-dashoffset:1400;opacity:0} 5%{opacity:1} 100%{stroke-dashoffset:0} }
        @keyframes waveGlow  { 0%,100%{opacity:.4} 50%{opacity:.85} }
        @keyframes waveRace  { 0%{stroke-dashoffset:700} 100%{stroke-dashoffset:-700} }
        @keyframes waveAura  { 0%,100%{opacity:.14;stroke-width:10px} 50%{opacity:.26;stroke-width:14px} }
        @keyframes waveRace2 { 0%{stroke-dashoffset:-400} 100%{stroke-dashoffset:400} }
        @keyframes dinFade   { from{opacity:0} to{opacity:1} }

        .wave-base  { stroke-dasharray:1400; stroke-dashoffset:1400; animation:waveDraw 2.8s cubic-bezier(.16,1,.3,1) .2s forwards; }
        .wave-glow  { opacity:0; animation:waveGlow 4.5s ease-in-out 3.1s infinite, dinFade .8s ease 3s forwards; }
        .wave-aura  { opacity:0; animation:waveAura 6s ease-in-out 3.1s infinite, dinFade 1s ease 3s forwards; }
        .wave-race  { stroke-dasharray:130 1270; stroke-dashoffset:700; opacity:0; animation:waveRace 3.2s linear 3.1s infinite, dinFade .6s ease 3s forwards; }
        .wave-race2 { stroke-dasharray:60 1340; stroke-dashoffset:-400; opacity:0; animation:waveRace2 5.5s linear 3.3s infinite, dinFade .7s ease 3.2s forwards; }

        /* ── HERO ORBS ── */
        @keyframes heroOrb1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(10px,-12px)} }
        @keyframes heroOrb2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-8px,10px)} }
        @keyframes heroOrb3 { 0%,100%{transform:translate(0,0)} 60%{transform:translate(7px,8px)} }
        @keyframes heroLine { 0%,100%{opacity:.3} 50%{opacity:.7} }
        .hero-orb1 { animation: heroOrb1 8s ease-in-out infinite; }
        .hero-orb2 { animation: heroOrb2 11s ease-in-out infinite; }
        .hero-orb3 { animation: heroOrb3 13s ease-in-out infinite; }
        .hero-line1 { animation: heroLine 5s ease-in-out infinite; }
        .hero-line2 { animation: heroLine 5s ease-in-out 1.5s infinite; }

        /* ── MEDALLION PULSE ── */
        @keyframes medPulse { 0%,100%{opacity:.3} 50%{opacity:.7} }
        .med-ring { animation: medPulse 3.5s ease-in-out infinite; }

        /* ── CHIP DOT ── */
        @keyframes dotBeat { 0%,100%{transform:scale(1)} 50%{transform:scale(.6);opacity:.5} }
        .chip-dot { animation: dotBeat 2.2s ease-in-out infinite; }

        /* ── STAGGERED CONTENT REVEALS ── */
        @keyframes slideUp    { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideRight { from{opacity:0;transform:translateX(-16px)} to{opacity:1;transform:translateX(0)} }

        .reveal-up-0  { animation: slideUp .5s cubic-bezier(.22,1,.36,1) .35s both; }
        .reveal-up-1  { animation: slideUp .5s cubic-bezier(.22,1,.36,1) .44s both; }
        .reveal-up-2  { animation: slideUp .5s cubic-bezier(.22,1,.36,1) .52s both; }
        .reveal-rt-0  { animation: slideRight .5s cubic-bezier(.22,1,.36,1) .58s both; }
        .reveal-rt-1  { animation: slideRight .5s cubic-bezier(.22,1,.36,1) .66s both; }

        /* ── CARD SHIMMER ── */
        @keyframes shimmer { 0%{transform:translateX(-130%)} 100%{transform:translateX(130%)} }
        .glass-card:active  { transform: scale(0.96) !important; transition: transform .12s ease !important; }
        .glass-card::after  {
          content:''; position:absolute; inset:0; border-radius:inherit;
          background:linear-gradient(105deg,transparent 36%,rgba(255,255,255,.6) 50%,transparent 64%);
          transform:translateX(-130%); pointer-events:none;
        }
        .glass-card:active::after { animation: shimmer .5s ease forwards; }

        /* ── EVENT CARD TRANSITIONS ── */
        @keyframes cardIn  { from{opacity:0;transform:translateX(26px)} to{opacity:1;transform:translateX(0)} }
        @keyframes cardOut { from{opacity:1;transform:translateX(0)} to{opacity:0;transform:translateX(-26px)} }
        .event-active { display:block !important; animation:cardIn .65s cubic-bezier(.22,1,.36,1) forwards; z-index:1; }
        .event-exit   { display:block !important; animation:cardOut .65s cubic-bezier(.22,1,.36,1) forwards; z-index:0; }

        /* ── EXPLORE ROWS ── */
        .explore-row:active { transform: scale(0.98) !important; }

        /* ── SCROLLBAR HIDE ── */
        .no-scroll { scrollbar-width:none; -ms-overflow-style:none; }
        .no-scroll::-webkit-scrollbar { display:none; }
      `}</style>

      {/* ══ FIXED BACKGROUND LAYER ══ */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, overflow: "hidden",
        background: "linear-gradient(145deg,#f9edd8 0%,#f2e2c4 30%,#ead5ae 65%,#f5e8d2 100%)",
      }}>
        {/* Multi-stop radial base */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 130% 70% at 10% 5%,#fff5e0 0%,transparent 45%), radial-gradient(ellipse 100% 80% at 90% 100%,#f8ddb8 0%,transparent 50%)",
        }} />

        {/* Bokeh orbs */}
        {[
          { cls:"bg-orb1", top:-150, left:-120, size:520, color:"rgba(190,24,93,.12)" },
          { cls:"bg-orb2", bottom:-110, right:-90, size:460, color:"rgba(175,100,0,.13)" },
          { cls:"bg-orb3", top:"38%", left:"8%", size:380, color:"rgba(201,169,110,.15)" },
          { cls:"bg-orb4", top:"5%", right:"5%", size:270, color:"rgba(90,35,170,.06)" },
        ].map((o, i) => (
          <div key={i} className={o.cls} style={{
            position: "absolute",
            ...(o.top !== undefined ? { top: o.top } : {}),
            ...(o.bottom !== undefined ? { bottom: o.bottom } : {}),
            ...(o.left !== undefined ? { left: o.left } : {}),
            ...(o.right !== undefined ? { right: o.right } : {}),
            width: o.size, height: o.size, borderRadius: "50%",
            background: `radial-gradient(circle,${o.color} 0%,transparent 70%)`,
            filter: "blur(72px)", pointerEvents: "none",
          }} />
        ))}

        {/* Decorative rotating rings */}
        {[
          { cls:"bg-ring1", size:640, top:-210, right:-180, color:"rgba(201,169,110,.07)" },
          { cls:"bg-ring2", size:440, top:-100, right:-90,  color:"rgba(190,24,93,.055)" },
          { cls:"bg-ring3", size:560, bottom:-220, left:-180,color:"rgba(201,169,110,.065)" },
        ].map((r, i) => (
          <div key={i} className={r.cls} style={{
            position: "absolute",
            ...(r.top !== undefined ? { top: r.top } : { bottom: r.bottom }),
            ...(r.right !== undefined ? { right: r.right } : { left: r.left }),
            width: r.size, height: r.size, borderRadius: "50%",
            border: `1px solid ${r.color}`, pointerEvents: "none",
          }} />
        ))}

        {/* Art nouveau SVG motif */}
        <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:.55, pointerEvents:"none" }} viewBox="0 0 430 900" preserveAspectRatio="xMidYMid slice">
          <ellipse cx="215" cy="-40" rx="250" ry="195" fill="none" stroke="rgba(201,169,110,.07)" strokeWidth="1"/>
          <ellipse cx="215" cy="-40" rx="200" ry="148" fill="none" stroke="rgba(190,24,93,.055)" strokeWidth="1"/>
          <ellipse cx="215" cy="-40" rx="150" ry="102" fill="none" stroke="rgba(201,169,110,.08)" strokeWidth=".8"/>
          <ellipse cx="215" cy="940" rx="250" ry="195" fill="none" stroke="rgba(190,24,93,.05)" strokeWidth="1"/>
          <polygon points="-45,450 85,310 215,450 85,590" fill="none" stroke="rgba(201,169,110,.06)" strokeWidth="1"/>
          <polygon points="215,450 345,310 475,450 345,590" fill="none" stroke="rgba(190,24,93,.055)" strokeWidth="1"/>
          <circle cx="215" cy="450" r="195" fill="none" stroke="rgba(201,169,110,.052)" strokeWidth="1"/>
          <circle cx="215" cy="450" r="148" fill="none" stroke="rgba(190,24,93,.042)" strokeWidth=".8"/>
          <line x1="0" y1="270" x2="155" y2="0" stroke="rgba(160,100,0,.032)" strokeWidth="1"/>
          <line x1="430" y1="270" x2="275" y2="0" stroke="rgba(160,100,0,.032)" strokeWidth="1"/>
        </svg>

        {/* Diagonal light streak */}
        <div className="bg-streak" style={{
          position: "absolute", top: "-15%", left: "-8%", width: "136%", height: "55%",
          background: "linear-gradient(108deg,transparent 30%,rgba(255,240,200,.14) 50%,transparent 70%)",
          transform: "rotate(-5deg)", pointerEvents: "none",
        }} />

        {/* Noise grain */}
        <div style={{
          position: "absolute", inset: 0, opacity: .44, pointerEvents: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.045'/%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* ══ MAIN LAYOUT ══ */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 1,
        display: "flex", flexDirection: "column",
        opacity: mounted ? 1 : 0, transition: "opacity .5s ease",
        fontFamily: "'Jost', sans-serif",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}>

        {/* ── INNER CONTENT: capped at 430px, non-scrollable ── */}
        <div style={{
          flex: 1, display: "flex", flexDirection: "column",
          maxWidth: 430, width: "100%", margin: "0 auto",
          overflow: "hidden",
        }}>

          {/* ══════════════════════════════════
              HERO
          ══════════════════════════════════ */}
          <div style={{ position: "relative", overflow: "hidden", flexShrink: 0 }}>

            {/* Hero background gradient + noise */}
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(148deg,#180008 0%,#500028 26%,#802000 58%,#220c00 100%)",
            }} />
            <div style={{
              position: "absolute", inset: 0, opacity: .5, pointerEvents: "none",
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.05'/%3E%3C/svg%3E")`,
            }} />

            {/* Hero floating orbs */}
            <div className="hero-orb1" style={{ position:"absolute", top:-90, right:-60, width:290, height:290, borderRadius:"50%", background:"radial-gradient(circle,rgba(190,24,93,.4) 0%,transparent 65%)", zIndex:2, filter:"blur(2px)", pointerEvents:"none" }} />
            <div className="hero-orb2" style={{ position:"absolute", bottom:-30, left:-80, width:250, height:250, borderRadius:"50%", background:"radial-gradient(circle,rgba(160,80,0,.32) 0%,transparent 65%)", zIndex:2, filter:"blur(2px)", pointerEvents:"none" }} />
            <div className="hero-orb3" style={{ position:"absolute", top:"28%", right:"12%", width:130, height:130, borderRadius:"50%", background:"radial-gradient(circle,rgba(201,169,110,.22) 0%,transparent 60%)", zIndex:2, pointerEvents:"none" }} />

            {/* Filigree lines */}
            <div style={{ position:"absolute", inset:0, zIndex:2, pointerEvents:"none", overflow:"hidden" }}>
              <div className="hero-line1" style={{ position:"absolute", top:"30%", width:"100%", height:1, background:"linear-gradient(90deg,transparent,rgba(201,169,110,.2),transparent)" }} />
              <div className="hero-line2" style={{ position:"absolute", top:"63%", right:0, width:"68%", height:1, background:"linear-gradient(90deg,transparent,rgba(201,169,110,.2),transparent)" }} />
            </div>

            {/* Hero content */}
            <div style={{ position:"relative", zIndex:4, padding:"48px 22px 70px" }}>
              {/* Eyebrow */}
              <div style={{ display:"inline-flex", alignItems:"center", gap:8, marginBottom:14 }}>
                <div style={{ width:22, height:1, background:"#c9a96e", opacity:.7 }} />
                <span style={{ fontSize:9, fontWeight:500, letterSpacing:".3em", textTransform:"uppercase", color:"#c9a96e" }}>
                  Centre Point Nagpur
                </span>
                <div style={{ width:22, height:1, background:"#c9a96e", opacity:.7 }} />
              </div>

              {/* Name + Medallion row */}
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:20 }}>
                <h1 style={{
                  fontFamily:"'Cormorant Garamond',serif", fontSize:44, fontWeight:300,
                  fontStyle:"italic", color:"rgba(255,255,255,.97)", lineHeight:.93,
                  letterSpacing:"-.02em", textShadow:"0 6px 36px rgba(0,0,0,.55)", margin:0,
                }}>
                  <span style={{ display:"block", fontSize:12, fontStyle:"normal", fontWeight:300, fontFamily:"'Jost',sans-serif", letterSpacing:".16em", textTransform:"uppercase", color:"rgba(255,255,255,.52)", marginBottom:6 }}>
                    {greeting}
                  </span>
                  {guest?.name || "Valued Guest"}
                </h1>

                {/* Glass medallion */}
                <div style={{ flexShrink:0, width:58, height:58, borderRadius:"50%", position:"relative", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  {/* Gradient border */}
                  <div style={{
                    position:"absolute", inset:0, borderRadius:"50%",
                    background:"linear-gradient(135deg,rgba(201,169,110,.65),rgba(201,169,110,.12),rgba(201,169,110,.55))",
                    WebkitMask:"linear-gradient(#fff 0 0) padding-box,linear-gradient(#fff 0 0)",
                    WebkitMaskComposite:"destination-out", maskComposite:"exclude",
                    border:"1px solid transparent",
                  }} />
                  {/* Outer pulse ring */}
                  <div className="med-ring" style={{ position:"absolute", inset:-5, borderRadius:"50%", border:"1px solid rgba(201,169,110,.2)" }} />
                  {/* Inner circle */}
                  <div style={{
                    width:52, height:52, borderRadius:"50%",
                    background:"rgba(255,255,255,.12)", backdropFilter:"blur(20px)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    border:"1px solid rgba(255,255,255,.18)", boxShadow:"inset 0 1px 0 rgba(255,255,255,.22)",
                  }}>
                    <img src={logo} alt="CP" style={{ width:30, height:30, objectFit:"contain", filter:"brightness(0) invert(1)", opacity:.95 }} />
                  </div>
                </div>
              </div>

              {/* Room chip */}
              <div style={{
                display:"inline-flex", alignItems:"center", gap:8,
                background:"rgba(255,255,255,.1)", backdropFilter:"blur(18px)",
                border:"1px solid rgba(255,255,255,.2)", borderRadius:100,
                padding:"7px 18px 7px 12px",
                boxShadow:"0 2px 14px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.1)",
              }}>
                <span className="chip-dot" style={{ width:7, height:7, borderRadius:"50%", background:"#4ade80", flexShrink:0, boxShadow:"0 0 6px rgba(74,222,128,.7)" }} />
                <span style={{ fontSize:9, fontWeight:600, color:"rgba(255,255,255,.95)", letterSpacing:".2em", textTransform:"uppercase" }}>
                  Room {guest?.roomNumber || "—"}
                </span>
                <span style={{ width:1, height:12, background:"rgba(255,255,255,.22)" }} />
                <span style={{ fontSize:8, fontWeight:400, color:"rgba(255,255,255,.58)", letterSpacing:".08em" }}>Active Stay</span>
              </div>
            </div>

            {/* Wave SVG */}
            <div style={{ position:"absolute", bottom:-1, left:0, right:0, zIndex:5, lineHeight:0 }}>
              <svg viewBox="0 0 430 82" fill="none" preserveAspectRatio="none" style={{ width:"100%", height:82, display:"block" }}>
                <path d="M0 28 C50 72,110 78,175 50 C225 28,280 10,340 42 C375 62,408 62,430 44 L430 82 L0 82 Z" fill="#ede3d4"/>
                <path className="wave-aura"  d="M0 28 C50 72,110 78,175 50 C225 28,280 10,340 42 C375 62,408 62,430 44" fill="none" stroke="url(#wg2)" strokeWidth="12" strokeLinecap="round"/>
                <path className="wave-base"  d="M0 28 C50 72,110 78,175 50 C225 28,280 10,340 42 C375 62,408 62,430 44" fill="none" stroke="url(#wg1)" strokeWidth="2.2" strokeLinecap="round"/>
                <path className="wave-glow"  d="M0 28 C50 72,110 78,175 50 C225 28,280 10,340 42 C375 62,408 62,430 44" fill="none" stroke="url(#wg2)" strokeWidth="7" strokeLinecap="round"/>
                <path className="wave-race"  d="M0 28 C50 72,110 78,175 50 C225 28,280 10,340 42 C375 62,408 62,430 44" fill="none" stroke="url(#wg3)" strokeWidth="4" strokeLinecap="round"/>
                <path className="wave-race2" d="M0 28 C50 72,110 78,175 50 C225 28,280 10,340 42 C375 62,408 62,430 44" fill="none" stroke="url(#wg2)" strokeWidth="5" strokeLinecap="round"/>
                <defs>
                  <linearGradient id="wg1" x1="0" y1="0" x2="430" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="transparent"/><stop offset="12%" stopColor="#be185d" stopOpacity=".65"/>
                    <stop offset="42%" stopColor="#ec4899"/><stop offset="72%" stopColor="#be185d" stopOpacity=".75"/>
                    <stop offset="100%" stopColor="transparent"/>
                  </linearGradient>
                  <linearGradient id="wg2" x1="0" y1="0" x2="430" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="transparent"/><stop offset="18%" stopColor="#be185d" stopOpacity=".22"/>
                    <stop offset="50%" stopColor="#ec4899" stopOpacity=".32"/><stop offset="82%" stopColor="#be185d" stopOpacity=".18"/>
                    <stop offset="100%" stopColor="transparent"/>
                  </linearGradient>
                  <linearGradient id="wg3" x1="0" y1="0" x2="430" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="transparent"/><stop offset="38%" stopColor="#c9a96e" stopOpacity=".75"/>
                    <stop offset="52%" stopColor="#fff" stopOpacity="1"/><stop offset="66%" stopColor="#c9a96e" stopOpacity=".6"/>
                    <stop offset="100%" stopColor="transparent"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          {/* end hero */}

          {/* ══════════════════════════════════
              BODY — scrollable internally, clipped to screen
          ══════════════════════════════════ */}
          <div className="no-scroll" style={{
            flex: 1, overflowY: "auto", overflowX: "hidden",
            background: "transparent",
            paddingBottom: 8,
          }}>

            {/* ── Section helper ── */}
            {(() => {
              const SectionHead = ({ label, action, onAction }) => (
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 20px", marginBottom:14 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ width:16, height:1, background:"#a07828", opacity:.6 }} />
                    <span style={{ fontSize:8.5, fontWeight:600, letterSpacing:".28em", textTransform:"uppercase", color:"#a07828" }}>{label}</span>
                  </div>
                  {action && (
                    <button onClick={onAction} style={{ fontSize:10, fontWeight:400, color:"#a89080", background:"none", border:"none", cursor:"pointer", letterSpacing:".06em", transition:"color .2s" }}>
                      {action}
                    </button>
                  )}
                </div>
              );

              const Divider = () => (
                <div style={{ display:"flex", alignItems:"center", gap:10, margin:"22px 20px" }}>
                  <div style={{ flex:1, height:1, background:"linear-gradient(to right,transparent,rgba(160,120,40,.2),transparent)" }} />
                  <div style={{ width:5, height:5, background:"#a07828", opacity:.38, transform:"rotate(45deg)", flexShrink:0 }} />
                  <div style={{ flex:1, height:1, background:"linear-gradient(to right,transparent,rgba(160,120,40,.2),transparent)" }} />
                </div>
              );

              return (
                <>
                  {/* ── QUICK ACTIONS ── */}
                  <div style={{ padding:"20px 20px 0" }}>
                    <SectionHead label="Quick Actions" />
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                      {quickActions.map((action, i) => (
                        <button
                          key={action.label}
                          className="glass-card"
                          onClick={() => navigate(action.route)}
                          style={{
                            position:"relative", overflow:"hidden",
                            background:"linear-gradient(145deg,rgba(255,250,244,.9) 0%,rgba(250,240,226,.85) 100%)",
                            border:"1px solid rgba(255,255,255,.7)", borderRadius:24,
                            padding:"22px 18px 20px",
                            display:"flex", flexDirection:"column", alignItems:"flex-start",
                            cursor:"pointer", minHeight:148, textAlign:"left",
                            boxShadow:"var(--shadow-md),inset 0 1px 0 rgba(255,255,255,.8)",
                            backdropFilter:"blur(10px)",
                            transition:"transform .25s cubic-bezier(.22,1,.36,1),box-shadow .25s ease",
                            animation: cardsVisible ? `slideUp .5s cubic-bezier(.22,1,.36,1) ${i * 80}ms both` : "none",
                          }}
                        >
                          {/* Glow blob */}
                          <div style={{ position:"absolute", top:-28, right:-28, width:110, height:110, borderRadius:"50%", background:`radial-gradient(circle,${action.glow},transparent)`, opacity:.16, filter:"blur(24px)", pointerEvents:"none" }} />
                          {/* Top accent stripe */}
                          <div style={{ position:"absolute", top:0, left:0, right:0, height:3, borderRadius:"24px 24px 0 0", background:action.accent }} />
                          {/* Icon well */}
                          <div style={{
                            width:50, height:50, borderRadius:16,
                            display:"flex", alignItems:"center", justifyContent:"center",
                            marginBottom:18, flexShrink:0,
                            background:action.iconBg, color:action.iconColor,
                            border:"1px solid rgba(255,255,255,.7)",
                            boxShadow:"var(--shadow-sm)", position:"relative", overflow:"hidden",
                          }}>
                            <div style={{ position:"absolute", inset:0, background:"linear-gradient(145deg,rgba(255,255,255,.5) 0%,transparent 60%)" }} />
                            <span style={{ position:"relative", zIndex:1 }}>{action.icon}</span>
                          </div>
                          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontWeight:600, color:"#1c110a", lineHeight:1.05, marginBottom:4 }}>{action.label}</p>
                          <p style={{ fontSize:10, fontWeight:300, color:"#a89080", letterSpacing:".04em" }}>{action.sub}</p>
                          {/* Arrow circle */}
                          <div style={{ position:"absolute", bottom:17, right:17, width:28, height:28, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", border:"1px solid rgba(180,140,100,.2)", fontSize:14, color:"#a89080", background:"rgba(255,255,255,.5)" }}>›</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Divider />

                  {/* ── UPCOMING EVENTS ── */}
                  <div>
                    <SectionHead label="Upcoming Events" action="View All ›" onAction={() => navigate("/guest/events")} />
                    <div style={{ padding:"0 20px" }}>
                      {upcomingEvents.length === 0 ? (
                        <div className="reveal-up-0" style={{
                          background:"linear-gradient(145deg,rgba(255,250,244,.9),rgba(250,240,226,.85))",
                          border:"1px solid rgba(255,255,255,.7)", borderRadius:24,
                          padding:"28px 20px", textAlign:"center",
                          boxShadow:"var(--shadow-md),inset 0 1px 0 rgba(255,255,255,.8)",
                          backdropFilter:"blur(10px)",
                        }}>
                          <div style={{ fontSize:26, marginBottom:8 }}>🎭</div>
                          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:300, fontStyle:"italic", color:"#a89080", margin:0 }}>No upcoming events</p>
                          <p style={{ fontSize:10, color:"#c0a890", marginTop:4 }}>Check back soon</p>
                        </div>
                      ) : (
                        <>
                          {/* Event card container */}
                          <div
                            onTouchStart={handleTouchStart}
                            onTouchEnd={handleTouchEnd}
                            onClick={() => navigate("/guest/events")}
                            style={{
                              position:"relative", width:"100%", aspectRatio:"16/9",
                              borderRadius:26, overflow:"hidden", cursor:"pointer",
                              boxShadow:"var(--shadow-lg),0 0 0 1px rgba(180,140,100,.12)",
                            }}
                          >
                            {upcomingEvents.map((ev, i) => {
                              const bg = ev.gradient || eventGradients[i % eventGradients.length];
                              const isActive = i === currentEventIndex;
                              const isExit = i === exitIndex;
                              return (
                                <div
                                  key={ev.id || ev._id || i}
                                  className={isActive ? "event-active" : isExit ? "event-exit" : ""}
                                  style={{
                                    position:"absolute", inset:0, borderRadius:26, overflow:"hidden",
                                    background:bg, display: (isActive || isExit) ? "block" : "none",
                                  }}
                                >
                                  {ev.image && <img src={ev.image} alt={ev.title} style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", zIndex:0 }} />}
                                  {/* Scrim */}
                                  <div style={{ position:"absolute", inset:0, zIndex:1, background:"linear-gradient(to bottom,rgba(0,0,0,.14) 0%,rgba(0,0,0,.02) 26%,rgba(0,0,0,.54) 60%,rgba(0,0,0,.92) 100%)" }} />
                                  <div style={{ position:"absolute", inset:0, zIndex:1, background:"linear-gradient(to right,rgba(0,0,0,.28) 0%,transparent 32%,transparent 68%,rgba(0,0,0,.18) 100%)" }} />
                                  {/* Content */}
                                  <div style={{ position:"relative", zIndex:2, padding:"14px 18px 20px", height:"100%", display:"flex", flexDirection:"column", justifyContent:"flex-end" }}>
                                    {ev.tag && (
                                      <div style={{ position:"absolute", top:14, left:16, fontSize:7.5, fontWeight:600, letterSpacing:".17em", textTransform:"uppercase", padding:"5px 13px", borderRadius:100, background:"rgba(201,169,110,.22)", color:"#f5d99a", border:"1px solid rgba(201,169,110,.38)", backdropFilter:"blur(10px)" }}>
                                        {ev.tag}
                                      </div>
                                    )}
                                    {(ev.eventDate || ev.eventTime) && (
                                      <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(0,0,0,.38)", backdropFilter:"blur(12px)", border:"1px solid rgba(255,255,255,.14)", borderRadius:100, padding:"5px 13px", alignSelf:"flex-start", marginBottom:8 }}>
                                        <span style={{ fontSize:8.5, fontWeight:600, color:"#fbcfe8", letterSpacing:".14em", textTransform:"uppercase" }}>{formatEventDate(ev)}</span>
                                        {ev.eventDate && ev.eventTime && <span style={{ fontSize:8, color:"rgba(251,207,232,.3)" }}>·</span>}
                                        {ev.eventTime && <span style={{ fontSize:8.5, fontWeight:400, color:"rgba(255,255,255,.78)", letterSpacing:".05em" }}>{ev.eventTime}</span>}
                                      </div>
                                    )}
                                    <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:26, fontWeight:700, color:"#fff", lineHeight:1.03, marginBottom:6, textShadow:"0 2px 18px rgba(0,0,0,.7)" }}>
                                      {ev.title || ev.name}
                                    </p>
                                    {ev.description && (
                                      <p style={{ fontSize:11, color:"rgba(255,255,255,.58)", fontWeight:300, lineHeight:1.5, marginBottom:8, overflow:"hidden", display:"-webkit-box", WebkitLineClamp:1, WebkitBoxOrient:"vertical" }}>
                                        {ev.description}
                                      </p>
                                    )}
                                    {(ev.location || ev.venue) && (
                                      <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                                        <PinIcon />
                                        <span style={{ fontSize:10.5, color:"rgba(255,255,255,.5)", fontWeight:300 }}>{ev.location || ev.venue}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Dot indicators */}
                          <div style={{ display:"flex", justifyContent:"center", gap:5, marginTop:14 }}>
                            {upcomingEvents.map((_, i) => (
                              <button key={i} onClick={(e) => { e.stopPropagation(); goEvent(i); }} style={{
                                height:4, borderRadius:3, border:"none", cursor:"pointer", padding:0,
                                width: i === currentEventIndex ? 22 : 4,
                                background: i === currentEventIndex ? "#be185d" : "rgba(120,80,40,.2)",
                                transition:"all .35s cubic-bezier(.22,1,.36,1)",
                              }} />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <Divider />

                  {/* ── YOUR ORDERS ── */}
                  <div style={{ padding:"0 20px" }}>
                    <SectionHead label="Your Orders" action="View All ›" onAction={() => navigate("/guest/orders")} />
                    <div className="reveal-up-2" style={{
                      display:"flex", alignItems:"center", gap:14,
                      background:"linear-gradient(145deg,rgba(255,250,244,.9),rgba(250,240,226,.85))",
                      border:"1px solid rgba(255,255,255,.7)", borderRadius:20,
                      padding:"18px 20px",
                      boxShadow:"var(--shadow-md),inset 0 1px 0 rgba(255,255,255,.8)",
                      backdropFilter:"blur(10px)",
                    }}>
                      <div style={{ width:50, height:50, flexShrink:0, borderRadius:15, background:"rgba(190,24,93,.08)", border:"1px solid rgba(190,24,93,.12)", display:"flex", alignItems:"center", justifyContent:"center", color:"#be185d", boxShadow:"var(--shadow-sm)" }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width:22, height:22 }}>
                          <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
                          <rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6"/><path d="M9 16h4"/>
                        </svg>
                      </div>
                      <div>
                        <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, fontWeight:500, color:"#1c110a", marginBottom:3 }}>No active orders</p>
                        <p style={{ fontSize:10, color:"#a89080", fontWeight:300 }}>Your requests will appear here</p>
                      </div>
                    </div>
                  </div>

                  <Divider />

                  {/* ── EXPLORE ── */}
                  <div style={{ padding:"0 20px 28px" }}>
                    <SectionHead label="Explore" />
                    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                      {exploreItems.map((item, i) => (
                        <button
                          key={item.label}
                          className="explore-row"
                          onClick={() => navigate(item.route)}
                          style={{
                            display:"flex", alignItems:"center", gap:14,
                            width:"100%",
                            background:"linear-gradient(145deg,rgba(255,250,244,.9),rgba(250,240,226,.85))",
                            border:"1px solid rgba(255,255,255,.7)", borderRadius:20,
                            padding:"16px 18px", cursor:"pointer", textAlign:"left",
                            boxShadow:"var(--shadow-md),inset 0 1px 0 rgba(255,255,255,.8)",
                            backdropFilter:"blur(10px)",
                            transition:"transform .22s cubic-bezier(.22,1,.36,1),box-shadow .22s ease",
                            animation: cardsVisible ? `slideRight .5s cubic-bezier(.22,1,.36,1) ${.36 + i * .08}s both` : "none",
                          }}
                        >
                          <div style={{ width:48, height:48, flexShrink:0, borderRadius:14, background:"rgba(190,24,93,.08)", border:"1px solid rgba(190,24,93,.12)", display:"flex", alignItems:"center", justifyContent:"center", color:"#be185d", boxShadow:"var(--shadow-sm)" }}>
                            {item.icon}
                          </div>
                          <div style={{ flex:1, minWidth:0 }}>
                            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:19, fontWeight:500, color:"#1c110a", marginBottom:2, lineHeight:1.1 }}>{item.label}</p>
                            <p style={{ fontSize:10, color:"#a89080", fontWeight:300, letterSpacing:".02em" }}>{item.sub}</p>
                          </div>
                          <span style={{ color:"#a89080", fontSize:18, transition:"color .22s,transform .22s" }}>›</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              );
            })()}

          </div>
          {/* end body */}

        </div>
        {/* end inner cap */}

        <GuestBottomNav />
      </div>
    </>
  );
}