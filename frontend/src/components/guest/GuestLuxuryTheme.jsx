// GuestLuxuryTheme.jsx
// Provides luxury theme styles for guest pages
import React from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300&family=DM+Sans:wght@300;400;500;600&display=swap');
  .gd-root {
    --rose:       #8B1A4A;
    --rose-dark:  #6e1039;
    --gold:       #c9a96e;
    --gold-light: #e8d5b0;
    --cream:      #f5ede3;
    --warm:       #faf6f1;
    --text:       #1e1510;
    --text-mid:   #5c4a3e;
    --text-muted: #9e8276;
    --border:     rgba(180,148,110,0.18);
    --card:       #ffffff;
    --shadow-rose: 0 4px 20px rgba(139,26,74,0.13);
    --shadow-card: 0 2px 16px rgba(30,21,16,0.06);
    font-family: 'DM Sans', sans-serif;
    background: linear-gradient(135deg, var(--warm), var(--cream) 80%);
    min-height: 100vh;
  }
`;

export default function GuestLuxuryTheme({ children }) {
  return (
    <div className="gd-root">
      <style>{styles}</style>
      {children}
    </div>
  );
}