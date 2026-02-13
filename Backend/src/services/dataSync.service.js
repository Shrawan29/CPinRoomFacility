import mongoose from "mongoose";
import crypto from "crypto";
import Room from "../models/Room.js";
import GuestSession from "../models/GuestSession.js";

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
      const activeSyncedSessionIds = [];
      const expiresAt = computeExpiresAt();
      const syncedAt = new Date();

      for (const hotelRoom of hotelRooms) {
        const roomNumber = hotelRoom?.room?.toString?.() ?? "";
        if (!roomNumber) continue;

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

          const sessionId = stableSessionId(roomNumber, guestLabel);
          activeSyncedSessionIds.push(sessionId);

          sessionOps.push({
            updateOne: {
              filter: { sessionId },
              update: {
                $set: {
                  sessionId,
                  source: SYNC_SOURCE,
                  guestName: guestLabel,
                  roomNumber,
                  expiresAt,
                  syncedAt,
                },
              },
              upsert: true,
            },
          });
        }
      }

      if (roomOps.length > 0) {
        await Room.bulkWrite(roomOps, { ordered: false });
      }

      if (sessionOps.length > 0) {
        await GuestSession.bulkWrite(sessionOps, { ordered: false });
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

      console.log(
        `[DataSync] Synced from ${sourceDbName}.${sourceCollectionName} -> Rooms: ${syncedRoomsCount}, Guests: ${syncedGuestsCount}`
      );
    } catch (error) {
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
