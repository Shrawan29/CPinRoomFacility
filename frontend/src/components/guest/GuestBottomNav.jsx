import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


const HomeNavIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z" />
    <path d="M9 21V12h6v9" />
  </svg>
);
const OrdersNavIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="1" />
    <path d="M9 12h6" />
    <path d="M9 16h4" />
  </svg>
);
const SupportNavIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <circle cx="12" cy="17" r=".5" fill="currentColor" />
  </svg>
);

const navItems = [
  { key: "home", label: "Home", route: "/guest/dashboard", icon: HomeNavIcon },
  { key: "orders", label: "Orders", route: "/guest/orders", icon: OrdersNavIcon },
  { key: "support", label: "Support", route: "/guest/support", icon: SupportNavIcon },
];

export default function GuestBottomNav({ activeNav, setActiveNav }) {
  const navigate = useNavigate();

  return (
    <div style={{
      position: "fixed",
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 100,
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
              <span style={{ color: isActive ? "#A4005D" : "#6B6B6B", transition: "color 0.2s ease" }}>{item.icon({ active: isActive })}</span>
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
