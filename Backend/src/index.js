import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";
import { initializeEventScheduler } from "./services/eventScheduler.service.js";
import dataSyncService from "./services/dataSync.service.js";

// routes
import adminAuthRoutes from "./routes/adminAuth.routes.js";
import adminManagementRoutes from "./routes/adminManagement.routes.js";
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
import QRToken from "./models/QRToken.js";
import GuestCredential from "./models/GuestCredential.js";
import GuestSession from "./models/GuestSession.js";

// middleware
import adminAuth from "./middleware/adminAuth.middleware.js";

import guestEventRoutes from "./routes/guestEvent.routes.js";



dotenv.config();
connectDB();

// Initialize event scheduler when server starts
initializeEventScheduler();

// Initialize data sync service when server starts
dataSyncService.initialize();

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
app.use("/admin/dashboard", adminDashboardRoutes);
app.use("/admin/reports", adminReportRoutes);
app.use("/admin/orders", orderAdminRoutes);
app.use("/admin/kitchen/orders", orderKitchenRoutes);
app.use("/admin/events", eventRoutes);

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
app.use("/guest/events", guestEventRoutes);

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

app.get("/debug/guest-credentials", async (req, res) => {
  const credentials = await GuestCredential.find().select("-passwordHash");
  const withHints = credentials.map((c) => {
    const cred = c.toObject();
    const tokens = String(cred.guestName || "").trim().split(/\s+/).filter(Boolean);
    const titleTokens = new Set(["MR.", "MS.", "MRS.", "DR."]);
    const withoutTitle = tokens.length > 0 && titleTokens.has(tokens[0]) ? tokens.slice(1) : tokens;
    const lastName = withoutTitle.length > 0 ? withoutTitle[withoutTitle.length - 1] : "";
    return {
      ...cred,
      passwordHint: `${cred.roomNumber}_${lastName}`,
    };
  });
  res.json({ count: withHints.length, credentials: withHints });
});

app.get("/debug/guest-sessions", async (req, res) => {
  const sessions = await GuestSession.find().limit(10);
  res.json({ count: sessions.length, sessions });
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
