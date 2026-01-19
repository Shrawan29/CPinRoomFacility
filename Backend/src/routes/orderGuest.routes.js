import express from "express";
import guestAuth from "../middleware/guestAuth.middleware.js";
import { placeOrder,getMyOrders } from "../controllers/orderGuest.controller.js";

const router = express.Router();

router.post("/", guestAuth, placeOrder);
router.get("/", guestAuth, getMyOrders);
export default router;
