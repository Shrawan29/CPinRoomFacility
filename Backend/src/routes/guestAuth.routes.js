import express from "express";
import {
	guestLogin,
	guestLoginByLastName,
} from "../controllers/guestAuth.controller.js";

const router = express.Router();

// Guest login endpoint
router.post("/login", guestLogin);

// Guest login by last name (QR flow)
router.post("/login-lastname", guestLoginByLastName);

export default router;
