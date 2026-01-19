import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import Admin from "../src/models/Admin.js";

dotenv.config();

const createSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existing = await Admin.findOne({ role: "SUPER_ADMIN" });

    if (existing) {
      console.log("❌ SUPER ADMIN already exists");
      process.exit(0);
    }

    const passwordHash = await bcrypt.hash("SuperAdmin@123", 10);

    await Admin.create({
      name: "Hotel Owner",
      email: "owner@hotel.com",
      phone: "9999999999",
      passwordHash,
      role: "SUPER_ADMIN",
      isActive: true
    });

    console.log("✅ SUPER ADMIN created successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
};

createSuperAdmin();
