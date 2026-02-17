import mongoose from "mongoose";
import crypto from "crypto";
import bcrypt from "bcrypt";
import Room from "../models/Room.js";
import GuestSession from "../models/GuestSession.js";
import GuestCredential from "../models/GuestCredential.js";
import {
  normalizeGuestName,
  normalizePasswordInput,
  extractLastNameFromGuestName,
} from "../utils/guestName.util.js";

const SYNC_SOURCE = "HOTEL_SYNC";
const DEFAULT_SYNC_INTERVAL_MS = 10_000;
const DEFAULT_SESSION_TTL_DAYS = 7;

const stableSessionId = (roomNumber, guestLabel) => {
  const input = `${roomNumber}::${guestLabel}`;
  const hash = crypto.createHash("sha1").update(input).digest("hex");
  return `hotel_${hash}`;
};

const computeExpiresAt = () => {
  const days = Number(process.env.HOTEL_GUEST_SESSION_DAYS || DEFAULT_SESSION_TTL_DAYS);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + (Number.isFinite(days) ? days : DEFAULT_SESSION_TTL_DAYS));
  return expiresAt;
};

const toRoomStatus = (hotelRoomDoc) => {
  const guests = Array.isArray(hotelRoomDoc?.guests) ? hotelRoomDoc.guests : [];
  return guests.length > 0 ? "OCCUPIED" : "AVAILABLE";
};

class DataSyncService {
  constructor() {
    this.isSyncing = false;
    this.syncInterval = null;
    this.lastRun = null;
  }

  getStatus() {
    return {
      isSyncing: this.isSyncing,
      lastRun: this.lastRun,
    };
  }

  initialize() {
    const intervalMs = Number(process.env.DATA_SYNC_INTERVAL_MS || DEFAULT_SYNC_INTERVAL_MS);
    const effectiveIntervalMs = Number.isFinite(intervalMs)
      ? intervalMs
      : DEFAULT_SYNC_INTERVAL_MS;

    console.log(
      `[DataSync] Initializing - will sync hotel->test every ${Math.round(
        effectiveIntervalMs / 1000
      )} seconds`
    );
    
    // Sync immediately on startup
    this.syncData();
    
    // Then sync every 10 seconds
    this.syncInterval = setInterval(() => {
      this.syncData();
    }, effectiveIntervalMs);
  }

