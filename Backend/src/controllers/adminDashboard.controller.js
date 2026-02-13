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

export const getAllGuests = async (req, res) => {
  try {
    const guests = await GuestSession.find()
      .sort({ createdAt: -1 })
      .lean();

    res.json(guests);
  } catch (error) {
    res.status(500).json({
      message: "Failed to load guests",
    });
  }
};

export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find()
      .sort({ roomNumber: 1 })
      .lean();

    res.json(rooms);
  } catch (error) {
    res.status(500).json({
      message: "Failed to load rooms",
    });
  }
};
