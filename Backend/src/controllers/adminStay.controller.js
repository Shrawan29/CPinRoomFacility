import Room from "../models/Room.js";
import ActiveStay from "../models/ActiveStay.js";

/**
 * ADMIN / SUPER_ADMIN → Check-In Guest
 */
export const checkInGuest = async (req, res) => {
  try {
    const { guestName, phone, roomNumber } = req.body;

    if (!guestName || !phone || !roomNumber) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // 1. Check room exists
    const room = await Room.findOne({ roomNumber });
    if (!room) {
      return res.status(404).json({
        message: "Room does not exist"
      });
    }

    // 2. Room must be AVAILABLE
    if (room.status !== "AVAILABLE") {
      return res.status(400).json({
        message: "Room is already occupied"
      });
    }

    // 3. Create ActiveStay (DB-level indexes enforce rules)
    const stay = await ActiveStay.create({
      guestName,
      phone,
      roomNumber
    });

    // 4. Mark room as OCCUPIED
    room.status = "OCCUPIED";
    await room.save();

    res.status(201).json({
      message: "Guest checked in successfully",
      stay
    });
  } catch (error) {
    // Handle duplicate ACTIVE stay errors
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Guest or room already has an active stay"
      });
    }

    res.status(500).json({
      message: error.message
    });
  }
};

/**
 * ADMIN / SUPER_ADMIN → Check-Out Guest
 */
export const checkOutGuest = async (req, res) => {
  try {
    const { roomNumber } = req.body;

    if (!roomNumber) {
      return res.status(400).json({
        message: "Room number is required"
      });
    }

    // 1. Find active stay
    const stay = await ActiveStay.findOne({
      roomNumber,
      status: "ACTIVE"
    });

    if (!stay) {
      return res.status(404).json({
        message: "No active stay found for this room"
      });
    }

    // 2. Update stay
    stay.status = "CHECKED_OUT";
    stay.checkOutAt = new Date();
    await stay.save();

    // 3. Mark room as AVAILABLE
    const room = await Room.findOne({ roomNumber });
    room.status = "AVAILABLE";
    await room.save();

    res.json({
      message: "Guest checked out successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
export const getActiveStays = async (req, res) => {
  try {
    const stays = await ActiveStay.find({ status: "ACTIVE" })
      .sort({ checkInAt: -1 });

    res.json(stays);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch active stays",
    });
  }
};