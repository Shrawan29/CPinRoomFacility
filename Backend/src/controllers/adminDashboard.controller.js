import Room from "../models/Room.js";
import GuestSession from "../models/GuestSession.js";
import Order from "../models/Order.js";
import mongoose from "mongoose";
import dataSyncService from "../services/dataSync.service.js";

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
      .sort({ syncedAt: -1, updatedAt: -1, createdAt: -1 })
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
      .collation({ locale: "en", numericOrdering: true })
      .sort({ roomNumber: 1 })
      .lean();

    res.json(rooms);
  } catch (error) {
    res.status(500).json({
      message: "Failed to load rooms",
    });
  }
};

export const getSyncStatus = async (req, res) => {
  try {
    const targetDbName = mongoose.connection?.name;
    const [roomsCount, syncedGuestsCount] = await Promise.all([
      Room.countDocuments(),
      GuestSession.countDocuments({ source: "HOTEL_SYNC" }),
    ]);

    res.json({
      targetDbName,
      roomsCount,
      syncedGuestsCount,
      sync: dataSyncService.getStatus(),
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to load sync status",
    });
  }
};
