import "dotenv/config";
import mongoose from "mongoose";

import connectDB from "../src/config/db.js";
import HotelInfo from "../src/models/HotelInfo.js";

const toService = ({ name, desc, hours, tag }) => {
  const parts = [String(desc || "").trim()].filter(Boolean);
  if (tag) parts.push(`Tag: ${tag}`);
  if (hours) parts.push(`Hours: ${hours}`);
  return {
    name,
    description: parts.join("\n"),
    available: true,
  };
};

const toAmenity = ({ name, desc, hours, tag }) => {
  const parts = [String(desc || "").trim()].filter(Boolean);
  if (tag) parts.push(`Tag: ${tag}`);
  if (hours) parts.push(`Hours: ${hours}`);
  return {
    name,
    available: true,
    _metaDescription: parts.join("\n"),
  };
};

const run = async () => {
  if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI is not set. Add it to Backend/.env");
    process.exit(1);
  }

  await connectDB();

  // This payload mirrors the legacy hardcoded content previously in
  // frontend/src/pages/guest/GuestHotelInfo.jsx (commit ce26db9).
  const payload = {
    basicInfo: {
      name: "Centre Point Nagpur",
      description: "",
      address: "",
      contactPhone: "+91 9266923456",
      contactEmail: "info.nagpur@cpgh.in",
    },
    amenities: [
      { name: "Swimming Pool", available: true },
      { name: "Spa & Sauna", available: true },
      { name: "Gym & Fitness", available: true },
      { name: "Airport Pickup / Drop", available: true },
      { name: "Valet Parking", available: true },
      { name: "Express Laundry", available: true },
      { name: "Left Luggage Room", available: true },
      { name: "Electric Charging Point", available: true },
    ],
    services: [
      toService({
        name: "Freakk de Bistro",
        desc: "All-day dining with eclectic continental & Indian flavours",
        hours: "7:00 AM – 11:00 PM",
        tag: "All-Day Dining",
      }),
      toService({
        name: "Bougainvillea",
        desc: "Speciality restaurant featuring multi-cuisine gourmet offerings",
        hours: "12:00 PM – 11:30 PM",
        tag: "Speciality",
      }),
      toService({
        name: "Meeting Point",
        desc: "Casual café-lounge for quick bites, beverages & informal meetings",
        hours: "6:00 AM – 10:00 PM",
        tag: "Café Lounge",
      }),
      toService({
        name: "High Steaks Rooftop",
        desc: "Rooftop bar & grill with panoramic city views and premium steaks",
        hours: "5:00 PM – 1:00 AM",
        tag: "Rooftop Bar",
      }),
      toService({
        name: "In-room Dining",
        desc: "24/7 room service delivered directly to your door",
        hours: "Available 24/7",
        tag: "Room Service",
      }),
      toService({
        name: "Business Centre",
        desc: "High-speed internet, printing, scanning & secretarial support",
        hours: "8:00 AM – 8:00 PM",
        tag: "Business",
      }),
      toService({
        name: "MICE Facilities",
        desc: "Banquets & conference halls: Palacio, Millennium, Sammelan, Grand Millennium, Sapphire",
        hours: "On request",
        tag: "Events",
      }),
      toService({
        name: "Board Room",
        desc: "Private boardroom with AV equipment, ideal for executive meetings",
        hours: "On request",
        tag: "Meeting",
      }),
      toService({
        name: "Concierge Service",
        desc: "Dedicated concierge for travel arrangements, tickets, tours & more",
        hours: "Available 24/7",
        tag: "Service",
      }),
      {
        name: "Wi-Fi",
        description: [
          "Network Name (SSID): CentrePoint-Guest",
          "Password: Guest@2024",
          "Speed: 100 Mbps",
          "Coverage: Entire hotel including all rooms",
          "Tech Support: Dial 0 from room phone",
        ].join("\n"),
        available: true,
      },
      {
        name: "EV Charging",
        description: "EV charging stations available in the hotel parking area\nHours: Available 24/7\nTag: EV Friendly",
        available: true,
      },
    ],
    policies: [
      "Check-out Time: 12:00 PM (Noon)",
      "Late Check-out: Available on request (extra charges apply)",
      "Luggage Storage: Available after check-out",
      "Early Check-in: Subject to room availability",
      "Return Keys To: Front Desk",
      "Billing Queries: Dial 1 or visit Front Desk",
      "Emergency Hotline: 0 (from room phone)",
      "Reception: Ext. 1",
      "Security: Ext. 2",
      "Medical Assistance: Ext. 3",
      "Fire Emergency: Ext. 4",
      "In-room Safe: Available in all rooms",
      "Direct Hotel Line: 0712-6699000",
    ],
    emergency: {
      frontDeskNumber: "0712-6699000 / Dial 0 (from room phone) / Ext. 1",
      ambulanceNumber: "Ext. 3",
      fireSafetyInfo: "Fire Emergency: Ext. 4",
    },

    guestDisplay: {
      dining: {
        headline: "Culinary Experiences",
        sub: "Four distinctive venues, one unforgettable stay",
        accent: "linear-gradient(135deg,#5c001a 0%,#A4005D 100%)",
        items: [
          {
            name: "Freakk de Bistro",
            icon: "🍸",
            desc: "All-day dining with eclectic continental & Indian flavours",
            hours: "7:00 AM – 11:00 PM",
            tag: "All-Day Dining",
          },
          {
            name: "Bougainvillea",
            icon: "🌸",
            desc: "Speciality restaurant featuring multi-cuisine gourmet offerings",
            hours: "12:00 PM – 11:30 PM",
            tag: "Speciality",
          },
          {
            name: "Meeting Point",
            icon: "☕",
            desc: "Casual café-lounge for quick bites, beverages & informal meetings",
            hours: "6:00 AM – 10:00 PM",
            tag: "Café Lounge",
          },
          {
            name: "High Steaks Rooftop",
            icon: "🥩",
            desc: "Rooftop bar & grill with panoramic city views and premium steaks",
            hours: "5:00 PM – 1:00 AM",
            tag: "Rooftop Bar",
          },
          {
            name: "In-room Dining",
            icon: "🛎️",
            desc: "24/7 room service delivered directly to your door",
            hours: "Available 24/7",
            tag: "Room Service",
          },
        ],
      },
      wellness: {
        headline: "Spa & Recreation",
        sub: "Rejuvenate body, mind and soul",
        accent: "linear-gradient(135deg,#2d1500 0%,#8a5200 100%)",
        items: [
          {
            name: "Swimming Pool",
            icon: "🏊",
            desc: "Temperature-controlled outdoor pool with sun deck and poolside service",
            hours: "6:00 AM – 9:00 PM",
            tag: "Outdoor",
          },
          {
            name: "Spa & Sauna",
            icon: "🧖",
            desc: "Traditional sauna and wellness treatments for complete relaxation",
            hours: "9:00 AM – 9:00 PM",
            tag: "Wellness",
          },
          {
            name: "Gym & Fitness",
            icon: "💪",
            desc: "State-of-the-art cardio machines, free weights & more",
            hours: "5:30 AM – 10:00 PM",
            tag: "Fitness",
          },
        ],
      },
      business: {
        headline: "Business & Events",
        sub: "World-class MICE facilities in the heart of Nagpur",
        accent: "linear-gradient(135deg,#082036 0%,#1a6a8a 100%)",
        items: [
          {
            name: "Business Centre",
            icon: "💼",
            desc: "High-speed internet, printing, scanning & secretarial support",
            hours: "8:00 AM – 8:00 PM",
            tag: "Business",
          },
          {
            name: "MICE Facilities",
            icon: "🎤",
            desc: "Banquets & conference halls: Palacio, Millennium, Sammelan, Grand Millennium, Sapphire",
            hours: "On request",
            tag: "Events",
          },
          {
            name: "Board Room",
            icon: "📋",
            desc: "Private boardroom with AV equipment, ideal for executive meetings",
            hours: "On request",
            tag: "Meeting",
          },
          {
            name: "Concierge Service",
            icon: "🎩",
            desc: "Dedicated concierge for travel arrangements, tickets, tours & more",
            hours: "Available 24/7",
            tag: "Service",
          },
        ],
      },
      facilities: {
        headline: "Hotel Facilities",
        sub: "Every convenience, thoughtfully provided",
        accent: "linear-gradient(135deg,#0e2e0e 0%,#2d6b2d 100%)",
        items: [
          {
            name: "Airport Pickup / Drop",
            icon: "✈️",
            desc: "Complimentary or chargeable airport transfers arranged by concierge",
            hours: "On request",
            tag: "Transfer",
          },
          {
            name: "Valet Parking",
            icon: "🅿️",
            desc: "Secure valet parking service available for all guests",
            hours: "Available 24/7",
            tag: "Parking",
          },
          {
            name: "Express Laundry",
            icon: "👕",
            desc: "Same-day laundry and dry-cleaning service for your convenience",
            hours: "8:00 AM – 8:00 PM",
            tag: "Laundry",
          },
          {
            name: "Left Luggage Room",
            icon: "🧳",
            desc: "Secure luggage storage before check-in and after check-out",
            hours: "Available 24/7",
            tag: "Storage",
          },
          {
            name: "Electric Charging Point",
            icon: "⚡",
            desc: "EV charging stations available in the hotel parking area",
            hours: "Available 24/7",
            tag: "EV Friendly",
          },
        ],
      },
      wifi: {
        headline: "Wi-Fi & Connectivity",
        sub: "High-speed internet throughout the hotel",
        accent: "linear-gradient(135deg,#1a1a3e 0%,#4a4a9e 100%)",
        details: [
          { label: "Network Name (SSID)", value: "CentrePoint-Guest", icon: "📶" },
          { label: "Password", value: "Guest@2024", icon: "🔐" },
          { label: "Speed", value: "100 Mbps", icon: "⚡" },
          { label: "Coverage", value: "Entire hotel including all rooms", icon: "🏨" },
          { label: "Tech Support", value: "Dial 0 from room phone", icon: "📞" },
        ],
      },
      emergency: {
        headline: "Emergency & Safety",
        sub: "We're here for you, every hour of every day",
        accent: "linear-gradient(135deg,#3e0000 0%,#8b0000 100%)",
        details: [
          { label: "Emergency Hotline", value: "0 (from room phone)", icon: "🆘" },
          { label: "Reception", value: "Ext. 1", icon: "🛎️" },
          { label: "Security", value: "Ext. 2", icon: "🔒" },
          { label: "Medical Assistance", value: "Ext. 3", icon: "🏥" },
          { label: "Fire Emergency", value: "Ext. 4", icon: "🔥" },
          { label: "In-room Safe", value: "Available in all rooms", icon: "🗃️" },
          { label: "Direct Hotel Line", value: "0712-6699000", icon: "📞" },
        ],
      },
      checkout: {
        headline: "Check-out Information",
        sub: "Seamless departure, lasting memories",
        accent: "linear-gradient(135deg,#1a1200 0%,#6b5200 100%)",
        details: [
          { label: "Check-out Time", value: "12:00 PM (Noon)", icon: "🕛" },
          { label: "Late Check-out", value: "Available on request (extra charges apply)", icon: "🕑" },
          { label: "Luggage Storage", value: "Available after check-out", icon: "🧳" },
          { label: "Early Check-in", value: "Subject to room availability", icon: "🌅" },
          { label: "Return Keys To", value: "Front Desk", icon: "🗝️" },
          { label: "Billing Queries", value: "Dial 1 or visit Front Desk", icon: "🧾" },
        ],
      },
      contactCard: {
        items: [
          { icon: "📞", label: "+91 9266923456" },
          { icon: "📞", label: "0712-6699000" },
          { icon: "✉️", label: "info.nagpur@cpgh.in" },
        ],
      },
    },
  };

  // Store amenity descriptions (schema doesn't have a description field on amenities).
  // We intentionally duplicate a few key details into Services/Policies above.
  // This helper is kept only to preserve the legacy content in-code.
  void toAmenity;

  const existing = await HotelInfo.findOne().sort({ updatedAt: -1, createdAt: -1 });

  const doc = await HotelInfo.findOneAndUpdate(
    {},
    payload,
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
      sort: { updatedAt: -1, createdAt: -1 },
    },
  );

  if (existing) {
    console.log(`✅ Updated existing HotelInfo: ${doc._id}`);
  } else {
    console.log(`✅ Created HotelInfo: ${doc._id}`);
  }
};

run()
  .catch((e) => {
    console.error("❌ Seed failed", e);
    process.exitCode = 1;
  })
  .finally(async () => {
    try {
      await mongoose.disconnect();
    } catch {
      // ignore
    }
  });
