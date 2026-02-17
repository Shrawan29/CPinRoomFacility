import mongoose from "mongoose";
import dotenv from "dotenv";
import GuestSession from "../src/models/GuestSession.js";
import GuestCredential from "../src/models/GuestCredential.js";
import {
  extractLastNameFromGuestName,
  normalizeGuestName,
  normalizePasswordInput,
  normalizeRoomNumber,
} from "../src/utils/guestName.util.js";

dotenv.config();

const backfill = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error("❌ MONGO_URI is missing in environment (.env)");
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);

    const now = new Date();

    // Use active (non-expired) sessions as the source of truth.
    const sessions = await GuestSession.find({ expiresAt: { $gt: now } })
      .select("guestName roomNumber")
      .lean();

    if (sessions.length === 0) {
      console.log("ℹ️  No active guest sessions found. Nothing to backfill.");
      process.exit(0);
    }

    const uniquePairs = new Map();
    for (const s of sessions) {
      const canonicalGuestName = normalizeGuestName(s.guestName);
      const roomNumber = normalizeRoomNumber(s.roomNumber);
      if (!canonicalGuestName || !roomNumber) continue;
      uniquePairs.set(`${roomNumber}::${canonicalGuestName}`, {
        guestName: canonicalGuestName,
        roomNumber,
      });
    }

    const ops = [];
    for (const pair of uniquePairs.values()) {
      const lastName = extractLastNameFromGuestName(pair.guestName);
      const passwordHint = `${pair.roomNumber}_${lastName}`;
      const canonicalPassword = normalizePasswordInput(passwordHint);
      const passwordHash = await GuestCredential.hashPassword(canonicalPassword);

      ops.push({
        updateOne: {
          filter: {
            guestName: pair.guestName,
            roomNumber: pair.roomNumber,
            status: "ACTIVE",
          },
          update: {
            $set: {
              source: "HOTEL_SYNC",
              guestName: pair.guestName,
              roomNumber: pair.roomNumber,
              passwordHash,
              status: "ACTIVE",
            },
          },
          upsert: true,
        },
      });
    }

    if (ops.length > 0) {
      await GuestCredential.bulkWrite(ops, { ordered: false });
    }

    const total = await GuestCredential.countDocuments();
    console.log(`✅ Backfilled/updated ${ops.length} guest credentials from active sessions.`);
    console.log(`📦 GuestCredentials total in DB now: ${total}`);

    const sample = await GuestCredential.find({ status: "ACTIVE" })
      .sort({ updatedAt: -1 })
      .limit(5)
      .select("guestName roomNumber source status")
      .lean();

    console.log("\n📝 Sample login hints (password is case-insensitive):");
    for (const c of sample) {
      const lastName = extractLastNameFromGuestName(c.guestName);
      console.log(`  Room ${c.roomNumber}: ${c.guestName} / ${c.roomNumber}_${lastName}`);
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Backfill failed:", error.message);
    process.exit(1);
  }
};

backfill();
