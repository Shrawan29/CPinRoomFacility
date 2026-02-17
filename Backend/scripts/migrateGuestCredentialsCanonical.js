import mongoose from "mongoose";
import dotenv from "dotenv";
import GuestCredential from "../src/models/GuestCredential.js";
import {
  extractLastNameFromGuestName,
  normalizeGuestName,
  normalizePasswordInput,
} from "../src/utils/guestName.util.js";

dotenv.config();

const pickWinner = (a, b) => {
  // Prefer the most recently updated document; fall back to createdAt/_id.
  const aUpdated = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
  const bUpdated = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
  if (aUpdated !== bUpdated) return aUpdated > bUpdated ? a : b;

  const aCreated = a.createdAt ? new Date(a.createdAt).getTime() : 0;
  const bCreated = b.createdAt ? new Date(b.createdAt).getTime() : 0;
  if (aCreated !== bCreated) return aCreated > bCreated ? a : b;

  return String(a._id) > String(b._id) ? a : b;
};

const migrate = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error("❌ MONGO_URI is missing in environment (.env)");
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);

    const credentials = await GuestCredential.find({ status: "ACTIVE" })
      .select("source guestName roomNumber passwordHash createdAt updatedAt")
      .lean();

    if (credentials.length === 0) {
      console.log("ℹ️  No ACTIVE guest credentials found. Nothing to migrate.");
      process.exit(0);
    }

    const byCanonicalKey = new Map();
    const losersToDelete = [];

    for (const cred of credentials) {
      const canonicalGuestName = normalizeGuestName(cred.guestName);
      const roomNumber = String(cred.roomNumber || "").trim();
      if (!canonicalGuestName || !roomNumber) continue;

      const key = `${roomNumber}::${canonicalGuestName}`;
      const existing = byCanonicalKey.get(key);

      if (!existing) {
        byCanonicalKey.set(key, { ...cred, canonicalGuestName, roomNumber });
        continue;
      }

      const winner = pickWinner(existing, { ...cred, canonicalGuestName, roomNumber });
      const loser = winner._id === existing._id ? cred : existing;

      byCanonicalKey.set(key, winner);
      losersToDelete.push(loser._id);
    }

    const bulkOps = [];
    for (const entry of byCanonicalKey.values()) {
      const canonicalGuestName = entry.canonicalGuestName;
      const roomNumber = entry.roomNumber;

      const lastName = extractLastNameFromGuestName(canonicalGuestName);
      const passwordHint = `${roomNumber}_${lastName}`;
      const canonicalPassword = normalizePasswordInput(passwordHint);
      const passwordHash = await GuestCredential.hashPassword(canonicalPassword);

      bulkOps.push({
        updateOne: {
          filter: { _id: entry._id },
          update: {
            $set: {
              source: entry.source || "APP",
              guestName: canonicalGuestName,
              roomNumber,
              passwordHash,
              status: "ACTIVE",
            },
          },
        },
      });
    }

    if (bulkOps.length > 0) {
      await GuestCredential.bulkWrite(bulkOps, { ordered: false });
    }

    if (losersToDelete.length > 0) {
      await GuestCredential.deleteMany({ _id: { $in: losersToDelete } });
    }

    const sample = Array.from(byCanonicalKey.values())
      .slice(0, 5)
      .map((c) => ({ roomNumber: c.roomNumber, guestName: c.canonicalGuestName }));

    console.log(`✅ Migrated ${bulkOps.length} guest credentials to canonical format.`);
    if (losersToDelete.length > 0) {
      console.log(`🧹 Removed ${losersToDelete.length} duplicate credentials after canonicalization.`);
    }

    console.log("\n📝 Sample login hints (password is case-insensitive):");
    for (const c of sample) {
      const lastName = extractLastNameFromGuestName(c.guestName);
      console.log(`  Room ${c.roomNumber}: ${c.guestName} / ${c.roomNumber}_${lastName}`);
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  }
};

migrate();
