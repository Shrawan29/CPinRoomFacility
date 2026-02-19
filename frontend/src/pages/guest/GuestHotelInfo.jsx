import { useState } from "react";
import GuestHeader from "../../components/guest/GuestHeader";
import GuestLuxuryTheme from "../../components/guest/GuestLuxuryTheme";
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
    <GuestLuxuryTheme>
      <div className="min-h-screen pb-24">
        <GuestHeader />
        <div className="max-w-xl mx-auto px-4 pt-6">
          <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--text)" }}>
            🏨 Hotel Information
          </h1>
          <div className="flex gap-2 mb-6 flex-wrap">
            {Object.keys(sections).map((key) => (
              <button
                key={key}
                onClick={() => setExpandedSection(key)}
                className={`px-4 py-2 rounded-full text-sm font-semibold ${expandedSection === key ? "bg-rose-200 text-rose-900" : "bg-gray-100 text-gray-700"}`}
              >
                {sections[key].title}
              </button>
            ))}
          </div>
          <div className="bg-white rounded-2xl shadow p-6">
            {/* Section content */}
            {expandedSection === "amenities" && (
              <ul className="grid grid-cols-2 gap-3">
                {sections.amenities.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <span className="text-lg">{item.icon}</span> {item.name}
                  </li>
                ))}
              </ul>
            )}
            {expandedSection === "wifi" && (
              <ul className="space-y-2">
                {sections.wifi.items.map((item, i) => (
                  <li key={i} className="flex justify-between text-sm">
                    <span>{item.label}</span>
                    <span className="font-semibold">{item.value}</span>
                  </li>
                ))}
              </ul>
            )}
            {expandedSection === "roomServices" && (
              <ul className="grid grid-cols-2 gap-3">
                {sections.roomServices.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <span className="text-lg">{item.icon}</span> {item.name}
                  </li>
                ))}
              </ul>
            )}
            {expandedSection === "emergency" && (
              <ul className="space-y-2">
                {sections.emergency.items.map((item, i) => (
                  <li key={i} className="flex justify-between text-sm">
                    <span>{item.label}</span>
                    <span className="font-semibold">{item.value}</span>
                  </li>
                ))}
              </ul>
            )}
            {expandedSection === "dining" && (
              <ul className="grid grid-cols-2 gap-3">
                {sections.dining.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <span className="text-lg">{item.icon}</span> {item.name}
                    <span className="ml-auto text-xs text-gray-500">{item.info}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </GuestLuxuryTheme>
  );
}
