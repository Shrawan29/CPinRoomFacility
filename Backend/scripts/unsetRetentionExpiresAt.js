import dotenv from "dotenv";
import mongoose from "mongoose";
import Order from "../src/models/Order.js";
import ServiceRequest from "../src/models/ServiceRequest.js";

dotenv.config();

const run = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("❌ MONGO_URI is not set");
    process.exit(1);
  }

  await mongoose.connect(mongoUri);
  console.log("✅ Connected");

  const orderRes = await Order.updateMany(
    { expiresAt: { $exists: true } },
    { $unset: { expiresAt: 1 } }
  );

  const requestRes = await ServiceRequest.updateMany(
    { expiresAt: { $exists: true } },
    { $unset: { expiresAt: 1 } }
  );

  console.log(
    `✅ Unset expiresAt: orders matched=${orderRes.matchedCount} modified=${orderRes.modifiedCount}`
  );
  console.log(
    `✅ Unset expiresAt: serviceRequests matched=${requestRes.matchedCount} modified=${requestRes.modifiedCount}`
  );

  await mongoose.disconnect();
  console.log("✅ Done");
};

run().catch((err) => {
  console.error("❌ Failed:", err);
  process.exit(1);
});
