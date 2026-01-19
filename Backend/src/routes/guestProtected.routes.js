import express from "express";
import guestAuth from "../middleware/guestAuth.middleware.js";

const router = express.Router();

router.get("/dashboard", guestAuth, (req, res) => {
  res.json({
    message: "Guest access granted",
    roomNumber: req.guest.roomNumber,
    phone: req.guest.phone
  });
});

export default router;
