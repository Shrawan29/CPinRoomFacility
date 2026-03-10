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
const DEFAULT_SESSION_TTL_HOURS = 8;

const stableSessionId = (roomNumber, guestLabel) => {
  const input = `${roomNumber}::${guestLabel}`;
  const hash = crypto.createHash("sha1").update(input).digest("hex");
  return `hotel_${hash}`;
};

const computeExpiresAt = () => {
  const hoursEnv = process.env.HOTEL_GUEST_SESSION_HOURS;
  const daysEnv = process.env.HOTEL_GUEST_SESSION_DAYS;

  const hoursFromEnv = Number(hoursEnv);
  const hoursFromDays = Number(daysEnv) * 24;
  const ttlHours = Number.isFinite(hoursFromEnv) && hoursFromEnv > 0
    ? hoursFromEnv
    : (Number.isFinite(hoursFromDays) && hoursFromDays > 0 ? hoursFromDays : DEFAULT_SESSION_TTL_HOURS);

  return new Date(Date.now() + ttlHours * 60 * 60 * 1000);
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
    this.currentSyncPromise = null;
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
    if (this.currentSyncPromise) return this.currentSyncPromise;

    // Wait until mongoose is connected
    if (mongoose.connection.readyState !== 1) {
      return;
    }

    this.currentSyncPromise = (async () => {
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
        const activeGuestNamesByRoom = new Map();
        const expiresAt = computeExpiresAt();
        const syncedAt = new Date();

        // HOTEL_SYNC credentials are fully derived from the hotel source.
        // To avoid accumulating duplicate documents (historically caused by
        // status-filtered upserts), we discard inactive derived credentials on each sync.
        await GuestCredential.deleteMany({ source: "HOTEL_SYNC", status: "INACTIVE" });

        // Load existing HOTEL_SYNC credentials once so we can avoid re-hashing
        // when the expected plain password already matches the stored hash.
        const existingCredentials = await GuestCredential.find({
          source: "HOTEL_SYNC",
          status: "ACTIVE",
        })
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

          const activeGuestNames = new Set();
          for (const guestLabelRaw of guests) {
            const guestLabel = String(guestLabelRaw || "").trim();
            if (!guestLabel) continue;

            const normalizedGuest = normalizeGuestName(guestLabel);
            if (!normalizedGuest) continue;

            activeGuestNames.add(normalizedGuest);

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
                  },
                  update: {
                    $set: {
                      passwordHash,
                      status: "ACTIVE",
                    },
                    $setOnInsert: {
                      source: "HOTEL_SYNC",
                      guestName: normalizedGuest,
                      roomNumber,
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

          activeGuestNamesByRoom.set(roomNumber, activeGuestNames);
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

        // Deactivate stale HOTEL_SYNC credentials per room.
        // This prevents AVAILABLE rooms from still having ACTIVE guest credentials.
        // Also deactivates guests that are no longer present in an OCCUPIED room.
        const deactivateOps = [];
        for (const roomNumber of activeRoomNumbers) {
          const activeGuestNames = activeGuestNamesByRoom.get(roomNumber) || new Set();
          const activeNamesArray = Array.from(activeGuestNames);

          const filterBase = {
            source: "HOTEL_SYNC",
            roomNumber,
            status: "ACTIVE",
          };

          if (activeNamesArray.length === 0) {
            deactivateOps.push({
              updateMany: {
                filter: filterBase,
                update: { $set: { status: "INACTIVE" } },
              },
            });
          } else {
            deactivateOps.push({
              updateMany: {
                filter: {
                  ...filterBase,
                  guestName: { $nin: activeNamesArray },
                },
                update: { $set: { status: "INACTIVE" } },
              },
            });
          }
        }

        if (deactivateOps.length > 0) {
          await GuestCredential.bulkWrite(deactivateOps, { ordered: false });
        }

        // Cleanup APP sessions when a room has no registered guests.
        // This ensures that once a room is AVAILABLE, app-created sessions end immediately,
        // while still keeping the record for reporting/retention.
        const availableRooms = activeRoomNumbers.filter((roomNumber) => {
          const names = activeGuestNamesByRoom.get(roomNumber);
          return !names || names.size === 0;
        });
        if (availableRooms.length > 0) {
          await GuestSession.updateMany(
            {
              source: "APP",
              roomNumber: { $in: availableRooms },
              $or: [{ authExpiresAt: { $exists: false } }, { authExpiresAt: { $gt: syncedAt } }],
            },
            { $set: { authExpiresAt: syncedAt } }
          );
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
        this.currentSyncPromise = null;
      }
    })();

    return this.currentSyncPromise;
  }

  async syncRoom(roomNumberRaw) {
    if (this.currentSyncPromise) return this.currentSyncPromise;

    // Wait until mongoose is connected
    if (mongoose.connection.readyState !== 1) {
      return;
    }

    const roomNumber = String(roomNumberRaw || "").trim();
    if (!roomNumber) return;

    this.currentSyncPromise = (async () => {
      this.isSyncing = true;
      const startedAt = new Date();

      try {
        const sourceDbName = process.env.HOTEL_SOURCE_DB || "hotel";
        const sourceCollectionName = process.env.HOTEL_ROOMS_COLLECTION || "rooms";

        const roomNumberNum = Number(roomNumber);
        const canUseNumeric =
          Number.isFinite(roomNumberNum) && String(roomNumberNum) === roomNumber;

        const roomFilter = canUseNumeric
          ? { room: { $in: [roomNumber, roomNumberNum] } }
          : { room: roomNumber };

        const sourceDb = mongoose.connection.useDb(sourceDbName);
        const hotelRoom = await sourceDb
          .collection(sourceCollectionName)
          .findOne(roomFilter);

        const expiresAt = computeExpiresAt();
        const syncedAt = new Date();

        // If room not found in source, mirror as AVAILABLE + deactivate derived access.
        if (!hotelRoom) {
          await Room.updateOne(
            { roomNumber },
            { $set: { roomNumber, status: "AVAILABLE" } },
            { upsert: true }
          );
          await GuestCredential.updateMany(
            { source: "HOTEL_SYNC", roomNumber, status: "ACTIVE" },
            { $set: { status: "INACTIVE" } }
          );
          await GuestSession.deleteMany({ source: SYNC_SOURCE, roomNumber });
          await GuestSession.updateMany(
            {
              source: "APP",
              roomNumber,
              $or: [{ authExpiresAt: { $exists: false } }, { authExpiresAt: { $gt: syncedAt } }],
            },
            { $set: { authExpiresAt: syncedAt } }
          );

          this.lastRun = {
            ok: true,
            startedAt,
            finishedAt: new Date(),
            sourceDbName,
            sourceCollectionName,
            hotelRoomsFetched: 0,
            roomsCount: await Room.countDocuments(),
            guestsCount: await GuestSession.countDocuments({ source: SYNC_SOURCE }),
            note: `Room ${roomNumber} not found in source`,
          };

          return;
        }

        // Keep the target room status in sync
        const nextRoomStatus = toRoomStatus(hotelRoom);
        await Room.updateOne(
          { roomNumber },
          { $set: { roomNumber, status: nextRoomStatus } },
          { upsert: true }
        );

        const guests = Array.isArray(hotelRoom?.guests) ? hotelRoom.guests : [];
        const activeGuestNames = new Set();
        const activeSessionIds = [];

        // Load existing HOTEL_SYNC credentials for this room only
        const existingCredentials = await GuestCredential.find({
          source: "HOTEL_SYNC",
          roomNumber,
          status: "ACTIVE",
        })
          .select("guestName roomNumber passwordHash")
          .lean();
        const existingCredentialByName = new Map(
          existingCredentials.map((c) => [String(c.guestName), c])
        );

        const sessionOps = [];
        const credentialOps = [];

        for (const guestLabelRaw of guests) {
          const guestLabel = String(guestLabelRaw || "").trim();
          if (!guestLabel) continue;

          const normalizedGuest = normalizeGuestName(guestLabel);
          if (!normalizedGuest) continue;

          activeGuestNames.add(normalizedGuest);

          const sessionId = stableSessionId(roomNumber, guestLabel);
          activeSessionIds.push(sessionId);

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

          const lastName = extractLastNameFromGuestName(normalizedGuest);
          const plainPassword = normalizePasswordInput(`${roomNumber}_${lastName}`);
          const existing = existingCredentialByName.get(normalizedGuest);

          let needsPasswordUpdate = false;
          if (!existing) {
            needsPasswordUpdate = true;
          } else if (existing.passwordHash) {
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
                },
                update: {
                  $set: {
                    passwordHash,
                    status: "ACTIVE",
                  },
                  $setOnInsert: {
                    source: "HOTEL_SYNC",
                    guestName: normalizedGuest,
                    roomNumber,
                  },
                },
                upsert: true,
              },
            });
          }
        }

        if (sessionOps.length > 0) {
          await GuestSession.bulkWrite(sessionOps, { ordered: false });
        }
        if (credentialOps.length > 0) {
          await GuestCredential.bulkWrite(credentialOps, { ordered: false });
        }

        // Deactivate stale HOTEL_SYNC credentials for this room
        const activeNamesArray = Array.from(activeGuestNames);
        const credentialFilterBase = {
          source: "HOTEL_SYNC",
          roomNumber,
          status: "ACTIVE",
        };
        if (activeNamesArray.length === 0) {
          await GuestCredential.updateMany(credentialFilterBase, {
            $set: { status: "INACTIVE" },
          });
        } else {
          await GuestCredential.updateMany(
            { ...credentialFilterBase, guestName: { $nin: activeNamesArray } },
            { $set: { status: "INACTIVE" } }
          );
        }

        // Cleanup: remove synced sessions for this room that no longer exist in source
        if (activeSessionIds.length > 0) {
          await GuestSession.deleteMany({
            source: SYNC_SOURCE,
            roomNumber,
            sessionId: { $nin: activeSessionIds },
          });
        } else {
          await GuestSession.deleteMany({ source: SYNC_SOURCE, roomNumber });
          // Room has no guests => AVAILABLE => end APP sessions now (do not delete)
          await GuestSession.updateMany(
            {
              source: "APP",
              roomNumber,
              $or: [{ authExpiresAt: { $exists: false } }, { authExpiresAt: { $gt: syncedAt } }],
            },
            { $set: { authExpiresAt: syncedAt } }
          );
        }

        // Defensive: if the room is AVAILABLE, ensure APP sessions are ended.
        if (nextRoomStatus === "AVAILABLE") {
          await GuestSession.updateMany(
            {
              source: "APP",
              roomNumber,
              $or: [{ authExpiresAt: { $exists: false } }, { authExpiresAt: { $gt: syncedAt } }],
            },
            { $set: { authExpiresAt: syncedAt } }
          );
        }

        this.lastRun = {
          ok: true,
          startedAt,
          finishedAt: new Date(),
          sourceDbName,
          sourceCollectionName,
          hotelRoomsFetched: 1,
          roomsCount: await Room.countDocuments(),
          guestsCount: await GuestSession.countDocuments({ source: SYNC_SOURCE }),
          roomNumber,
        };
      } catch (error) {
        this.lastRun = {
          ok: false,
          startedAt,
          finishedAt: new Date(),
          error: error?.message || String(error),
          roomNumber,
        };
        console.error("[DataSync] Error syncing room:", error.message);
      } finally {
        this.isSyncing = false;
        this.currentSyncPromise = null;
      }
    })();

    return this.currentSyncPromise;
  }

  stop() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      console.log("[DataSync] Stopped");
    }
  }
}

export default new DataSyncService();
