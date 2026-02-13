import mongoose from "mongoose";
import dotenv from "dotenv";
import Room from "../src/models/Room.js";

dotenv.config();

const seedRooms = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const rooms = [];
    for (let i = 101; i <= 110; i++) {
      rooms.push({ roomNumber: i.toString() });
    }

    // Use updateMany with upsert to avoid duplicate key errors
    for (const room of rooms) {
      await Room.updateOne(
        { roomNumber: room.roomNumber },
        { $setOnInsert: { ...room, status: "AVAILABLE" } },
        { upsert: true }
      );
    }

    console.log("✅ Rooms seeded successfully (10 rooms: 101-110)");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding rooms:", error.message);
    process.exit(1);
  }
};

seedRooms();
