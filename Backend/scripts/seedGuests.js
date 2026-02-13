import mongoose from "mongoose";
import dotenv from "dotenv";
import GuestSession from "../src/models/GuestSession.js";

dotenv.config();

const generateSessionId = () => {
  return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const seedGuests = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Create 5 test guests with 7-day sessions
    const expiresAtDate = new Date();
    expiresAtDate.setDate(expiresAtDate.getDate() + 7);

    const guests = [
      {
        sessionId: generateSessionId(),
        guestName: "john_doe",
        roomNumber: "101",
        expiresAt: expiresAtDate,
      },
      {
        sessionId: generateSessionId(),
        guestName: "jane_smith",
        roomNumber: "102",
        expiresAt: expiresAtDate,
      },
      {
        sessionId: generateSessionId(),
        guestName: "bob_wilson",
        roomNumber: "103",
        expiresAt: expiresAtDate,
      },
      {
        sessionId: generateSessionId(),
        guestName: "alice_johnson",
        roomNumber: "104",
        expiresAt: expiresAtDate,
      },
      {
        sessionId: generateSessionId(),
        guestName: "charlie_brown",
        roomNumber: "105",
        expiresAt: expiresAtDate,
      },
    ];

    // Using insertMany with bypass errors for duplicates
    try {
      await GuestSession.insertMany(guests, { ordered: false });
    } catch (err) {
      // Some guests might already exist, that's fine
      if (err.code !== 11000) {
        throw err;
      }
    }

    console.log("✅ Test guests seeded successfully (5 guests)");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding guests:", error.message);
    process.exit(1);
  }
};

seedGuests();
