import memo from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import fointsLogo from "../../assets/foints-logo.png"; // the removebg Foints logo
import GuestBottomNav from "../../components/guest/GuestBottomNav";

const outlets = [
  { name: "Meeting Point",           icon: "☕" },
  { name: "Freakk de Bistro",        icon: "🍽️" },
  { name: "Bougainvillea",           icon: "🌸" },
  { name: "Pablo",                   icon: "🍷" },
  { name: "High Steaks (Pool Side)", icon: "🥩" },
  { name: "Core Spa · Salon · Gym",  icon: "💆" },
  { name: "Centre Point Navi Mumbai",icon: "🏨" },
  { name: "Micky's by CP Food",      icon: "🍔" },
  { name: "Dali The Art Café",       icon: "🎨" },
  { name: "Centre Point Nagpur",     icon: "🏩" },
];

const StableNav = memo(GuestBottomNav);

const perks = [
  { value: "10%",    label: "Cashback as Foints",          sub: "on every visit at any outlet",       color: "#A4005D" },
  { value: "2×",     label: "Doubled Cashback",             sub: "on your 5th visit at any outlet",    color: "#7B2D8B" },
  { value: "30%",    label: "Birthday & Anniversary",       sub: "cashback during your special weeks", color: "#c9a96e" },
];

