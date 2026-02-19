import { useNavigate } from "react-router-dom";
import { useGuestAuth } from "../../context/GuestAuthContext";
import hotelbg from "../../assets/hotel-bg.jpg";
import GuestHeader from "../../components/guest/GuestHeader";
import GlassCard from "../../components/guest/GlassCard";
import { useEffect, useState } from "react";

export default function GuestDashboard() {
  const { guest } = useGuestAuth();
  const navigate = useNavigate();
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  // Icons
  const icons = {
    food: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M6 18h12" />
        <path d="M7 18v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1" />
        <path d="M8 12h8" />
        <path d="M5 12a7 7 0 0 1 14 0" />
        <path d="M12 9v-1" />
      </svg>
    ),
    housekeeping: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M6 3l12 12" />
        <path d="M10 7l-2 2" />
        <path d="M14 11l-2 2" />
        <path d="M4 20h7" />
        <path d="M4 20c1.2-3.4 3.6-5.8 7-7" />
        <path d="M11 13c1.2 0 2.7 1.1 3.6 2.1" />
      </svg>
    ),
    events: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M8 3v3" />
        <path d="M16 3v3" />
        <path d="M4 7h16" />
        <path d="M6 6h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
        <path d="M8 11h4" />
      </svg>
    ),
    amenities: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 12h8" />
        <path d="M12 8v8" />
      </svg>
    ),
  };

  // Service cards
  const services = [
    {
      icon: icons.food,
      title: "Food Order",
      subtitle: "Order from curated in-room menu",
      onClick: () => navigate("/guest/menu"),
    },
    {
      icon: icons.housekeeping,
      title: "Housekeeping",
      subtitle: "Request essentials anytime",
      onClick: () => navigate("/guest/housekeeping"),
    },
  ];

  // Explore cards
  const explore = [
    {
      icon: icons.events,
      title: "Events",
      onClick: () => navigate("/guest/events"),
    },
    {
      icon: icons.amenities,
      title: "Amenities",
      onClick: () => navigate("/guest/hotel-info"),
    },
  ];

  // Orders section placeholder (to be replaced with real data logic)
  const hasActiveOrder = false; // TODO: Replace with real check
  const activeOrder = {
    items: [
      { name: "Veg Sandwich", qty: 1 },
      { name: "Mineral Water", qty: 1 },
    ],
    status: "Preparing",
  };

  return (
    <div
      className={`min-h-screen flex flex-col bg-[--bg-primary] transition-opacity duration-700 ${fadeIn ? "opacity-100" : "opacity-0"}`}
      style={{ maxWidth: 420, margin: "0 auto", padding: "0 16px" }}
    >
      {/* Header */}
      <GuestHeader />

      {/* Hero Image Section */}
      <section
        className="relative w-full"
        style={{ height: "29vh", minHeight: 120, maxHeight: 180 }}
      >
        <img
          src={hotelbg}
          alt="Hotel Hero"
          className="w-full h-full object-cover rounded-b-[28px] shadow-lg"
          style={{ minHeight: 120, maxHeight: 180 }}
        />
        <div className="absolute bottom-0 left-0 w-full h-1/3 rounded-b-[28px]" style={{
          background: "linear-gradient(0deg, rgba(0,0,0,0.18) 60%, rgba(0,0,0,0.0) 100%)"
        }} />
      </section>

      {/* Welcome Section */}
      <section className="flex flex-col items-center text-center mt-6 mb-4 animate-fadein" style={{ animation: "fadein 1.2s" }}>
        <h2 className="font-serif text-[28px] font-semibold mb-1" style={{ letterSpacing: "-0.5px" }}>
          Welcome back
        </h2>
        <div className="text-[18px] text-[--text-muted] mb-1">Room {guest?.roomNumber || "207"}</div>
        <div className="text-[15px] text-[--text-muted] font-light" style={{ marginBottom: 0 }}>
          Enjoy your stay with us
        </div>
      </section>

      {/* Glassmorphism Service Cards */}
      <section className="flex flex-col gap-4 mt-2 mb-2">
        {services.map((svc, i) => (
          <GlassCard
            key={svc.title}
            className="flex items-center gap-4 px-5 py-5 cursor-pointer hover:scale-[1.02] transition-transform duration-300"
            onClick={svc.onClick}
            style={{ borderRadius: 24, marginBottom: i === 0 ? 16 : 0 }}
          >
            <div className="shrink-0 flex items-center justify-center w-14 h-14 rounded-[20px] bg-white/40 shadow" style={{ fontSize: 28 }}>
              {svc.icon}
            </div>
            <div className="flex-1">
              <div className="text-lg font-semibold mb-1" style={{ color: "var(--text-primary)" }}>{svc.title}</div>
              <div className="text-sm text-[--text-muted] font-light">{svc.subtitle}</div>
            </div>
          </GlassCard>
        ))}
      </section>

      {/* Explore Section */}
      <section className="mt-6 mb-8">
        <div className="text-lg font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Explore</div>
        <div className="flex flex-col gap-4">
          {explore.map((item, i) => (
            <GlassCard
              key={item.title}
              className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:scale-[1.02] transition-transform duration-300"
              onClick={item.onClick}
              style={{ borderRadius: 18, minHeight: 56, marginBottom: i === 0 ? 16 : 0 }}
            >
              <div className="shrink-0 flex items-center justify-center w-11 h-11 rounded-2xl bg-white/40 shadow" style={{ fontSize: 22 }}>
                {item.icon}
              </div>
              <div className="flex-1 text-base font-medium" style={{ color: "var(--text-primary)" }}>{item.title}</div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Animations */}
      <style>{`
        @keyframes fadein { from { opacity: 0; transform: translateY(24px);} to { opacity: 1; transform: none; } }
        .animate-fadein { animation: fadein 1.1s cubic-bezier(.4,0,.2,1); }
      `}</style>
    </div>
  );
}