import Room from "../models/Room.js";
import GuestSession from "../models/GuestSession.js";
import Order from "../models/Order.js";

export const getAdminDashboardStats = async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const [
      totalRooms,
      availableRooms,
      occupiedRooms,
      activeSessions,
      todayOrders,
    ] = await Promise.all([
      Room.countDocuments(),
      Room.countDocuments({ status: "AVAILABLE" }),
      Room.countDocuments({ status: "OCCUPIED" }),
      GuestSession.countDocuments({ expiresAt: { $gt: new Date() } }),
      Order.countDocuments({
        createdAt: { $gte: todayStart, $lte: todayEnd },
      }),
    ]);

    res.json({
      totalRooms,
      availableRooms,
      occupiedRooms,
      activeSessions,
      todayOrders,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to load dashboard stats",
    });
  }
};
