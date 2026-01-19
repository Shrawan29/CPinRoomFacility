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
  allowRoles("ADMIN", "SUPER_ADMIN"),
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

export default router;
