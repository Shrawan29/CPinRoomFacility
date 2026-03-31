import { useNavigate } from "react-router-dom";
import { useGuestAuth } from "../../context/GuestAuthContext";
import GuestBottomNav from "../../components/guest/GuestBottomNav";
import hotelbg from "../../assets/hotel-bg.jpg";
import logo from "../../assets/logo.png";
import { useEffect, useState, useRef, memo, useReducer } from "react";
import { getGuestEvents } from "../../services/event.service";

// Memoized nav — never re-renders when slide state changes
const StableNav = memo(GuestBottomNav);

const FoodIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
    <path d="M6 18h12" /><path d="M7 18v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1" />
    <path d="M8 12h8" /><path d="M5 12a7 7 0 0 1 14 0" /><path d="M12 9v-1" />
  </svg>
);
const HouseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z" />
    <path d="M9 21V12h6v9" />
  </svg>
);

function slideReducer(state, action) {
  switch (action.type) {
    case "GO":   return { cur: action.next, exit: action.prev };
    case "DONE": return { ...state, exit: null };
    default:     return state;
  }
}

// FIX 1: Bottom nav height = pill(64) + orbHalf(29) + bottomGap(12) ≈ 105px
const NAV_HEIGHT = 105;

export default function GuestDashboard() {
  const { guest, loading } = useGuestAuth();
  const navigate = useNavigate();
  const [fadeIn, setFadeIn]         = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);
  const [events, setEvents]         = useState([]);
  const [slide, dispatchSlide]      = useReducer(slideReducer, { cur: 0, exit: null });
  const autoRef   = useRef(null);
  const curRef    = useRef(0);
  const lenRef    = useRef(0);
  curRef.current  = slide.cur;
  lenRef.current  = events.length;

  useEffect(() => {
    const t1 = setTimeout(() => setFadeIn(true), 50);
    const t2 = setTimeout(() => setCardsVisible(true), 300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    if (!loading && !guest) navigate("/guest/login");
  }, [guest, loading, navigate]);

  useEffect(() => {
    getGuestEvents().then(d => setEvents(d || []));
  }, []);

  const goTo = (next) => {
    const prev = curRef.current;
    if (next === prev || lenRef.current === 0) return;
    dispatchSlide({ type: "GO", next, prev });
    setTimeout(() => dispatchSlide({ type: "DONE" }), 660);
  };

  const startAuto = () => {
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = setInterval(() => {
      if (lenRef.current === 0) return;
      goTo((curRef.current + 1) % lenRef.current);
    }, 4500);
  };

  useEffect(() => {
    if (events.length === 0) return;
    startAuto();
    return () => clearInterval(autoRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events.length]);

  const touchX = useRef(0);
  const onTouchStart = e => { touchX.current = e.changedTouches[0].clientX; };
  const onTouchEnd   = e => {
    const d = touchX.current - e.changedTouches[0].clientX;
    if (Math.abs(d) < 50) return;
    clearInterval(autoRef.current);
    goTo(d > 0
      ? (curRef.current + 1) % lenRef.current
      : (curRef.current - 1 + lenRef.current) % lenRef.current
    );
    setTimeout(startAuto, 5000);
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  const fmtTime = ev => ev.eventTime || "";
  const fmtDate = ev => {
    if (!ev.eventDate) return "";
    const d = new Date(ev.eventDate), t = new Date(), tom = new Date();
    tom.setDate(t.getDate() + 1);
    if (d.toDateString() === t.toDateString())   return "Today";
    if (d.toDateString() === tom.toDateString()) return "Tomorrow";
    return d.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
  };

  const gradients = [
    "linear-gradient(160deg,#2d0840,#7B2D8B)",
    "linear-gradient(160deg,#5c001a,#A4005D)",
    "linear-gradient(160deg,#082036,#1a6a8a)",
    "linear-gradient(160deg,#2d1500,#8a5200)",
    "linear-gradient(160deg,#0e2e0e,#2d6b2d)",
  ];

  const actions = [
    { icon: <FoodIcon />,  label: "Food Order",   sub: "In-room dining",  route: "/guest/menu",         accent: "linear-gradient(135deg,#A4005D,#C44A87)", iconBg: "rgba(164,0,93,0.07)",   iconColor: "#A4005D", orb: "radial-gradient(circle,#A4005D,transparent)" },
    { icon: <HouseIcon />, label: "Housekeeping", sub: "Room essentials", route: "/guest/housekeeping", accent: "linear-gradient(135deg,#c9a96e,#b8883a)", iconBg: "rgba(160,120,40,0.08)", iconColor: "#a07828", orb: "radial-gradient(circle,#a07828,transparent)" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');
        *{-webkit-font-smoothing:antialiased;box-sizing:border-box}

        @keyframes heroFade  {from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes blob1     {0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(14px,-12px) scale(1.09)}}
        @keyframes blob2     {0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-12px,14px) scale(1.07)}}
        @keyframes pulseDot  {0%,100%{box-shadow:0 0 0 0 rgba(134,239,172,0.6)}50%{box-shadow:0 0 0 6px rgba(134,239,172,0)}}
        @keyframes waveDraw  {0%{stroke-dashoffset:1400;opacity:0}5%{opacity:1}100%{stroke-dashoffset:0;opacity:1}}
        @keyframes waveGlow  {0%,100%{opacity:.45}50%{opacity:.88}}
        @keyframes waveRace  {0%{stroke-dashoffset:700}100%{stroke-dashoffset:-700}}
        @keyframes waveAura  {0%,100%{opacity:.15;stroke-width:10}50%{opacity:.28;stroke-width:15}}
        @keyframes waveRace2 {0%{stroke-dashoffset:-400}100%{stroke-dashoffset:400}}
        @keyframes delayFadeIn{0%{opacity:0}100%{opacity:1}}
        @keyframes cardIn    {from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideIn   {from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:translateX(0)}}
        @keyframes slideOut  {from{opacity:1;transform:translateX(0)}to{opacity:0;transform:translateX(-24px)}}
        @keyframes shimmer   {0%{transform:translateX(-130%)}100%{transform:translateX(130%)}}

        .wave-base{stroke-dasharray:1400;stroke-dashoffset:1400;animation:waveDraw 2.8s cubic-bezier(0.16,1,0.3,1) 0.2s forwards}
        .wave-glow {opacity:0;animation:waveGlow 4.5s ease-in-out 3.1s infinite,delayFadeIn 0.8s ease 3.0s forwards}
        .wave-aura {opacity:0;animation:waveAura 6s ease-in-out 3.1s infinite,delayFadeIn 1s ease 3.0s forwards}
        .wave-race {stroke-dasharray:130 1270;stroke-dashoffset:700;opacity:0;animation:waveRace 3.2s linear 3.1s infinite,delayFadeIn 0.6s ease 3.0s forwards}
        .wave-race2{stroke-dasharray:60 1340;stroke-dashoffset:-400;opacity:0;animation:waveRace2 5.5s linear 3.3s infinite,delayFadeIn 0.7s ease 3.2s forwards}

        .ev-in  { animation: slideIn  .60s cubic-bezier(.22,1,.36,1) forwards; z-index:2; }
        .ev-out { animation: slideOut .60s cubic-bezier(.22,1,.36,1) forwards; z-index:1; }

        .ac-card {
          position:relative; overflow:hidden; cursor:pointer; text-align:left;
          display:flex; flex-direction:column; align-items:flex-start;
          padding:14px 12px 12px;
          border-radius:18px;
          background: linear-gradient(to bottom, rgba(255,251,245,0.97), rgba(244,235,222,0.88));
          border: 1.2px solid rgba(255,255,255,0.68);
          box-shadow: 0 8px 32px rgba(26,20,16,0.13), 0 2px 8px rgba(26,20,16,0.07), inset 0 1px 0 rgba(255,255,255,0.72);
          backdrop-filter: blur(28px) saturate(1.8);
          -webkit-backdrop-filter: blur(28px) saturate(1.8);
          transition: transform .22s cubic-bezier(.22,1,.36,1), box-shadow .22s ease;
        }
        .ac-card::before {
          content:''; position:absolute; top:0; left:0; right:0; height:38%;
          background: linear-gradient(to bottom, rgba(255,255,255,0.70), rgba(255,255,255,0));
          border-radius:18px 18px 0 0; pointer-events:none; z-index:0;
        }
        .ac-card:active { transform: scale(.95); }
        .ac-shimmer { position:absolute;inset:0;background:linear-gradient(105deg,transparent 36%,rgba(255,255,255,.42) 50%,transparent 64%);transform:translateX(-130%);pointer-events:none;border-radius:inherit;z-index:1; }
        .ac-card:hover .ac-shimmer { animation:shimmer .55s ease forwards; }
        .ac-card:hover .ac-arrow   { color:#a07828; transform:translateX(2px); }

        .dot-btn    { height:4px;border-radius:3px;width:4px;background:rgba(120,80,40,.2);border:none;cursor:pointer;padding:0;transition:all .35s cubic-bezier(.22,1,.36,1); }
        .dot-btn.on { width:20px; background:#A4005D; }
      `}</style>

      {/* ── ROOT: fixed, full-screen ── */}
      <div style={{
        position:"fixed", inset:0,
        display:"flex", flexDirection:"column",
        background:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.032'/%3E%3C/svg%3E"),linear-gradient(160deg,#f5e8d5 0%,#eddfc5 45%,#e8d6ba 100%)`,
        opacity: fadeIn ? 1 : 0, transition:"opacity 0.5s ease",
        fontFamily:"'DM Sans',system-ui,sans-serif", overflow:"hidden",
      }}>
        {/* FIX 1: paddingBottom = NAV_HEIGHT so body content ends above the fixed nav */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", maxWidth:430, width:"100%", margin:"0 auto", overflow:"hidden", minHeight:0, paddingBottom: NAV_HEIGHT }}>

          {/* ══ HERO ══ */}
          <div style={{
            position:"relative", overflow:"hidden",
            flexShrink:0, height:200,
            animation:"heroFade 0.65s cubic-bezier(0.22,1,0.36,1) both",
          }}>
            <img src={hotelbg} alt="" style={{ position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",objectPosition:"center top" }} />
            <div style={{ position:"absolute",inset:0,background:"linear-gradient(170deg,rgba(6,0,3,0.88) 0%,rgba(100,0,50,0.48) 50%,rgba(6,0,3,0.70) 100%)" }} />
            <div style={{ position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 0%,transparent 45%,rgba(0,0,0,0.3) 100%)" }} />
            <div style={{ position:"absolute",top:-50,right:-50,width:180,height:180,borderRadius:"50%",background:"radial-gradient(circle,rgba(164,0,93,0.22),transparent 65%)",animation:"blob1 7s ease-in-out infinite",pointerEvents:"none" }} />
            <div style={{ position:"absolute",bottom:20,left:-40,width:150,height:150,borderRadius:"50%",background:"radial-gradient(circle,rgba(196,74,135,0.15),transparent 65%)",animation:"blob2 9s ease-in-out infinite",pointerEvents:"none" }} />

            {/* FIX 2: more paddingTop to push header content down for breathing room */}
            <div style={{ position:"relative",zIndex:2,padding:"42px 20px 46px" }}>
              <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:10 }}>
                <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
                  <p style={{ fontSize:9,color:"rgba(255,255,255,.82)",fontWeight:500,letterSpacing:".24em",textTransform:"uppercase",textShadow:"0 1px 10px rgba(0,0,0,.9)",margin:0,lineHeight:1 }}>{greeting}</p>
                  <h1 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:38,fontWeight:300,fontStyle:"italic",color:"#fff",lineHeight:1,margin:0,textShadow:"0 2px 20px rgba(0,0,0,.5)",letterSpacing:"-.01em" }}>
                    {guest?.name || "Valued Guest"}
                  </h1>
                </div>
                <div style={{ width:52,height:52,background:"rgba(255,255,255,.14)",backdropFilter:"blur(18px)",border:"1px solid rgba(255,255,255,.28)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:"0 4px 20px rgba(0,0,0,.2)" }}>
                  <img src={logo} alt="Logo" style={{ width:34,height:34,objectFit:"contain",filter:"brightness(0) invert(1)",opacity:.95 }} />
                </div>
              </div>
              <div style={{ display:"inline-flex",alignItems:"center",gap:7,border:"1px solid rgba(255,255,255,.2)",background:"rgba(255,255,255,.1)",backdropFilter:"blur(12px)",borderRadius:20,padding:"5px 13px",boxShadow:"0 2px 10px rgba(0,0,0,.15)" }}>
                <span style={{ width:6,height:6,borderRadius:"50%",background:"#86efac",flexShrink:0,animation:"pulseDot 2.2s ease-in-out infinite" }} />
                <span style={{ fontSize:9,fontWeight:700,color:"#fff",letterSpacing:".16em",textTransform:"uppercase" }}>ROOM {guest?.roomNumber}</span>
              </div>
            </div>

            {/* Wave */}
            <div style={{ position:"absolute",bottom:-1,left:0,right:0,zIndex:3,lineHeight:0 }}>
              <svg viewBox="0 0 430 80" fill="none" preserveAspectRatio="none" style={{ width:"100%",height:80,display:"block" }}>
                <path d="M0 28 C50 70,110 76,175 50 C225 28,280 10,340 42 C375 62,408 62,430 44 L430 80 L0 80 Z" fill="#eddfc5" />
                <path className="wave-aura" d="M0 28 C50 70,110 76,175 50 C225 28,280 10,340 42 C375 62,408 62,430 44" fill="none" stroke="url(#wG2)" strokeWidth="12" strokeLinecap="round" />
                <path className="wave-base" d="M0 28 C50 70,110 76,175 50 C225 28,280 10,340 42 C375 62,408 62,430 44" fill="none" stroke="url(#wG1)" strokeWidth="2.2" strokeLinecap="round" />
                <path className="wave-glow" d="M0 28 C50 70,110 76,175 50 C225 28,280 10,340 42 C375 62,408 62,430 44" fill="none" stroke="url(#wG2)" strokeWidth="7" strokeLinecap="round" />
                <path className="wave-race" d="M0 28 C50 70,110 76,175 50 C225 28,280 10,340 42 C375 62,408 62,430 44" fill="none" stroke="url(#wG3)" strokeWidth="4" strokeLinecap="round" />
                <path className="wave-race2" d="M0 28 C50 70,110 76,175 50 C225 28,280 10,340 42 C375 62,408 62,430 44" fill="none" stroke="url(#wG2)" strokeWidth="5" strokeLinecap="round" />
                <defs>
                  <linearGradient id="wG1" x1="0" y1="0" x2="430" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="transparent"/><stop offset="12%" stopColor="#A4005D" stopOpacity=".65"/>
                    <stop offset="42%" stopColor="#D44F93"/><stop offset="72%" stopColor="#A4005D" stopOpacity=".75"/><stop offset="100%" stopColor="transparent"/>
                  </linearGradient>
                  <linearGradient id="wG2" x1="0" y1="0" x2="430" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="transparent"/><stop offset="18%" stopColor="#A4005D" stopOpacity=".22"/>
                    <stop offset="50%" stopColor="#D44F93" stopOpacity=".32"/><stop offset="82%" stopColor="#A4005D" stopOpacity=".18"/><stop offset="100%" stopColor="transparent"/>
                  </linearGradient>
                  <linearGradient id="wG3" x1="0" y1="0" x2="430" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="transparent"/><stop offset="38%" stopColor="#C44A87" stopOpacity=".7"/>
                    <stop offset="52%" stopColor="#ffffff" stopOpacity="1"/><stop offset="66%" stopColor="#C44A87" stopOpacity=".55"/><stop offset="100%" stopColor="transparent"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          {/* end hero */}



          {/* Foints Loyalty Program Card */}
          <div style={{
            background: "linear-gradient(120deg,#fffbe6 60%,#f9e6ff 100%)",
            border: "1.5px solid #f7e2b8",
            borderRadius: 18,
            boxShadow: "0 2px 12px rgba(164,0,93,0.07)",
            padding: "18px 18px 14px 18px",
            margin: "0 0 18px 0",
            display: "flex",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap"
          }}>
            <img src={logo} alt="Foints" style={{ width: 48, height: 48, borderRadius: 12, marginRight: 14, background: "#fff" }} />
            <div style={{ flex: 1, minWidth: 180 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: "#A4005D", marginBottom: 2 }}>Foints Loyalty Program</div>
              <div style={{ fontSize: 13, color: "#6b3e5e", fontWeight: 500 }}>Earn food points as cashback on every visit! 1 Foint = 1 Rupee.</div>
              <div style={{ fontSize: 11, color: "#a07828", marginTop: 2 }}>Tap below to learn more or check your points</div>
            </div>
            <button
              onClick={() => navigate("/guest/foints")}
              style={{
                background: "#A4005D",
                color: "#fff",
                fontWeight: 600,
                fontSize: 14,
                border: "none",
                borderRadius: 8,
                padding: "8px 18px",
                marginLeft: 8,
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(164,0,93,0.08)",
                transition: "background .18s"
              }}
            >
              Foints
            </button>
          </div>

          {/* ══ BODY ══ */}
          <div style={{ flex:1, display:"flex", flexDirection:"column", padding:"12px 16px 8px", overflow:"hidden", minHeight:0, gap:0 }}>

            {/* QUICK ACTIONS */}
            <div style={{ flexShrink:0, marginBottom:10 }}>
              <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:8 }}>
                <div style={{ width:14,height:1,background:"#A4005D",opacity:.5 }} />
                <span style={{ fontSize:8,fontWeight:600,letterSpacing:".26em",textTransform:"uppercase",color:"#8a7a70" }}>Quick Actions</span>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, height:110 }}>
                {actions.map((a, i) => (
                  <button key={a.label} onClick={() => navigate(a.route)} className="ac-card"
                    style={{ animation: cardsVisible ? `cardIn .5s cubic-bezier(.22,1,.36,1) ${i*80}ms both` : "none", height:"100%" }}>
                    <div className="ac-shimmer" />
                    <div style={{ position:"absolute",top:-16,right:-16,width:68,height:68,borderRadius:"50%",pointerEvents:"none",opacity:.11,filter:"blur(14px)",background:a.orb,zIndex:1 }} />
                    <div style={{ position:"absolute",top:0,left:0,right:0,height:2.5,borderRadius:"18px 18px 0 0",background:a.accent,zIndex:2 }} />
                    <div style={{ width:36,height:36,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:7,flexShrink:0,background:a.iconBg,color:a.iconColor,border:"1.5px solid rgba(164,0,93,0.10)",position:"relative",overflow:"hidden",zIndex:2 }}>
                      <div style={{ position:"absolute",inset:0,background:"linear-gradient(145deg,rgba(255,255,255,.4) 0%,transparent 55%)" }} />
                      <span style={{ position:"relative",zIndex:1 }}>{a.icon}</span>
                    </div>
                    <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:15,fontWeight:600,color:"#1A1410",lineHeight:1.05,marginBottom:2,position:"relative",zIndex:2 }}>{a.label}</p>
                    <p style={{ fontSize:9,fontWeight:400,color:"#8a7a70",position:"relative",zIndex:2,margin:0 }}>{a.sub}</p>
                    <div className="ac-arrow" style={{ position:"absolute",bottom:9,right:10,color:"rgba(164,0,93,0.32)",fontSize:14,lineHeight:1,transition:"all .22s",zIndex:2 }}>›</div>
                  </button>
                ))}
              </div>
            </div>

            {/* DIVIDER */}
            <div style={{ flexShrink:0,display:"flex",alignItems:"center",gap:12,marginBottom:10 }}>
              <div style={{ flex:1,height:1,background:"linear-gradient(to right,transparent,rgba(164,0,93,.18),transparent)" }} />
              <div style={{ width:4,height:4,background:"rgba(164,0,93,.28)",transform:"rotate(45deg)",flexShrink:0 }} />
              <div style={{ flex:1,height:1,background:"linear-gradient(to right,transparent,rgba(164,0,93,.18),transparent)" }} />
            </div>

            {/* UPCOMING EVENTS */}
            <div style={{ flex:1, display:"flex", flexDirection:"column", minHeight:0 }}>
              <div style={{ flexShrink:0,display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8 }}>
                <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                  <div style={{ width:14,height:1,background:"#A4005D",opacity:.5 }} />
                  <span style={{ fontSize:8,fontWeight:600,letterSpacing:".26em",textTransform:"uppercase",color:"#8a7a70" }}>Upcoming Events</span>
                </div>
                <button onClick={() => navigate("/guest/events")} style={{ fontSize:10,color:"#A4005D",fontWeight:600,background:"none",border:"none",cursor:"pointer",letterSpacing:".04em",display:"flex",alignItems:"center",gap:2 }}>
                  View All <span style={{ fontSize:14 }}>›</span>
                </button>
              </div>

              {events.length === 0 ? (
                <div style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"linear-gradient(145deg,rgba(255,252,248,0.92),rgba(252,244,232,0.88))",borderRadius:18,border:"1px solid rgba(164,0,93,.06)",boxShadow:"0 4px 20px rgba(26,20,16,.06)" }}>
                  <div style={{ fontSize:26,marginBottom:6 }}>🎭</div>
                  <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:"#8a7a70",fontWeight:300,fontStyle:"italic",margin:0 }}>No upcoming events</p>
                  <p style={{ fontSize:10,color:"#a89890",marginTop:3,marginBottom:0 }}>Check back soon</p>
                </div>
              ) : (
                <div style={{ flex:1, display:"flex", flexDirection:"column", minHeight:0 }}>
                  <div style={{ flex:1,position:"relative",borderRadius:18,overflow:"hidden",minHeight:120,boxShadow:"0 8px 28px rgba(26,20,16,.14)",cursor:"pointer" }}
                    onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
                    {events.map((ev, i) => {
                      const isActive = i === slide.cur;
                      const isExit   = i === slide.exit;
                      if (!isActive && !isExit) return null;
                      const bg = ev.gradient || gradients[i % gradients.length];
                      const date = fmtDate(ev), time = fmtTime(ev);
                      return (
                        <div key={ev.id || ev._id || i}
                          className={isActive ? "ev-in" : "ev-out"}
                          onClick={() => navigate("/guest/events")}
                          style={{ position:"absolute",inset:0,borderRadius:18,overflow:"hidden",background:bg,willChange:"opacity,transform" }}>
                          {ev.image && <img src={ev.image} alt={ev.title||ev.name} style={{ position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",objectPosition:"center",zIndex:0,transform:isActive?"scale(1.04)":"scale(1)",transition:"transform 8s ease" }} />}
                          <div style={{ position:"absolute",inset:0,zIndex:1,background:"linear-gradient(to bottom,rgba(0,0,0,.28) 0%,rgba(0,0,0,.08) 30%,rgba(0,0,0,.55) 65%,rgba(0,0,0,.82) 100%)" }} />
                          <div style={{ position:"relative",zIndex:2,padding:"12px 16px 14px",height:"100%",display:"flex",flexDirection:"column",justifyContent:"flex-end" }}>
                            {ev.tag && <div style={{ position:"absolute",top:12,left:14,fontSize:8,fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",padding:"4px 10px",borderRadius:8,background:"rgba(255,255,255,.14)",color:"rgba(255,255,255,.9)",border:"1px solid rgba(255,255,255,.22)",backdropFilter:"blur(8px)" }}>{ev.tag}</div>}
                            <div style={{ display:"flex",flexDirection:"column",gap:4 }}>
                              {(date || time) && (
                                <div style={{ display:"inline-flex",alignItems:"center",gap:6,background:"rgba(0,0,0,.32)",backdropFilter:"blur(8px)",border:"1px solid rgba(249,168,212,.22)",borderRadius:6,padding:"4px 10px",alignSelf:"flex-start" }}>
                                  {date && <span style={{ fontSize:9,fontWeight:700,color:"#F9A8D4",letterSpacing:".16em",textTransform:"uppercase" }}>{date}</span>}
                                  {date && time && <span style={{ fontSize:8,color:"rgba(249,168,212,.4)",fontWeight:300 }}>·</span>}
                                  {time && <span style={{ fontSize:9,fontWeight:500,color:"rgba(255,255,255,.8)",letterSpacing:".06em" }}>{time}</span>}
                                </div>
                              )}
                              <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700,color:"#fff",lineHeight:1.1,margin:0,textShadow:"0 2px 14px rgba(0,0,0,.6)" }}>{ev.title||ev.name}</p>
                              {(ev.shortDescription || ev.description) && <p style={{ fontSize:11.5,color:"rgba(255,255,255,.72)",fontWeight:400,lineHeight:1.4,margin:0,display:"-webkit-box",WebkitLineClamp:1,WebkitBoxOrient:"vertical",overflow:"hidden",textShadow:"0 1px 4px rgba(0,0,0,.4)" }}>{ev.shortDescription || ev.description}</p>}
                              {(ev.location||ev.venue) && (
                                <div style={{ display:"flex",alignItems:"center",gap:5 }}>
                                  <svg viewBox="0 0 24 24" fill="none" stroke="#F9A8D4" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width:11,height:11,flexShrink:0 }}>
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                                  </svg>
                                  <span style={{ fontSize:11,color:"rgba(255,255,255,.7)",fontWeight:400 }}>{ev.location||ev.venue}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {/* Dots */}
                  <div style={{ flexShrink:0,display:"flex",justifyContent:"center",gap:6,marginTop:7 }}>
                    {events.map((_,i) => <button key={i} className={`dot-btn${i===slide.cur?" on":""}`} onClick={()=>goTo(i)} />)}
                  </div>
                </div>
              )}
            </div>

          </div>{/* end body */}

        </div>

        <StableNav />
      </div>
    </>
  );
}