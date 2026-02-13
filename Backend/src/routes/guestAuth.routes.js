import express from "express";
import { guestLogin } from "../controllers/guestAuth.controller.js";

const router = express.Router();

// Guest login endpoint
router.post("/login", guestLogin);

export default router;
