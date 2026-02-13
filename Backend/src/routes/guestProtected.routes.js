import express from "express";
import guestAuth from "../middleware/guestAuth.middleware.js";

const router = express.Router();

router.get("/dashboard", guestAuth, (req, res) => {
  res.json({
    message: "Guest access granted",
    guestName: req.guest.guestName,
    roomNumber: req.guest.roomNumber
  });
});

export default router;
