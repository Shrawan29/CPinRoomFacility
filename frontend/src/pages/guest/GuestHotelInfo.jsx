import { useState } from "react";
import GuestHeader from "../../components/guest/GuestHeader";
import { useGuestAuth } from "../../context/GuestAuthContext";

export default function GuestHotelInfo() {
  const { guest } = useGuestAuth();
  const [expandedSection, setExpandedSection] = useState("amenities");

  const sections = {
    amenities: {
      title: "🏨 Hotel Amenities",
      items: [
        { name: "24/7 Front Desk", icon: "🛎️" },
        { name: "Swimming Pool", icon: "🏊" },
        { name: "Fitness Center", icon: "💪" },
        { name: "Restaurant & Bar", icon: "🍽️" },
        { name: "Spa & Wellness", icon: "🧖" },
        { name: "Concierge Service", icon: "🎩" },
        { name: "Business Center", icon: "💼" },
        { name: "Laundry Service", icon: "🧺" },
      ]
    },
    wifi: {
      title: "📡 Wi-Fi & Internet",
      items: [
        { label: "Network Name (SSID)", value: "CentrePoint-Guest" },
        { label: "Password", value: "Guest@2024" },
        { label: "Speed", value: "High-speed 100 Mbps" },
        { label: "Coverage", value: "Entire hotel including rooms" },
        { label: "Tech Support", value: "Dial 0 from your room phone" },
      ]
    },
    roomServices: {
      title: "🛏️ Room Services",
      items: [
        { name: "24/7 Room Service", icon: "🍴" },
        { name: "Housekeeping", icon: "🧹" },
        { name: "Express Laundry", icon: "👕" },
        { name: "Wake-up Call", icon: "⏰" },
        { name: "In-room Dining", icon: "🍽️" },
        { name: "Mini Bar", icon: "🥤" },
        { name: "Air Conditioning", icon: "❄️" },
        { name: "Smart TV & Entertainment", icon: "📺" },
      ]
    },
    emergency: {
      title: "🚨 Emergency & Safety",
      items: [
        { label: "Emergency Hotline", value: "0 (from room phone)" },
        { label: "Reception", value: "Ext. 1" },
        { label: "Security", value: "Ext. 2" },
        { label: "Medical Assistance", value: "Ext. 3" },
        { label: "Fire Emergency", value: "Ext. 4" },
        { label: "In-room Safe", value: "Available in all rooms" },
      ]
    },
    dining: {
      title: "🍽️ Dining Options",
      items: [
        { name: "Main Restaurant", info: "7:00 AM - 11:00 PM", icon: "🍽️" },
        { name: "Rooftop Bar", info: "5:00 PM - 1:00 AM", icon: "🍸" },
        { name: "Café Lounge", info: "6:00 AM - 10:00 PM", icon: "☕" },
        { name: "Room Service", info: "24/7 Available", icon: "📱" },
        { name: "In-room Breakfast", info: "6:00 AM onwards", icon: "🥐" },
      ]
    },
    checkout: {
      title: "🔑 Check-out Information",
      items: [
        { label: "Check-out Time", value: "12:00 PM (Noon)" },
        { label: "Late Check-out", value: "Available upon request (Extra charges apply)" },
        { label: "Luggage Storage", value: "Available after check-out" },
        { label: "Early Check-in", value: "Available based on room availability" },
        { label: "Return Keys to", value: "Front Desk" },
      ]
    }
  };

  const toggleSection = (sectionKey) => {
    setExpandedSection(expandedSection === sectionKey ? null : sectionKey);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      {/* HEADER */}
      <GuestHeader />

      {/* MAIN CONTENT */}
      <main className="px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* TITLE */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
              🏨 Hotel Information
            </h1>
            <p style={{ color: "var(--text-muted)" }}>
              Everything you need during your stay
            </p>
            {guest?.roomNumber && (
              <p className="text-sm mt-2" style={{ color: "var(--text-muted)" }}>
                Room {guest.roomNumber}
              </p>
            )}
          </div>

          {/* INFO SECTIONS */}
          <div className="space-y-3">
            {Object.entries(sections).map(([key, section]) => (
              <div
                key={key}
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
              >
                {/* SECTION HEADER */}
                <button
                  onClick={() => toggleSection(key)}
                  className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition"
                >
                  <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                    {section.title}
                  </h2>
                  <span className="text-xl transition-transform" style={{
                    transform: expandedSection === key ? "rotate(180deg)" : "rotate(0deg)"
                  }}>
                    ▼
                  </span>
                </button>

                {/* SECTION CONTENT */}
                {expandedSection === key && (
                  <div className="px-4 pb-4 border-t border-gray-100">
                    {/* For amenities and services - grid layout */}
                    {(key === "amenities" || key === "roomServices") && (
                      <div className="grid grid-cols-2 gap-3 mt-4">
                        {section.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                            <span className="text-2xl">{item.icon}</span>
                            <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                              {item.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* For dining - list with times */}
                    {key === "dining" && (
                      <div className="space-y-3 mt-4">
                        {section.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{item.icon}</span>
                              <span className="font-medium" style={{ color: "var(--text-primary)" }}>
                                {item.name}
                              </span>
                            </div>
                            <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                              {item.info}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* For key-value items */}
                    {(key === "wifi" || key === "emergency" || key === "checkout") && (
                      <div className="space-y-3 mt-4">
                        {section.items.map((item, idx) => (
                          <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm font-semibold" style={{ color: "var(--text-muted)" }}>
                              {item.label}
                            </p>
                            <p className="text-base font-medium mt-1" style={{ color: "var(--text-primary)" }}>
                              {item.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* HELPFUL TIPS */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <h3 className="font-semibold mb-2 text-blue-900">💡 Need Help?</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>✓ Dial 0 from your room phone to reach the front desk</li>
              <li>✓ Press your room number on the phone for direct connection</li>
              <li>✓ Use our mobile app for instant service requests</li>
              <li>✓ Check the room directory for additional information</li>
            </ul>
          </div>

          {/* SAFE SPACE */}
          <div className="h-6" />
        </div>
      </main>
    </div>
  );
}
