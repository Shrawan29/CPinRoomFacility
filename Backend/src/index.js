import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";

// routes
import adminAuthRoutes from "./routes/adminAuth.routes.js";
import adminManagementRoutes from "./routes/adminManagement.routes.js";
import adminStayRoutes from "./routes/adminStay.routes.js";
import adminDashboardRoutes from "./routes/adminDashboard.routes.js";
import adminReportRoutes from "./routes/adminReport.routes.js";
import orderKitchenRoutes from "./routes/orderKitchen.routes.js";
import orderAdminRoutes from "./routes/orderAdmin.routes.js";

import guestAuthRoutes from "./routes/guestAuth.routes.js";
import guestProtectedRoutes from "./routes/guestProtected.routes.js";
import orderGuestRoutes from "./routes/orderGuest.routes.js";

import roomRoutes from "./routes/room.routes.js";
import menuRoutes from "./routes/menu.routes.js";
import qrRoutes from "./routes/qr.routes.js";
import hotelInfoRoutes from "./routes/hotelInfo.routes.js";
import eventRoutes from "./routes/event.routes.js";

// models (used in debug routes)
import Room from "./models/Room.js";
import Admin from "./models/Admin.js";
import ActiveStay from "./models/ActiveStay.js";
import QRToken from "./models/QRToken.js";

// middleware
import adminAuth from "./middleware/adminAuth.middleware.js";

dotenv.config();
connectDB();

const app = express();

/* =========================================================
   CORS (RAILWAY + VERCEL SAFE)
   ========================================================= */
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (
      origin.startsWith("http://localhost") ||
      origin.endsWith(".vercel.app")
    ) {
      return callback(null, true);
    }

    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-guest-session"],
};

app.use(cors(corsOptions));

/* =========================================================
   GLOBAL OPTIONS HANDLER (CRITICAL FOR RAILWAY)
   ========================================================= */
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

/* =========================================================
   ROUTES
   ========================================================= */

// admin
app.use("/admin", adminAuthRoutes);
app.use("/admin/manage", adminManagementRoutes);
app.use("/admin/stay", adminStayRoutes);
app.use("/admin/dashboard", adminDashboardRoutes);
app.use("/admin/reports", adminReportRoutes);
app.use("/admin/orders", orderAdminRoutes);
app.use("/admin/kitchen/orders", orderKitchenRoutes);

// guest
// guest (PUBLIC)
app.use("/guest/auth", guestAuthRoutes);

// guest orders (protected internally)
app.use("/guest/orders", orderGuestRoutes);

// guest protected routes (MUST BE LAST)
app.use("/guest", guestProtectedRoutes);

// common
app.use("/rooms", roomRoutes);
app.use("/menu", menuRoutes);
app.use("/qr", qrRoutes);
app.use("/hotel-info", hotelInfoRoutes);
app.use("/events", eventRoutes);

/* =========================================================
   TEST & DEBUG ROUTES
   ========================================================= */

app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Hotel App Backend Running" });
});

app.get("/admin/protected-test", adminAuth, (req, res) => {
  res.json({
    message: "Admin access granted",
    admin: req.admin,
  });
});

app.get("/debug/admins", async (req, res) => {
  const admins = await Admin.find().select("-passwordHash");
  res.json({ count: admins.length, admins });
});

app.post("/debug/create-test-stay", async (req, res) => {
  const stay = await ActiveStay.create({
    guestName: "Test Guest",
    phone: "9999999999",
    roomNumber: "101",
    status: "ACTIVE",
    checkInAt: new Date(),
  });
  res.json({ message: "Test stay created", stay });
});

app.get("/debug/active-stays", async (req, res) => {
  const stays = await ActiveStay.find();
  res.json({ count: stays.length, stays });
});

app.get("/debug/qr-tokens", async (req, res) => {
  const tokens = await QRToken.find().limit(10);
  res.json({ count: tokens.length, tokens });
});

app.get("/debug/rooms", async (req, res) => {
  const rooms = await Room.find();
  res.json(rooms);
});

/* =========================================================
   START SERVER (RAILWAY SAFE)
   ========================================================= */

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