export default function GuestFointsPage() {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; -webkit-font-smoothing: antialiased; }

        @keyframes fadeUp   { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer  { 0% { transform: translateX(-130%); } 100% { transform: translateX(130%); } }
        @keyframes pulseDot { 0%,100% { box-shadow: 0 0 0 0 rgba(164,0,93,0.5); } 50% { box-shadow: 0 0 0 7px rgba(164,0,93,0); } }
        @keyframes floatCoin{ 0%,100% { transform: translateY(0px) rotate(-4deg); } 50% { transform: translateY(-6px) rotate(2deg); } }
        @keyframes blob1    { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(14px,-12px) scale(1.09); } }
        @keyframes blob2    { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-12px,14px) scale(1.07); } }

        .fp-root {
          min-height: 100dvh;
          background: linear-gradient(160deg, #f5e8d5 0%, #eddfc5 45%, #e8d6ba 100%);
          font-family: 'DM Sans', system-ui, sans-serif;
          padding-bottom: 32px;
        }

        /* ── HERO ── */
        .fp-hero {
          position: relative;
          overflow: hidden;
          background: linear-gradient(160deg, #1a0030 0%, #3d0050 40%, #60005a 70%, #A4005D 100%);
          padding: 48px 20px 72px;
          text-align: center;
        }
        .fp-hero-blob1 {
          position: absolute; top: -40px; right: -40px;
          width: 200px; height: 200px; border-radius: 50%;
          background: radial-gradient(circle, rgba(164,0,93,0.35), transparent 65%);
          animation: blob1 8s ease-in-out infinite;
          pointer-events: none;
        }
        .fp-hero-blob2 {
          position: absolute; bottom: 0; left: -30px;
          width: 160px; height: 160px; border-radius: 50%;
          background: radial-gradient(circle, rgba(123,45,139,0.28), transparent 65%);
          animation: blob2 10s ease-in-out infinite;
          pointer-events: none;
        }
        .fp-hero-wave {
          position: absolute; bottom: -1px; left: 0; right: 0;
          line-height: 0; z-index: 2;
        }
        .fp-back-btn {
          position: absolute; top: 16px; left: 16px; z-index: 5;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 50%;
          width: 38px; height: 38px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #fff; font-size: 20px;
          backdrop-filter: blur(12px);
          transition: background 0.2s;
        }
        .fp-back-btn:hover { background: rgba(255,255,255,0.22); }

        .fp-hotel-logo {
          position: absolute; top: 14px; right: 16px; z-index: 5;
          width: 42px; height: 42px; border-radius: 50%;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.2);
          display: flex; align-items: center; justify-content: center;
          backdrop-filter: blur(12px);
        }

        .fp-foints-logo {
          position: relative; z-index: 3;
          width: 200px;
          animation: floatCoin 4s ease-in-out infinite;
          filter: drop-shadow(0 8px 32px rgba(0,0,0,0.4));
          margin: 0 auto 4px;
          display: block;
        }

        .fp-hero-badge {
          display: inline-flex; align-items: center; gap: 7px;
          border: 1px solid rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(12px);
          border-radius: 20px;
          padding: 5px 14px;
          position: relative; z-index: 3;
          margin-bottom: 0;
        }
        .fp-hero-badge span { font-size: 9px; font-weight: 700; color: #fff; letter-spacing: .18em; text-transform: uppercase; }
        .fp-pulse { width: 7px; height: 7px; border-radius: 50%; background: #86efac; animation: pulseDot 2s ease-in-out infinite; flex-shrink: 0; }

        /* ── BODY ── */
        .fp-body {
          max-width: 430px;
          margin: 0 auto;
          padding: 0 16px;
          animation: fadeUp 0.55s cubic-bezier(0.22,1,0.36,1) 0.1s both;
        }

        /* section label */
        .fp-section-label {
          display: flex; align-items: center; gap: 8px;
          margin-bottom: 10px;
        }
        .fp-section-label::before {
          content: ''; display: block;
          width: 14px; height: 1px;
          background: #A4005D; opacity: 0.5;
        }
        .fp-section-label span {
          font-size: 8px; font-weight: 600;
          letter-spacing: .26em; text-transform: uppercase;
          color: #8a7a70;
        }

        /* definition card */
        .fp-def-card {
          background: linear-gradient(135deg, rgba(255,251,245,0.97), rgba(244,235,222,0.88));
          border: 1.2px solid rgba(255,255,255,0.68);
          border-radius: 18px;
          padding: 18px 20px;
          box-shadow: 0 8px 28px rgba(26,20,16,0.10), inset 0 1px 0 rgba(255,255,255,0.72);
          margin-bottom: 20px;
          position: relative; overflow: hidden;
        }
        .fp-def-card::before {
          content: ''; position: absolute;
          top: 0; left: 0; right: 0; height: 2.5px;
          background: linear-gradient(135deg, #A4005D, #C44A87);
          border-radius: 18px 18px 0 0;
        }
        .fp-def-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px; font-weight: 700; font-style: italic;
          color: #1F1F1F; margin: 0 0 6px;
        }
        .fp-def-body {
          font-size: 13px; color: #4a3a30; line-height: 1.6; margin: 0 0 10px;
        }
        .fp-eq {
          display: inline-flex; align-items: center; gap: 10px;
          background: rgba(164,0,93,0.07);
          border: 1px solid rgba(164,0,93,0.14);
          border-radius: 10px;
          padding: 8px 16px;
        }
        .fp-eq-left  { font-size: 14px; font-weight: 600; color: #A4005D; }
        .fp-eq-sep   { font-size: 16px; color: #c9a96e; }
        .fp-eq-right { font-size: 14px; font-weight: 600; color: #7B2D8B; }

        /* perk cards */
        .fp-perks {
          display: grid; grid-template-columns: 1fr 1fr 1fr;
          gap: 8px; margin-bottom: 20px;
        }
        .fp-perk {
          background: linear-gradient(to bottom, rgba(255,251,245,0.97), rgba(244,235,222,0.88));
          border: 1.2px solid rgba(255,255,255,0.68);
          border-radius: 16px;
          padding: 14px 10px 12px;
          text-align: center;
          box-shadow: 0 4px 16px rgba(26,20,16,0.08), inset 0 1px 0 rgba(255,255,255,0.72);
          position: relative; overflow: hidden;
        }
        .fp-perk-accent {
          position: absolute; top: 0; left: 0; right: 0; height: 2.5px;
          border-radius: 16px 16px 0 0;
        }
        .fp-perk-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: 28px; font-weight: 700; line-height: 1;
          margin-bottom: 4px;
        }
        .fp-perk-label { font-size: 9px; font-weight: 600; color: #1F1F1F; line-height: 1.3; margin-bottom: 3px; }
        .fp-perk-sub   { font-size: 8px; color: #8a7a70; line-height: 1.35; }

        /* outlets grid */
        .fp-outlets {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 8px; margin-bottom: 20px;
        }
        .fp-outlet {
          background: linear-gradient(to bottom, rgba(255,251,245,0.95), rgba(244,235,222,0.85));
          border: 1.2px solid rgba(255,255,255,0.68);
          border-radius: 14px;
          padding: 12px 12px;
          display: flex; align-items: center; gap: 9px;
          box-shadow: 0 3px 12px rgba(26,20,16,0.07), inset 0 1px 0 rgba(255,255,255,0.72);
        }
        .fp-outlet-icon {
          width: 34px; height: 34px; flex-shrink: 0;
          border-radius: 9px;
          background: rgba(164,0,93,0.07);
          border: 1px solid rgba(164,0,93,0.10);
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
        }
        .fp-outlet-name { font-size: 11px; font-weight: 500; color: #1F1F1F; line-height: 1.3; }

        /* privileges */
        .fp-privileges {
          background: linear-gradient(to bottom, rgba(255,251,245,0.97), rgba(244,235,222,0.88));
          border: 1.2px solid rgba(255,255,255,0.68);
          border-radius: 18px;
          padding: 18px 20px;
          box-shadow: 0 8px 28px rgba(26,20,16,0.10), inset 0 1px 0 rgba(255,255,255,0.72);
          margin-bottom: 20px;
          position: relative; overflow: hidden;
        }
        .fp-privileges::before {
          content: ''; position: absolute;
          top: 0; left: 0; right: 0; height: 2.5px;
          background: linear-gradient(135deg, #c9a96e, #b8883a);
          border-radius: 18px 18px 0 0;
        }
        .fp-priv-item {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 8px 0;
          border-bottom: 1px solid rgba(164,0,93,0.07);
        }
        .fp-priv-item:last-child { border-bottom: none; padding-bottom: 0; }
        .fp-priv-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #A4005D; flex-shrink: 0; margin-top: 5px;
        }
        .fp-priv-text { font-size: 13px; color: #3a2a20; line-height: 1.5; }

        /* CTA buttons */
        .fp-ctas {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 10px; margin-bottom: 20px;
        }
        .fp-cta {
          position: relative; overflow: hidden;
          border: none; border-radius: 14px;
          padding: 14px 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; font-weight: 600;
          cursor: pointer;
          display: flex; flex-direction: column;
          align-items: center; gap: 4px;
          text-decoration: none;
          transition: transform .2s cubic-bezier(.22,1,.36,1), box-shadow .2s;
        }
        .fp-cta:active { transform: scale(0.96); }
        .fp-cta-shimmer {
          position: absolute; inset: 0;
          background: linear-gradient(105deg, transparent 36%, rgba(255,255,255,0.28) 50%, transparent 64%);
          transform: translateX(-130%);
          pointer-events: none;
        }
        .fp-cta:hover .fp-cta-shimmer { animation: shimmer .55s ease forwards; }

        .fp-cta-check {
          background: linear-gradient(135deg, #A4005D, #C44A87);
          color: #fff;
          box-shadow: 0 6px 20px rgba(164,0,93,0.3);
        }
        .fp-cta-reg {
          background: linear-gradient(135deg, #7B2D8B, #A855C8);
          color: #fff;
          box-shadow: 0 6px 20px rgba(123,45,139,0.28);
        }
        .fp-cta-icon { font-size: 18px; }
        .fp-cta-label { font-size: 12px; font-weight: 600; letter-spacing: .02em; }
        .fp-cta-sub   { font-size: 9px; opacity: 0.8; }

        /* contact */
        .fp-contact {
          text-align: center;
          padding: 16px;
          background: linear-gradient(to bottom, rgba(255,251,245,0.9), rgba(244,235,222,0.8));
          border: 1.2px solid rgba(255,255,255,0.6);
          border-radius: 16px;
          box-shadow: 0 3px 12px rgba(26,20,16,0.06);
        }
        .fp-contact a {
          color: #A4005D; text-decoration: none; font-weight: 500;
        }
        .fp-contact a:hover { text-decoration: underline; }
        .fp-contact-row { font-size: 11px; color: #6B6B6B; margin-bottom: 5px; line-height: 1.6; }
        .fp-contact-row:last-child { margin-bottom: 0; }

        /* divider */
        .fp-divider {
          display: flex; align-items: center; gap: 12px;
          margin: 18px 0;
        }
        .fp-divider-line { flex: 1; height: 1px; background: linear-gradient(to right, transparent, rgba(164,0,93,.18), transparent); }
        .fp-divider-diamond { width: 4px; height: 4px; background: rgba(164,0,93,.28); transform: rotate(45deg); flex-shrink: 0; }
      `}</style>

      <div className="fp-root">
        {/* ── HERO ── */}
        <div className="fp-hero">
          <div className="fp-hero-blob1" />
          <div className="fp-hero-blob2" />

          {/* Back button */}
          <button className="fp-back-btn" onClick={() => navigate(-1)} aria-label="Back">‹</button>

          {/* Hotel logo */}
          <div className="fp-hotel-logo">
            <img src={logo} alt="Centre Point" style={{ width: 28, height: 28, objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.95 }} />
          </div>

          {/* Foints logo */}
          <img src={fointsLogo} alt="Foints — Your Food Points" className="fp-foints-logo" />

          {/* Badge */}
          <div className="fp-hero-badge">
            <span className="fp-pulse" />
            <span>Loyalty Rewards Program</span>
          </div>

          {/* Wave */}
          <div className="fp-hero-wave">
            <svg viewBox="0 0 430 60" fill="none" preserveAspectRatio="none" style={{ width: "100%", height: 60, display: "block" }}>
              <path d="M0 20 C60 56,130 60,200 36 C250 18,300 6,360 30 C390 44,415 46,430 34 L430 60 L0 60 Z" fill="#f5e8d5" />
            </svg>
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="fp-body" style={{ marginTop: -2 }}>

          {/* What are Foints */}
          <div style={{ marginTop: 24 }}>
            <div className="fp-section-label"><span>What are Foints?</span></div>
            <div className="fp-def-card">
              <p className="fp-def-title">Your Food Points</p>
              <p className="fp-def-body">Earn cashback on every food and beverage spend across all participating outlets. The more you dine, the more you earn.</p>
              <div className="fp-eq">
                <span className="fp-eq-left">1 Foint</span>
                <span className="fp-eq-sep">=</span>
                <span className="fp-eq-right">₹1 Cashback</span>
              </div>
            </div>
          </div>

          {/* How it works */}
          <div className="fp-divider"><div className="fp-divider-line"/><div className="fp-divider-diamond"/><div className="fp-divider-line"/></div>
          <div className="fp-section-label"><span>How It Works</span></div>
          <div className="fp-perks">
            {perks.map((p) => (
              <div className="fp-perk" key={p.label}>
                <div className="fp-perk-accent" style={{ background: `linear-gradient(135deg, ${p.color}, ${p.color}aa)` }} />
                <div className="fp-perk-value" style={{ color: p.color }}>{p.value}</div>
                <div className="fp-perk-label">{p.label}</div>
                <div className="fp-perk-sub">{p.sub}</div>
              </div>
            ))}
          </div>

          {/* Outlets */}
          <div className="fp-divider"><div className="fp-divider-line"/><div className="fp-divider-diamond"/><div className="fp-divider-line"/></div>
          <div className="fp-section-label"><span>Participating Outlets</span></div>
          <div className="fp-outlets">
            {outlets.map((o) => (
              <div className="fp-outlet" key={o.name}>
                <div className="fp-outlet-icon">{o.icon}</div>
                <span className="fp-outlet-name">{o.name}</span>
              </div>
            ))}
          </div>

          {/* Privileges */}
          <div className="fp-divider"><div className="fp-divider-line"/><div className="fp-divider-diamond"/><div className="fp-divider-line"/></div>
          <div className="fp-section-label"><span>Privileges &amp; Benefits</span></div>
          <div className="fp-privileges">
            {[
              "Priority access to all events, festivals &amp; exclusive offers",
              "Curated offers throughout the year, just for members",
              "Bonus Foints when you refer a new member",
            ].map((t) => (
              <div className="fp-priv-item" key={t}>
                <div className="fp-priv-dot" />
                <span className="fp-priv-text" dangerouslySetInnerHTML={{ __html: t }} />
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="fp-divider"><div className="fp-divider-line"/><div className="fp-divider-diamond"/><div className="fp-divider-line"/></div>
          <div className="fp-ctas">
            <a href="https://l.reelo.io/DQbBj" target="_blank" rel="noopener noreferrer" className="fp-cta fp-cta-check">
              <div className="fp-cta-shimmer" />
              <span className="fp-cta-icon">💰</span>
              <span className="fp-cta-label">Check Points</span>
              <span className="fp-cta-sub">See your balance</span>
            </a>
            <a href="https://l.reelo.io/xQTqO" target="_blank" rel="noopener noreferrer" className="fp-cta fp-cta-reg">
              <div className="fp-cta-shimmer" />
              <span className="fp-cta-icon">✨</span>
              <span className="fp-cta-label">Register</span>
              <span className="fp-cta-sub">Join for free</span>
            </a>
          </div>

          {/* Contact */}
          <div className="fp-contact">
            <div className="fp-contact-row">
              <a href="https://centrepointnagpur.com/foints/" target="_blank" rel="noopener noreferrer">Official Foints Page</a>
            </div>
            <div className="fp-contact-row">
              <a href="tel:+919266923456">+91 92669 23456</a>
              &nbsp;·&nbsp;
              <a href="tel:07126699000">0712-6699000</a>
            </div>
            <div className="fp-contact-row">
              <a href="mailto:info.nagpur@cpgh.in">info.nagpur@cpgh.in</a>
            </div>
          </div>

        </div>
        <StableNav />
      </div>
    </>
  );
}