import Room from "../models/Room.js";
import ActiveStay from "../models/ActiveStay.js";

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
      activeStays,
      todayCheckIns,
      todayCheckOuts,
    ] = await Promise.all([
      Room.countDocuments(),
      Room.countDocuments({ status: "AVAILABLE" }),
      Room.countDocuments({ status: "OCCUPIED" }),
      ActiveStay.countDocuments({ status: "ACTIVE" }),
      ActiveStay.countDocuments({
        checkInAt: { $gte: todayStart, $lte: todayEnd },
      }),
      ActiveStay.countDocuments({
        checkOutAt: { $gte: todayStart, $lte: todayEnd },
      }),
    ]);

    res.json({
      totalRooms,
      availableRooms,
      occupiedRooms,
      activeStays,
      todayCheckIns,
      todayCheckOuts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to load dashboard stats",
    });
  }
};
