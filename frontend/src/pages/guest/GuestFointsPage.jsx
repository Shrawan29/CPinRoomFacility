import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import fointsLogo from "../../assets/foints-logo.png";
import GuestBottomNav from "../../components/guest/GuestBottomNav";
import { useGuestAuth } from "../../context/GuestAuthContext";

const outlets = [
  { name: "Meeting Point", icon: "☕" },
  { name: "Freakk de Bistro", icon: "🍽" },
  { name: "Bougainvillea", icon: "🌸" },
  { name: "Pablo", icon: "🍷" },
  { name: "High Steaks (Pool Side)", icon: "🥩" },
  { name: "Core Spa · Salon · Gym", icon: "💆" },
  { name: "Centre Point Navi Mumbai", icon: "🏨" },
  { name: "Micky's by CP Food", icon: "🍔" },
  { name: "Dali The Art Cafe", icon: "🎨" },
  { name: "Centre Point Nagpur", icon: "🏩" },
];

const perks = [
  {
    value: "10%",
    label: "Cashback as Foints",
    sub: "on every visit at any outlet",
    color: "#0b918a",
  },
  {
    value: "2x",
    label: "Doubled Cashback",
    sub: "on your 5th visit at any outlet",
    color: "#0f6b65",
  },
  {
    value: "30%",
    label: "Birthday & Anniversary",
    sub: "cashback during your special weeks",
    color: "#5f8a2e",
  },
];

const StableNav = memo(GuestBottomNav);

const REELO_LINKS = {
  check: "https://app.reelo.io/l/DQbBj",
  register: "https://app.reelo.io/l/xQTqO",
};

const PHONE_FIELD_KEYS = ["contact", "number", "phone", "mobile", "whatsapp"];
const NAME_FIELD_KEYS = ["name", "full_name", "first_name", "firstName"];

const sanitizePhone = (value) => String(value || "").replace(/\D/g, "").slice(0, 15);
const sanitizeName = (value) => String(value || "").trim();

const getGuestName = (guest) =>
  sanitizeName(guest?.guestName || guest?.name || guest?.fullName || "");

const getGuestPhone = (guest) => {
  const directCandidates = [
    guest?.contact,
    guest?.number,
    guest?.mobile,
    guest?.phone,
    guest?.whatsapp,
  ];

  for (const candidate of directCandidates) {
    const normalized = sanitizePhone(candidate);
    if (normalized) return normalized;
  }

  try {
    const stored = JSON.parse(localStorage.getItem("guest_data") || "null");
    const storedCandidates = [
      stored?.contact,
      stored?.number,
      stored?.mobile,
      stored?.phone,
      stored?.whatsapp,
    ];

    for (const candidate of storedCandidates) {
      const normalized = sanitizePhone(candidate);
      if (normalized) return normalized;
    }
  } catch {
    // Ignore malformed storage.
  }

  return "";
};

const buildReeloUrl = ({ flow, name, phone }) => {
  const base = REELO_LINKS[flow];
  if (!base) return "";

  const url = new URL(base);
  const normalizedPhone = sanitizePhone(phone);
  const normalizedName = sanitizeName(name);

  PHONE_FIELD_KEYS.forEach((key) => {
    if (normalizedPhone) url.searchParams.set(key, normalizedPhone);
  });

  if (flow === "register") {
    NAME_FIELD_KEYS.forEach((key) => {
      if (normalizedName) url.searchParams.set(key, normalizedName);
    });
  }

  url.searchParams.set("source", "cp-inroom");
  url.searchParams.set("utm_source", "cp-inroom");

  return url.toString();
};

