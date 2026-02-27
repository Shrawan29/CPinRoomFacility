import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Icons (copy from GuestDashboard or refactor to separate file if needed)
const FoodIcon = (isActive) => (
  <svg viewBox="0 0 26 26" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22, color: isActive ? "#A4005D" : "#6B6B6B" }}>
    {/* ...icon paths... */}
  </svg>
);
const EventsIcon = (isActive) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22, color: isActive ? "#A4005D" : "#6B6B6B" }}>
    {/* ...icon paths... */}
  </svg>
);
const RoomIcon = (isActive) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22, color: isActive ? "#A4005D" : "#6B6B6B" }}>
    {/* ...icon paths... */}
  </svg>
);
const ProfileIcon = (isActive) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22, color: isActive ? "#A4005D" : "#6B6B6B" }}>
    {/* ...icon paths... */}
  </svg>
);

const navItems = [
  { key: "home", label: "Home", route: "/guest/dashboard", icon: FoodIcon },
  { key: "events", label: "Events", route: "/guest/events", icon: EventsIcon },
  { key: "room", label: "Room", route: "/guest/room", icon: RoomIcon },
  { key: "profile", label: "Profile", route: "/guest/profile", icon: ProfileIcon },
];

export default function GuestBottomNav({ activeNav, setActiveNav }) {
  const navigate = useNavigate();

  return (
    <div style={{
      flexShrink: 0,
      background: "rgba(255,255,255,0.97)",
      backdropFilter: "blur(20px)",
      borderTop: "1px solid rgba(164,0,93,0.1)",
      boxShadow: "0 -2px 20px rgba(30,21,16,0.07)",
      maxWidth: 430,
      width: "100%",
      margin: "0 auto",
      paddingBottom: "env(safe-area-inset-bottom, 0px)",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", padding: "6px 8px" }}>
        {navItems.map((item) => {
          const isActive = activeNav === item.key;
          return (
            <button
              key={item.key}
              onClick={() => {
                setActiveNav(item.key);
                navigate(item.route);
              }}
              className="nav-btn"
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                padding: "6px 24px",
                borderRadius: 14,
                background: isActive ? "rgba(164,0,93,0.07)" : "transparent",
                border: "none",
                cursor: "pointer",
              }}
            >
              <span style={{ color: isActive ? "#A4005D" : "#6B6B6B", transition: "color 0.2s ease" }}>{item.icon(isActive)}</span>
              <span style={{ fontSize: 7, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: isActive ? "#A4005D" : "#6B6B6B", transition: "color 0.2s ease" }}>{item.label}</span>
              {isActive && (
                <div style={{ position: "absolute", bottom: -1, left: "50%", transform: "translateX(-50%)", width: 4, height: 4, borderRadius: "50%", background: "#A4005D" }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
