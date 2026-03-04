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
