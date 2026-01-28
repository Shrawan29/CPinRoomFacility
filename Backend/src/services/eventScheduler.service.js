import Event from "../models/Event.js";

/**
 * Update event statuses based on current date
 * - UPCOMING → ACTIVE (when date arrives)
 * - ACTIVE → COMPLETED (when date passes)
 * - Delete COMPLETED events older than 1 day
 */
export const updateEventStatuses = async () => {
  try {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Get today's date in UTC (00:00:00 UTC)
    const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
    
    // Get tomorrow's date in UTC (00:00:00 UTC)
    const tomorrow = new Date(today);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

    console.log(`[EventScheduler] Checking events for today: ${today.toISOString()} to ${tomorrow.toISOString()}`);

    // Update UPCOMING to ACTIVE if event date is today
    const upcomingResult = await Event.updateMany(
      {
        eventDate: { $gte: today, $lt: tomorrow },
        status: "UPCOMING"
      },
      { status: "ACTIVE" }
    );

    console.log(`[EventScheduler] Updated ${upcomingResult.modifiedCount} events from UPCOMING to ACTIVE`);

    // Update ACTIVE to COMPLETED if event date has passed
    const activeResult = await Event.updateMany(
      {
        eventDate: { $lt: today },
        status: "ACTIVE"
      },
      { status: "COMPLETED" }
    );

    console.log(`[EventScheduler] Updated ${activeResult.modifiedCount} events from ACTIVE to COMPLETED`);

    // Delete COMPLETED events that are older than 1 day
    const deletionResult = await Event.deleteMany({
      status: "COMPLETED",
      updatedAt: { $lt: oneDayAgo }
    });

    console.log(`[EventScheduler] Status updated successfully`);
    console.log(`[EventScheduler] Deleted ${deletionResult.deletedCount} old completed events`);

    return {
      success: true,
      deletedCount: deletionResult.deletedCount,
      upcomingCount: upcomingResult.modifiedCount,
      activeCount: activeResult.modifiedCount
    };
  } catch (error) {
    console.error(`[EventScheduler] Error updating event statuses:`, error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Initialize the scheduler to run every hour
 */
export const initializeEventScheduler = () => {
  // Run immediately on startup
  updateEventStatuses();

  // Run every hour (3600000 ms)
  const schedulerInterval = setInterval(() => {
    updateEventStatuses();
  }, 60 * 60 * 1000);

  // Also run every midnight for precise daily updates
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const msUntilMidnight = tomorrow.getTime() - now.getTime();

  const midnightScheduler = setTimeout(() => {
    updateEventStatuses();
    // After first midnight run, schedule it for every 24 hours
    setInterval(() => {
      updateEventStatuses();
    }, 24 * 60 * 60 * 1000);
  }, msUntilMidnight);

  console.log("[EventScheduler] Initialized - will update event statuses hourly and at midnight");

  return {
    schedulerInterval,
    midnightScheduler
  };
};
