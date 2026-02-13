import Room from "../models/Room.js";
import GuestSession from "../models/GuestSession.js";

class DataSyncService {
  constructor() {
    this.isSyncing = false;
    this.syncInterval = null;
  }

  initialize() {
    console.log("[DataSync] Initializing - will sync rooms and guests every 10 seconds");
    
    // Sync immediately on startup
    this.syncData();
    
    // Then sync every 10 seconds
    this.syncInterval = setInterval(() => {
      this.syncData();
    }, 10000); // 10 seconds
  }

  async syncData() {
    if (this.isSyncing) return;

    this.isSyncing = true;

    try {
      const [roomsCount, guestsCount] = await Promise.all([
        Room.countDocuments(),
        GuestSession.countDocuments({ expiresAt: { $gt: new Date() } }),
      ]);

      console.log(
        `[DataSync] Synced - Rooms: ${roomsCount}, Active Guests: ${guestsCount}`
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
