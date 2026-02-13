import mongoose from "mongoose";
import dotenv from "dotenv";
import GuestCredential from "../src/models/GuestCredential.js";
import Room from "../src/models/Room.js";
import bcrypt from "bcrypt";

dotenv.config();

const seedGuestCredentials = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Get all rooms
    const rooms = await Room.find({});

    if (rooms.length === 0) {
      console.log("⚠️  No rooms found. Please seed rooms first using seedRooms.js");
      process.exit(1);
    }

    // Clear existing credentials
    await GuestCredential.deleteMany({});

    // Create credentials for each room
    const credentials = [];
    for (const room of rooms) {
      const guestName = `Guest_${room.roomNumber}`;
      const password = `${guestName}_${room.roomNumber}`.toLowerCase();
      const passwordHash = await GuestCredential.hashPassword(password);

      credentials.push({
        guestName,
        roomNumber: room.roomNumber,
        passwordHash,
        status: "ACTIVE",
      });
    }

    await GuestCredential.insertMany(credentials);

    console.log(`✅ Guest credentials seeded successfully for ${credentials.length} rooms`);
    console.log("\n📝 Sample Credentials:");
    credentials.slice(0, 3).forEach((cred) => {
      console.log(`   Room ${cred.roomNumber}: ${cred.guestName} / ${cred.guestName}_${cred.roomNumber}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding guest credentials:", error.message);
    process.exit(1);
  }
};

seedGuestCredentials();