  async syncData() {
    if (this.isSyncing) return;

    // Wait until mongoose is connected
    if (mongoose.connection.readyState !== 1) {
      return;
    }

    this.isSyncing = true;

    const startedAt = new Date();

    try {
      const sourceDbName = process.env.HOTEL_SOURCE_DB || "hotel";
      const sourceCollectionName = process.env.HOTEL_ROOMS_COLLECTION || "rooms";

      const sourceDb = mongoose.connection.useDb(sourceDbName);
      const hotelRooms = await sourceDb
        .collection(sourceCollectionName)
        .find({})
        .toArray();

      const roomOps = [];
      const sessionOps = [];
      const credentialOps = [];
      const activeSyncedSessionIds = [];
      const activeRoomNumbers = [];
      const expiresAt = computeExpiresAt();
      const syncedAt = new Date();

      // Load existing HOTEL_SYNC credentials once so we can avoid re-hashing
      // when the expected plain password already matches the stored hash.
      const existingCredentials = await GuestCredential.find({ source: "HOTEL_SYNC", status: "ACTIVE" })
        .select("guestName roomNumber passwordHash")
        .lean();
      const existingCredentialByKey = new Map(
        existingCredentials.map((c) => [
          `${String(c.roomNumber)}::${String(c.guestName)}`,
          c,
        ])
      );

      for (const hotelRoom of hotelRooms) {
        const roomNumber = hotelRoom?.room?.toString?.() ?? "";
        if (!roomNumber) continue;

        activeRoomNumbers.push(roomNumber);

        roomOps.push({
          updateOne: {
            filter: { roomNumber },
            update: {
              $set: {
                roomNumber,
                status: toRoomStatus(hotelRoom),
              },
            },
            upsert: true,
          },
        });

        const guests = Array.isArray(hotelRoom?.guests) ? hotelRoom.guests : [];
        for (const guestLabelRaw of guests) {
          const guestLabel = String(guestLabelRaw || "").trim();
          if (!guestLabel) continue;

          const normalizedGuest = normalizeGuestName(guestLabel);
          if (!normalizedGuest) continue;

          const sessionId = stableSessionId(roomNumber, guestLabel);
          activeSyncedSessionIds.push(sessionId);

          sessionOps.push({
            updateOne: {
              filter: { sessionId },
              update: {
                $set: {
                  sessionId,
                  source: SYNC_SOURCE,
                  guestName: normalizedGuest,
                  roomNumber,
                  expiresAt,
                  syncedAt,
                },
              },
              upsert: true,
            },
          });

          // Create credentials once per (roomNumber, normalizedGuest)
          const credentialKey = `${roomNumber}::${normalizedGuest}`;
          const lastName = extractLastNameFromGuestName(normalizedGuest);
          const plainPassword = normalizePasswordInput(`${roomNumber}_${lastName}`);
          const existing = existingCredentialByKey.get(credentialKey);

          let needsPasswordUpdate = false;
          if (!existing) {
            needsPasswordUpdate = true;
          } else if (existing.passwordHash) {
            // If a credential exists but was created with an older password scheme,
            // bcrypt.compare will fail and we will transparently upgrade it.
            needsPasswordUpdate = !(await bcrypt.compare(plainPassword, existing.passwordHash));
          } else {
            needsPasswordUpdate = true;
          }

          if (needsPasswordUpdate) {
            const passwordHash = await GuestCredential.hashPassword(plainPassword);
            credentialOps.push({
              updateOne: {
                filter: {
                  source: "HOTEL_SYNC",
                  guestName: normalizedGuest,
                  roomNumber,
                  status: "ACTIVE",
                },
                update: {
                  $set: {
                    passwordHash,
                  },
                  $setOnInsert: {
                    source: "HOTEL_SYNC",
                    guestName: normalizedGuest,
                    roomNumber,
                    status: "ACTIVE",
                  },
                },
                upsert: true,
              },
            });

            // Keep local cache in sync to avoid repeated work in this cycle.
            existingCredentialByKey.set(credentialKey, {
              guestName: normalizedGuest,
              roomNumber,
              passwordHash,
            });
          }
        }
      }

      if (roomOps.length > 0) {
        await Room.bulkWrite(roomOps, { ordered: false });
      }

      // Cleanup: remove rooms that no longer exist in hotel.rooms
      // This keeps the target rooms collection as a true mirror of the source.
      if (activeRoomNumbers.length > 0) {
        await Room.deleteMany({ roomNumber: { $nin: activeRoomNumbers } });
      } else {
        await Room.deleteMany({});
      }

      if (sessionOps.length > 0) {
        await GuestSession.bulkWrite(sessionOps, { ordered: false });
      }

      if (credentialOps.length > 0) {
        await GuestCredential.bulkWrite(credentialOps, { ordered: false });
      }

      // Helpful dev-only output: show canonical login hints
      if (process.env.NODE_ENV !== "production") {
        const sample = await GuestCredential.find({
          source: "HOTEL_SYNC",
          status: "ACTIVE",
        })
          .sort({ updatedAt: -1 })
          .limit(5)
          .select("guestName roomNumber updatedAt")
          .lean();

        if (sample.length > 0) {
          console.log("[DataSync] Sample guest login hints (case-insensitive password):");
          for (const c of sample) {
            const lastName = extractLastNameFromGuestName(c.guestName);
            console.log(
              `  Room ${c.roomNumber}: ${c.guestName} / ${c.roomNumber}_${lastName}`
            );
          }
        }
      }

      // Cleanup: remove synced sessions that no longer exist in hotel.rooms
      if (activeSyncedSessionIds.length > 0) {
        await GuestSession.deleteMany({
          source: SYNC_SOURCE,
          sessionId: { $nin: activeSyncedSessionIds },
        });
      } else {
        await GuestSession.deleteMany({ source: SYNC_SOURCE });
      }

      const [syncedRoomsCount, syncedGuestsCount] = await Promise.all([
        Room.countDocuments(),
        GuestSession.countDocuments({ source: SYNC_SOURCE }),
      ]);

      this.lastRun = {
        ok: true,
        startedAt,
        finishedAt: new Date(),
        sourceDbName,
        sourceCollectionName,
        hotelRoomsFetched: hotelRooms.length,
        roomsCount: syncedRoomsCount,
        guestsCount: syncedGuestsCount,
      };

      console.log(
        `[DataSync] Synced from ${sourceDbName}.${sourceCollectionName} -> Rooms: ${syncedRoomsCount}, Guests: ${syncedGuestsCount}`
      );
    } catch (error) {
      this.lastRun = {
        ok: false,
        startedAt,
        finishedAt: new Date(),
        error: error?.message || String(error),
      };
      console.error("[DataSync] Error syncing data:", error.message);
    } finally {
      this.isSyncing = false;
    }
  }

  stop() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      console.log("[DataSync] Stopped");
    }
  }
}

export default new DataSyncService();
