
import { useNavigate } from "react-router-dom";
import { useGuestAuth } from "../../context/GuestAuthContext";
import hotelbg from "../../assets/hotel-bg.jpg";

export default function GuestDashboard() {
  const { guest } = useGuestAuth();
  const navigate = useNavigate();
  // Placeholder for order state
  const hasActiveOrder = false;

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif', background: '#f5ede3', color: '#1e1510', maxWidth: 430, margin: '0 auto', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px', background: 'rgba(245,237,227,0.88)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(180,148,110,0.18)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#8B1A4A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'Cormorant Garamond, serif', fontSize: 18, fontWeight: 600, letterSpacing: '-0.5px', boxShadow: '0 2px 8px rgba(139,26,74,0.3)' }}>C</div>
          <div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 14.5, fontWeight: 600, color: '#1e1510', letterSpacing: '0.01em', lineHeight: 1.25 }}>Hotel Centre Point</div>
            <div style={{ fontSize: 10.5, color: '#9e8276', fontWeight: 300, letterSpacing: '0.06em', marginTop: 1 }}>Luxury &nbsp;·&nbsp; Since 1992</div>
          </div>
        </div>
        <button style={{ background: '#8B1A4A', color: 'white', border: 'none', padding: '8px 18px', borderRadius: 30, fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 500, letterSpacing: '0.04em', cursor: 'pointer' }} onClick={() => navigate('/guest/logout')}>Logout</button>
      </header>

      {/* Hero */}
      <div style={{ position: 'relative', height: 250, overflow: 'hidden' }}>
        <img src={hotelbg} alt="Hotel Lobby" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.12) 60%, #f5ede3 100%)' }}></div>
        <div style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.35)', borderRadius: 20, padding: '5px 12px', fontSize: 11, fontWeight: 500, color: 'white', letterSpacing: '0.05em' }}>✦ Superior Room</div>
      </div>

      {/* Welcome */}
      <div style={{ padding: '4px 24px 0', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 38, fontWeight: 400, lineHeight: 1.1, color: '#1e1510', letterSpacing: '-0.01em' }}>Welcome back</h2>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, margin: '10px 0 6px', background: '#8B1A4A', color: '#fff', borderRadius: 20, padding: '5px 14px', fontSize: 11.5, fontWeight: 500, letterSpacing: '0.06em' }}>
          <svg viewBox="0 0 10 10" width={10} height={10} style={{ fill: 'rgba(255,255,255,0.7)' }}><path d="M5 0L6.2 3.8H10L6.9 6.2 8.1 10 5 7.6 1.9 10 3.1 6.2 0 3.8H3.8Z" /></svg>
          Room {guest?.roomNumber || '207'}
        </div>
        <p style={{ fontSize: 13, color: '#9e8276', fontWeight: 300, letterSpacing: '0.04em', marginBottom: 4 }}>Enjoy your stay with us</p>
      </div>

      {/* Gold Divider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '22px 24px 0' }}>
        <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, #c9a96e, transparent)', opacity: 0.5 }}></div>
        <span style={{ color: '#c9a96e', fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'Cormorant Garamond, serif', fontWeight: 500, whiteSpace: 'nowrap' }}>Our Services</span>
        <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, #c9a96e, transparent)', opacity: 0.5 }}></div>
      </div>

      {/* Service Cards */}
      <div style={{ padding: '20px 18px 0' }}>
        <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#9e8276', marginBottom: 14, paddingLeft: 2 }}> </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 11 }}>
          <div style={{ background: '#fff', border: '1px solid rgba(180,148,110,0.18)', borderRadius: 20, padding: '18px 14px 16px', cursor: 'pointer', position: 'relative', overflow: 'hidden' }} onClick={() => navigate('/guest/menu')}>
            <div style={{ position: 'absolute', top: 16, right: 14, color: '#c9a96e', fontSize: 14, opacity: 0.6 }}>›</div>
            <div style={{ width: 44, height: 44, background: '#f5ede3', borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 21, marginBottom: 12, border: '1px solid rgba(180,148,110,0.18)' }}>🍽️</div>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 16.5, fontWeight: 600, color: '#1e1510', marginBottom: 3, lineHeight: 1.2 }}>Food Order</h3>
            <p style={{ fontSize: 11, color: '#9e8276', lineHeight: 1.5, fontWeight: 300 }}>Curated in-room dining menu</p>
          </div>
          <div style={{ background: '#fff', border: '1px solid rgba(180,148,110,0.18)', borderRadius: 20, padding: '18px 14px 16px', cursor: 'pointer', position: 'relative', overflow: 'hidden' }} onClick={() => navigate('/guest/housekeeping')}>
            <div style={{ position: 'absolute', top: 16, right: 14, color: '#c9a96e', fontSize: 14, opacity: 0.6 }}>›</div>
            <div style={{ width: 44, height: 44, background: '#f5ede3', borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 21, marginBottom: 12, border: '1px solid rgba(180,148,110,0.18)' }}>🛎️</div>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 16.5, fontWeight: 600, color: '#1e1510', marginBottom: 3, lineHeight: 1.2 }}>Housekeeping</h3>
            <p style={{ fontSize: 11, color: '#9e8276', lineHeight: 1.5, fontWeight: 300 }}>Request essentials anytime</p>
          </div>
          <div style={{ background: '#fff', border: '1px solid rgba(180,148,110,0.18)', borderRadius: 20, padding: '18px 14px 16px', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 16, right: 14, color: '#c9a96e', fontSize: 14, opacity: 0.6 }}>›</div>
            <div style={{ width: 44, height: 44, background: '#f5ede3', borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 21, marginBottom: 12, border: '1px solid rgba(180,148,110,0.18)' }}>🧖</div>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 16.5, fontWeight: 600, color: '#1e1510', marginBottom: 3, lineHeight: 1.2 }}>Spa & Wellness</h3>
            <p style={{ fontSize: 11, color: '#9e8276', lineHeight: 1.5, fontWeight: 300 }}>Book a relaxation session</p>
          </div>
          <div style={{ background: '#fff', border: '1px solid rgba(180,148,110,0.18)', borderRadius: 20, padding: '18px 14px 16px', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 16, right: 14, color: '#c9a96e', fontSize: 14, opacity: 0.6 }}>›</div>
            <div style={{ width: 44, height: 44, background: '#f5ede3', borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 21, marginBottom: 12, border: '1px solid rgba(180,148,110,0.18)' }}>🚗</div>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 16.5, fontWeight: 600, color: '#1e1510', marginBottom: 3, lineHeight: 1.2 }}>Concierge</h3>
            <p style={{ fontSize: 11, color: '#9e8276', lineHeight: 1.5, fontWeight: 300 }}>Transport & city guide</p>
          </div>
        </div>
      </div>

      {/* Orders Section */}
      <div style={{ padding: '22px 18px 0' }}>
        <p style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#9e8276', marginBottom: 14, paddingLeft: 2 }}>Your Orders</p>
        <div style={{ background: '#fff', border: '1px solid rgba(180,148,110,0.18)', borderRadius: 20, padding: '24px 20px', textAlign: 'center', boxShadow: '0 2px 24px rgba(139,26,74,0.07)' }}>
          <div style={{ width: 52, height: 52, background: '#f5ede3', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 14px', border: '1px solid rgba(180,148,110,0.18)' }}>🍃</div>
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 20, fontWeight: 500, color: '#1e1510', marginBottom: 5 }}>No current orders</h3>
          <p style={{ fontSize: 12.5, color: '#9e8276', fontWeight: 300, marginBottom: 20, lineHeight: 1.5 }}>Start by ordering something<br />delicious from our menu</p>
          <button style={{ display: 'block', width: '100%', background: '#8B1A4A', color: 'white', border: 'none', borderRadius: 30, padding: 13, fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, letterSpacing: '0.06em', cursor: 'pointer', marginBottom: 14 }} onClick={() => navigate('/guest/menu')}>Order Now</button>
          <button style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#9e8276', textDecoration: 'none', letterSpacing: '0.03em', borderBottom: '1px solid rgba(180,148,110,0.18)', paddingBottom: 1, transition: 'color 0.2s', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => navigate('/guest/orders')}>View Order History &nbsp;→</button>
        </div>
      </div>

      {/* Ornament */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, margin: '26px 0 0', opacity: 0.35 }}>
        <div style={{ width: 40, height: 1, background: '#c9a96e' }}></div>
        <div style={{ width: 5, height: 5, background: '#c9a96e', transform: 'rotate(45deg)' }}></div>
        <div style={{ width: 40, height: 1, background: '#c9a96e' }}></div>
      </div>

      {/* Explore Section */}
      <div style={{ padding: '22px 18px 36px' }}>
        <p style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#9e8276', marginBottom: 14, paddingLeft: 2 }}>Explore</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ background: '#fff', border: '1px solid rgba(180,148,110,0.18)', borderRadius: 16, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }} onClick={() => navigate('/guest/events')}>
            <div style={{ width: 42, height: 42, background: '#f5ede3', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, border: '1px solid rgba(180,148,110,0.18)' }}>📅</div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 16, fontWeight: 600, color: '#1e1510', lineHeight: 1.2 }}>Events</h4>
              <p style={{ fontSize: 11, color: '#9e8276', marginTop: 2, fontWeight: 300 }}>What's on at the hotel</p>
            </div>
            <div style={{ color: '#c9a96e', fontSize: 18, opacity: 0.7, lineHeight: 1 }}>›</div>
          </div>
          <div style={{ background: '#fff', border: '1px solid rgba(180,148,110,0.18)', borderRadius: 16, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }} onClick={() => navigate('/guest/hotel-info')}>
            <div style={{ width: 42, height: 42, background: '#f5ede3', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, border: '1px solid rgba(180,148,110,0.18)' }}>✨</div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 16, fontWeight: 600, color: '#1e1510', lineHeight: 1.2 }}>Amenities</h4>
              <p style={{ fontSize: 11, color: '#9e8276', marginTop: 2, fontWeight: 300 }}>Pool, gym, business lounge</p>
            </div>
            <div style={{ color: '#c9a96e', fontSize: 18, opacity: 0.7, lineHeight: 1 }}>›</div>
          </div>
          <div style={{ background: '#fff', border: '1px solid rgba(180,148,110,0.18)', borderRadius: 16, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}>
            <div style={{ width: 42, height: 42, background: '#f5ede3', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, border: '1px solid rgba(180,148,110,0.18)' }}>🗺️</div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 16, fontWeight: 600, color: '#1e1510', lineHeight: 1.2 }}>Local Guide</h4>
              <p style={{ fontSize: 11, color: '#9e8276', marginTop: 2, fontWeight: 300 }}>Curated city experiences</p>
            </div>
            <div style={{ color: '#c9a96e', fontSize: 18, opacity: 0.7, lineHeight: 1 }}>›</div>
          </div>
          <div style={{ background: '#fff', border: '1px solid rgba(180,148,110,0.18)', borderRadius: 16, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}>
            <div style={{ width: 42, height: 42, background: '#f5ede3', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, border: '1px solid rgba(180,148,110,0.18)' }}>💬</div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 16, fontWeight: 600, color: '#1e1510', lineHeight: 1.2 }}>Chat with Us</h4>
              <p style={{ fontSize: 11, color: '#9e8276', marginTop: 2, fontWeight: 300 }}>We're available 24/7</p>
            </div>
            <div style={{ color: '#c9a96e', fontSize: 18, opacity: 0.7, lineHeight: 1 }}>›</div>
          </div>
        </div>
      </div>

      {/* Safe bottom area for mobile */}
      <div style={{ height: 'env(safe-area-inset-bottom, 0)' }}></div>
    </div>
  );
}