export default function GuestFointsPage() {
  const navigate = useNavigate();
  const { guest } = useGuestAuth();

  const [activeLeadFlow, setActiveLeadFlow] = useState("");
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadError, setLeadError] = useState("");

  const openLeadFlow = (flow) => {
    setActiveLeadFlow(flow);
    setLeadError("");
    setLeadPhone(getGuestPhone(guest));
    setLeadName(flow === "register" ? getGuestName(guest) : "");
  };

  const closeLeadFlow = () => {
    setActiveLeadFlow("");
    setLeadError("");
  };

  const handleLeadSubmit = (e) => {
    e.preventDefault();

    const normalizedPhone = sanitizePhone(leadPhone);
    const normalizedName = sanitizeName(leadName);

    if (normalizedPhone.length < 10) {
      setLeadError("Please enter a valid mobile number.");
      return;
    }

    if (activeLeadFlow === "register" && normalizedName.length < 2) {
      setLeadError("Please enter your name.");
      return;
    }

    const url = buildReeloUrl({
      flow: activeLeadFlow,
      name: normalizedName,
      phone: normalizedPhone,
    });

    if (!url) {
      setLeadError("Unable to continue. Please try again.");
      return;
    }

    const tab = window.open(url, "_blank", "noopener,noreferrer");
    if (!tab) {
      window.location.assign(url);
    }

    closeLeadFlow();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; -webkit-font-smoothing: antialiased; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer { 0% { transform: translateX(-130%); } 100% { transform: translateX(130%); } }
        @keyframes pulseDot { 0%,100% { box-shadow: 0 0 0 0 rgba(245,158,11,0.45); } 50% { box-shadow: 0 0 0 7px rgba(245,158,11,0); } }
        @keyframes floatCoin { 0%,100% { transform: translateY(0px) rotate(-4deg); } 50% { transform: translateY(-6px) rotate(2deg); } }

        .fp-root {
          min-height: 100dvh;
          background: linear-gradient(160deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
          font-family: 'DM Sans', system-ui, sans-serif;
          padding-bottom: 32px;
          position: relative;
          overflow-x: hidden;
        }

        .fp-root::before {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(circle at 10% 10%, rgba(255,255,255,0.24), transparent 34%),
            radial-gradient(circle at 86% 18%, rgba(255,255,255,0.18), transparent 30%);
          opacity: 1;
        }

        .fp-hero {
          position: relative;
          overflow: hidden;
          background: linear-gradient(165deg, #ffed2b 0%, #ffe500 44%, #ffdd00 100%);
          padding: 48px 20px 72px;
          text-align: center;
          border-bottom: 1px solid rgba(149, 128, 0, 0.18);
        }

        .fp-hero::before {
          content: '';
          position: absolute;
          inset: -40px -24px;
          pointer-events: none;
          background:
            repeating-linear-gradient(
              100deg,
              rgba(255,255,255,0.30) 0 90px,
              rgba(255, 235, 60, 0.05) 90px 170px
            );
          z-index: 1;
        }

        .fp-hero-blob1 {
          position: absolute;
          top: -40px;
          right: -40px;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.34), transparent 66%);
          pointer-events: none;
        }

        .fp-hero-blob2 {
          position: absolute;
          bottom: 0;
          left: -30px;
          width: 160px;
          height: 160px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,214,10,0.26), transparent 66%);
          pointer-events: none;
        }

        .fp-back-btn {
          position: absolute;
          top: 16px;
          left: 16px;
          z-index: 5;
          background: rgba(63, 53, 0, 0.60);
          border: 1px solid rgba(255,255,255,0.42);
          border-radius: 50%;
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #fff;
          font-size: 20px;
          backdrop-filter: blur(12px);
          transition: background 0.2s;
        }

        .fp-back-btn:hover { background: rgba(63, 53, 0, 0.78); }

        .fp-hotel-logo {
          position: absolute;
          top: 14px;
          right: 16px;
          z-index: 5;
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: rgba(63, 53, 0, 0.60);
          border: 1px solid rgba(255,255,255,0.42);
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(12px);
        }

        .fp-foints-logo {
          position: relative;
          z-index: 3;
          width: 200px;
          animation: floatCoin 4s ease-in-out infinite;
          filter: drop-shadow(0 8px 32px rgba(0,0,0,0.4));
          margin: 0 auto 4px;
          display: block;
        }

        .fp-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          border: 1px solid rgba(121, 92, 0, 0.30);
          background: rgba(255,255,255,0.62);
          backdrop-filter: blur(12px);
          border-radius: 20px;
          padding: 5px 14px;
          position: relative;
          z-index: 3;
          margin-bottom: 0;
        }

        .fp-hero-badge span {
          font-size: 9px;
          font-weight: 700;
          color: #6b5500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .fp-pulse {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #f59e0b;
          animation: pulseDot 2s ease-in-out infinite;
          flex-shrink: 0;
        }

        .fp-hero-wave {
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          line-height: 0;
          z-index: 2;
        }

        .fp-body {
          max-width: 430px;
          margin: 0 auto;
          padding: 0 16px 54px;
          animation: fadeUp 0.55s cubic-bezier(0.22,1,0.36,1) 0.1s both;
        }

        .fp-section-label {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
        }

        .fp-section-label::before {
          content: '';
          width: 14px;
          height: 1px;
          background: #0e8a83;
          opacity: 0.62;
        }

        .fp-section-label span {
          font-size: 8px;
          font-weight: 600;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: #6e6946;
        }

        .fp-def-card,
        .fp-privileges,
        .fp-contact {
          background: linear-gradient(to bottom, rgba(255,255,255,0.97), rgba(255,247,202,0.86));
          border: 1.2px solid rgba(255,255,255,0.68);
          border-radius: 18px;
          box-shadow: 0 8px 28px rgba(26,20,16,0.10), inset 0 1px 0 rgba(255,255,255,0.72);
          position: relative;
          overflow: hidden;
        }

        .fp-def-card,
        .fp-privileges { padding: 18px 20px; margin-bottom: 20px; }
        .fp-contact { padding: 16px; text-align: center; }

        .fp-def-card::before,
        .fp-privileges::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2.5px;
        }

        .fp-def-card::before { background: linear-gradient(135deg, #0b918a, #11b2aa); }
        .fp-privileges::before { background: linear-gradient(135deg, #0b918a, #127971); }

        .fp-def-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 700;
          font-style: italic;
          margin: 0 0 6px;
          color: #1f1f1f;
        }

        .fp-def-body { font-size: 13px; color: #3d4339; line-height: 1.6; margin: 0 0 10px; }

        .fp-eq {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: rgba(10,144,137,0.10);
          border: 1px solid rgba(10,144,137,0.24);
          border-radius: 10px;
          padding: 8px 16px;
        }

        .fp-eq-left, .fp-eq-right { font-size: 14px; font-weight: 600; }
        .fp-eq-left { color: #0a8c85; }
        .fp-eq-right { color: #0b5f59; }
        .fp-eq-sep { font-size: 16px; color: #678233; }

        .fp-perks { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 20px; }

        .fp-perk {
          background: linear-gradient(to bottom, rgba(255,255,255,0.97), rgba(255,246,194,0.86));
          border: 1.2px solid rgba(255,255,255,0.68);
          border-radius: 16px;
          padding: 14px 10px 12px;
          text-align: center;
          box-shadow: 0 4px 16px rgba(26,20,16,0.08), inset 0 1px 0 rgba(255,255,255,0.72);
          position: relative;
          overflow: hidden;
        }

        .fp-perk-accent {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2.5px;
          border-radius: 16px 16px 0 0;
        }

        .fp-perk-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: 28px;
          font-weight: 700;
          line-height: 1;
          margin-bottom: 4px;
        }

        .fp-perk-label { font-size: 9px; font-weight: 600; line-height: 1.3; margin-bottom: 3px; color: #1f1f1f; }
        .fp-perk-sub { font-size: 8px; line-height: 1.35; color: #6f6a4b; }

        .fp-outlets { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 20px; }

        .fp-outlet {
          background: linear-gradient(to bottom, rgba(255,255,255,0.95), rgba(255,247,202,0.84));
          border: 1.2px solid rgba(255,255,255,0.68);
          border-radius: 14px;
          padding: 12px;
          display: flex;
          align-items: center;
          gap: 9px;
          box-shadow: 0 3px 12px rgba(26,20,16,0.07), inset 0 1px 0 rgba(255,255,255,0.72);
        }

        .fp-outlet-icon {
          width: 34px;
          height: 34px;
          flex-shrink: 0;
          border-radius: 9px;
          background: rgba(10,144,137,0.12);
          border: 1px solid rgba(10,144,137,0.22);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }

        .fp-outlet-name { font-size: 11px; font-weight: 500; color: #1f1f1f; line-height: 1.3; }

        .fp-priv-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 8px 0;
          border-bottom: 1px solid rgba(10,144,137,0.11);
        }

        .fp-priv-item:last-child { border-bottom: none; padding-bottom: 0; }

        .fp-priv-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #0b918a;
          margin-top: 5px;
          flex-shrink: 0;
        }

        .fp-priv-text { font-size: 13px; color: #314039; line-height: 1.5; }

        .fp-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 18px 0;
        }

        .fp-divider-line { flex: 1; height: 1px; background: linear-gradient(to right, transparent, rgba(10,144,137,.28), transparent); }
        .fp-divider-diamond { width: 4px; height: 4px; background: rgba(10,144,137,.38); transform: rotate(45deg); flex-shrink: 0; }

        .fp-ctas {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 20px;
        }

        .fp-cta {
          position: relative;
          overflow: hidden;
          border: none;
          border-radius: 14px;
          padding: 14px 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          transition: transform .2s cubic-bezier(.22,1,.36,1), box-shadow .2s;
        }

        .fp-cta:active { transform: scale(0.96); }

        .fp-cta-shimmer {
          position: absolute;
          inset: 0;
          background: linear-gradient(105deg, transparent 36%, rgba(255,255,255,0.28) 50%, transparent 64%);
          transform: translateX(-130%);
          pointer-events: none;
        }

        .fp-cta:hover .fp-cta-shimmer { animation: shimmer .55s ease forwards; }

        .fp-cta-check {
          background: linear-gradient(135deg, #0aa59f, #11877f);
          color: #fff;
          box-shadow: 0 6px 20px rgba(10,144,137,0.33);
        }

        .fp-cta-reg {
          background: linear-gradient(135deg, #0b5f59, #0f7670);
          color: #fff;
          box-shadow: 0 6px 20px rgba(11,95,89,0.28);
        }

        .fp-cta-icon { font-size: 18px; }
        .fp-cta-label { font-size: 12px; font-weight: 600; letter-spacing: 0.02em; }
        .fp-cta-sub { font-size: 9px; opacity: 0.8; }

        .fp-contact a { color: #0a8d86; text-decoration: none; font-weight: 600; }
        .fp-contact a:hover { text-decoration: underline; }
        .fp-contact-row { font-size: 11px; color: #6b6b6b; margin-bottom: 5px; line-height: 1.6; }
        .fp-contact-row:last-child { margin-bottom: 0; }

        .fp-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 10040;
          background: rgba(20,16,8,0.46);
          backdrop-filter: blur(3px);
        }

        .fp-modal-card {
          position: fixed;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          z-index: 10041;
          width: min(92vw, 360px);
          border-radius: 16px;
          background: linear-gradient(to bottom, rgba(255,255,255,0.98), rgba(255,247,202,0.90));
          border: 1.2px solid rgba(255,255,255,0.75);
          box-shadow: 0 16px 42px rgba(26,20,16,0.28);
          padding: 16px;
        }

        .fp-modal-kicker {
          margin: 0 0 4px;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #7a6a48;
        }

        .fp-modal-title {
          margin: 0 0 4px;
          font-family: 'Cormorant Garamond', serif;
          font-size: 25px;
          font-style: italic;
          color: #1f1f1f;
          line-height: 1;
        }

        .fp-modal-sub {
          margin: 0 0 10px;
          font-size: 12px;
          line-height: 1.45;
          color: #5f5541;
        }

        .fp-modal-label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          color: #5f5541;
          margin-bottom: 4px;
        }

        .fp-modal-input {
          width: 100%;
          border-radius: 10px;
          border: 1px solid rgba(121,92,0,0.24);
          background: rgba(255,255,255,0.96);
          color: #1f1f1f;
          padding: 10px 12px;
          font-size: 14px;
          outline: none;
          margin-bottom: 10px;
        }

        .fp-modal-input:focus {
          border-color: rgba(245,158,11,0.7);
          box-shadow: 0 0 0 3px rgba(245,158,11,0.15);
        }

        .fp-modal-error { margin: 0 0 10px; font-size: 12px; color: #b91c1c; }

        .fp-modal-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .fp-modal-btn {
          border-radius: 10px;
          border: none;
          padding: 10px 8px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .fp-modal-btn-cancel {
          background: transparent;
          color: #735e39;
          border: 1px solid rgba(121,92,0,0.26);
        }

        .fp-modal-btn-submit {
          color: #fff;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          box-shadow: 0 6px 18px rgba(217,119,6,0.32);
        }
      `}</style>

      <div className="fp-root">
        <div className="fp-hero">
          <div className="fp-hero-blob1" />
          <div className="fp-hero-blob2" />

          <button className="fp-back-btn" onClick={() => navigate(-1)} aria-label="Back">
            ‹
          </button>

          <div className="fp-hotel-logo">
            <img
              src={logo}
              alt="Centre Point"
              style={{ width: 28, height: 28, objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.95 }}
            />
          </div>

          <img src={fointsLogo} alt="Foints - Your Food Points" className="fp-foints-logo" />

          <div className="fp-hero-badge">
            <span className="fp-pulse" />
            <span>Loyalty Rewards Program</span>
          </div>

          <div className="fp-hero-wave">
            <svg viewBox="0 0 430 60" fill="none" preserveAspectRatio="none" style={{ width: "100%", height: 60, display: "block" }}>
              <path d="M0 20 C60 56,130 60,200 36 C250 18,300 6,360 30 C390 44,415 46,430 34 L430 60 L0 60 Z" fill="var(--bg-primary)" />
            </svg>
          </div>
        </div>

        <div className="fp-body" style={{ marginTop: -2 }}>
          <div style={{ marginTop: 24 }}>
            <div className="fp-section-label"><span>What are Foints?</span></div>
            <div className="fp-def-card">
              <p className="fp-def-title">Your Food Points</p>
              <p className="fp-def-body">Earn cashback on every food and beverage spend across all participating outlets. The more you dine, the more you earn.</p>
              <div className="fp-eq">
                <span className="fp-eq-left">1 Foint</span>
                <span className="fp-eq-sep">=</span>
                <span className="fp-eq-right">Rs 1 Cashback</span>
              </div>
            </div>
          </div>

          <div className="fp-divider"><div className="fp-divider-line" /><div className="fp-divider-diamond" /><div className="fp-divider-line" /></div>
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

          <div className="fp-divider"><div className="fp-divider-line" /><div className="fp-divider-diamond" /><div className="fp-divider-line" /></div>
          <div className="fp-section-label"><span>Participating Outlets</span></div>
          <div className="fp-outlets">
            {outlets.map((o) => (
              <div className="fp-outlet" key={o.name}>
                <div className="fp-outlet-icon">{o.icon}</div>
                <span className="fp-outlet-name">{o.name}</span>
              </div>
            ))}
          </div>

          <div className="fp-divider"><div className="fp-divider-line" /><div className="fp-divider-diamond" /><div className="fp-divider-line" /></div>
          <div className="fp-section-label"><span>Privileges & Benefits</span></div>
          <div className="fp-privileges">
            {[
              "Priority access to all events, festivals and exclusive offers",
              "Curated offers throughout the year, just for members",
              "Bonus Foints when you refer a new member",
            ].map((t) => (
              <div className="fp-priv-item" key={t}>
                <div className="fp-priv-dot" />
                <span className="fp-priv-text">{t}</span>
              </div>
            ))}
          </div>

          <div className="fp-divider"><div className="fp-divider-line" /><div className="fp-divider-diamond" /><div className="fp-divider-line" /></div>
          <div className="fp-ctas">
            <button type="button" onClick={() => openLeadFlow("check")} className="fp-cta fp-cta-check">
              <div className="fp-cta-shimmer" />
              <span className="fp-cta-icon">💰</span>
              <span className="fp-cta-label">Check Points</span>
              <span className="fp-cta-sub">See your balance</span>
            </button>

            <button type="button" onClick={() => openLeadFlow("register")} className="fp-cta fp-cta-reg">
              <div className="fp-cta-shimmer" />
              <span className="fp-cta-icon">✨</span>
              <span className="fp-cta-label">Register</span>
              <span className="fp-cta-sub">Join for free</span>
            </button>
          </div>

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

        {activeLeadFlow && (
          <>
            <div className="fp-modal-backdrop" onClick={closeLeadFlow} />
            <div className="fp-modal-card" role="dialog" aria-modal="true" aria-labelledby="fp-lead-title">
              <p className="fp-modal-kicker">Foints</p>
              <h3 id="fp-lead-title" className="fp-modal-title">
                {activeLeadFlow === "check" ? "Check Points" : "Register"}
              </h3>

              <p className="fp-modal-sub">
                {activeLeadFlow === "check"
                  ? "Enter your mobile number and we will open your points page."
                  : "Enter your name and mobile number to continue registration."}
              </p>

              <form onSubmit={handleLeadSubmit}>
                {activeLeadFlow === "register" && (
                  <>
                    <label className="fp-modal-label" htmlFor="fp-lead-name">Name</label>
                    <input
                      id="fp-lead-name"
                      className="fp-modal-input"
                      type="text"
                      value={leadName}
                      onChange={(e) => {
                        setLeadName(e.target.value);
                        if (leadError) setLeadError("");
                      }}
                      placeholder="Your full name"
                      autoComplete="name"
                    />
                  </>
                )}

                <label className="fp-modal-label" htmlFor="fp-lead-phone">Mobile Number</label>
                <input
                  id="fp-lead-phone"
                  className="fp-modal-input"
                  type="tel"
                  value={leadPhone}
                  onChange={(e) => {
                    setLeadPhone(e.target.value);
                    if (leadError) setLeadError("");
                  }}
                  placeholder="10-digit mobile number"
                  autoComplete="tel"
                />

                {leadError && <p className="fp-modal-error">{leadError}</p>}

                <div className="fp-modal-actions">
                  <button type="button" className="fp-modal-btn fp-modal-btn-cancel" onClick={closeLeadFlow}>
                    Cancel
                  </button>
                  <button type="submit" className="fp-modal-btn fp-modal-btn-submit">
                    Continue
                  </button>
                </div>
              </form>
            </div>
          </>
        )}

        <StableNav />
      </div>
    </>
  );
}

