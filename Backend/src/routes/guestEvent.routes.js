import express from "express";
import { getActiveEventById, listActiveEvents } from "../controllers/event.controller.js";

const router = express.Router();

/* =========================
   GUEST
   ========================= */

// Get upcoming + active events only
router.get("/", listActiveEvents);

// Get single event details (upcoming/active only)
router.get("/:id", getActiveEventById);

export default router;