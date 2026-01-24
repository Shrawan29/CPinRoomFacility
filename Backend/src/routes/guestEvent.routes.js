import express from "express";
import { listActiveEvents } from "../controllers/event.controller.js";

const router = express.Router();

/* =========================
   GUEST
   ========================= */

// Get upcoming + active events only
router.get("/", listActiveEvents);

export default router;