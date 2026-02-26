import express from "express";
import adminAuth from "../middleware/adminAuth.middleware.js";
import allowRoles from "../middleware/role.middleware.js";
import Room from "../models/Room.js";

const router = express.Router();

/**
 * ADMIN / SUPER_ADMIN → Get AVAILABLE rooms
 */
router.get(
  "/available",
  adminAuth,
  allowRoles("SUPER_ADMIN"),
  async (req, res) => {
    try {
      const rooms = await Room.find({ status: "AVAILABLE" }).sort({
        roomNumber: 1,
      });

      res.json(rooms);
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch rooms",
      });
    }
  }
);

/**
 * SUPER_ADMIN → Get ALL rooms (occupied + available)
 */
router.get(
  "/all",
  adminAuth,
  allowRoles("SUPER_ADMIN"),
  async (req, res) => {
    try {
      const rooms = await Room.find().sort({
        roomNumber: 1,
      });

      res.json(rooms);
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch rooms",
      });
    }
  }
);


// PUBLIC: Get status of a room by room number
router.get("/status/:roomNumber", async (req, res) => {
  try {
    const { roomNumber } = req.params;
    const room = await Room.findOne({ roomNumber });
    if (!room) {
      return res.status(404).json({ status: "NOT_FOUND" });
    }
    return res.json({ status: room.status });
  } catch (error) {
    res.status(500).json({ status: "ERROR", message: "Failed to fetch room status" });
  }
});

export default router;
