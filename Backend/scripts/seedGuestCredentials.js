import mongoose from "mongoose";
import dotenv from "dotenv";
import GuestCredential from "../src/models/GuestCredential.js";
import Room from "../src/models/Room.js";
import { normalizeGuestName, normalizePasswordInput } from "../src/utils/guestName.util.js";

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
      const guestName = normalizeGuestName(`Guest_${room.roomNumber}`);
      const passwordHint = `${guestName}_${room.roomNumber}`;
      const passwordToStore = normalizePasswordInput(passwordHint);
      const passwordHash = await GuestCredential.hashPassword(passwordToStore);

      credentials.push({
        guestName,
        roomNumber: room.roomNumber,
        passwordHash,
        status: "ACTIVE",
      });
    }

    await GuestCredential.insertMany(credentials);

    console.log(`✅ Guest credentials seeded successfully for ${credentials.length} rooms`);
    console.log("\nℹ️  Login format:");
    console.log("   - Guest Name is normalized to a canonical format (case-insensitive)");
    console.log("   - Password hint is: {Guest Name}_{Room Number} (case-insensitive)");
    console.log(
      `   - Example normalization: \"AGRAWAL MR. 25357\" -> \"${normalizeGuestName(
        "AGRAWAL MR. 25357"
      )}\"`
    );
    console.log("\n📝 Sample Credentials:");
    credentials.slice(0, 3).forEach((cred) => {
      console.log(
        `   Room ${cred.roomNumber}: ${cred.guestName} / ${cred.guestName}_${cred.roomNumber}`
      );
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding guest credentials:", error.message);
    process.exit(1);
  }
};

seedGuestCredentials();
