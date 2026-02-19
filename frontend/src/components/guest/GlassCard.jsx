import React from "react";

export default function GlassCard({ children, className = "", ...props }) {
  return (
    <div
      className={`backdrop-blur-[18px] bg-white/25 border border-white/30 rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all duration-300 ${className}`}
      style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.08)", ...props.style }}
      {...props}
    >
      {children}
    </div>
  );
}
