import express from "express";
import { scanRoomQR } from "../controllers/qr.controller.js";

const router = express.Router();

// Guest scans QR
router.get("/scan/:roomNumber", scanRoomQR);

export default router;
