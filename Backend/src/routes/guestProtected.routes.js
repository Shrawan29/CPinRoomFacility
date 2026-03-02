import express from "express";
import guestAuth from "../middleware/guestAuth.middleware.js";
import { guestChat } from "../controllers/guestChat.controller.js";

const router = express.Router();

router.get("/dashboard", guestAuth, (req, res) => {
  res.json({
    message: "Guest access granted",
    guestName: req.guest.guestName,
    roomNumber: req.guest.roomNumber
  });
});

// Chat bot (guest) — uses OpenAI, restricted to events + menu data only
router.post("/chat", guestAuth, guestChat);

export default router;
