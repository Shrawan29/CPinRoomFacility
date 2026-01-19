import express from "express";
import {
  sendGuestOTP,
  verifyGuestOTP
} from "../controllers/guestAuth.controller.js";

const router = express.Router();

router.post("/send-otp", sendGuestOTP);
router.post("/verify-otp", verifyGuestOTP);

export default router;
