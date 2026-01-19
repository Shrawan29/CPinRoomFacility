import mongoose from "mongoose";
import dotenv from "dotenv";
import Room from "../src/models/Room.js";

dotenv.config();

const seedRooms = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const rooms = [];
    for (let i = 101; i <= 105; i++) {
      rooms.push({ roomNumber: i.toString() });
    }

    await Room.insertMany(rooms);

    console.log("✅ Rooms seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding rooms:", error.message);
    process.exit(1);
  }
};

seedRooms();
