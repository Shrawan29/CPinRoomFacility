import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import adminAuthRoutes from "./routes/adminAuth.routes.js";
import adminAuth from "./middleware/adminAuth.middleware.js";
import adminManagementRoutes from "./routes/adminManagement.routes.js";
import Room from "./models/Room.js";
import Admin from "./models/Admin.js";
import ActiveStay from "./models/ActiveStay.js";
import adminStayRoutes from "./routes/adminStay.routes.js";
import qrRoutes from "./routes/qr.routes.js";
import guestAuthRoutes from "./routes/guestAuth.routes.js";
import guestProtectedRoutes from "./routes/guestProtected.routes.js";
import menuRoutes from "./routes/menu.routes.js";
import orderGuestRoutes from "./routes/orderGuest.routes.js";
import orderAdminRoutes from "./routes/orderAdmin.routes.js";
import hotelInfoRoutes from "./routes/hotelInfo.routes.js";
import eventRoutes from "./routes/event.routes.js";
import roomRoutes from "./routes/room.routes.js";
import adminDashboardRoutes from "./routes/adminDashboard.routes.js";
import adminReportRoutes from "./routes/adminReport.routes.js";
import orderKitchenRoutes from "./routes/orderKitchen.routes.js";
import QRToken from "./models/QRToken.js";

dotenv.config();
connectDB();

const app = express();

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (
      origin === "http://localhost:5173" ||
      origin.endsWith(".vercel.app")
    ) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.use(express.json());



app.use("/admin", adminAuthRoutes);
app.use("/admin/kitchen/orders", orderKitchenRoutes);
app.use("/admin/dashboard", adminDashboardRoutes);
app.use("/rooms", roomRoutes);
app.use("/admin/reports", adminReportRoutes);
app.use("/admin/manage", adminManagementRoutes);
app.use("/admin/stay", adminStayRoutes);
app.use("/qr", qrRoutes);
app.use("/guest/auth", guestAuthRoutes);
app.use("/guest", guestProtectedRoutes);
app.use("/menu", menuRoutes);
app.use("/guest/orders", orderGuestRoutes);
app.use("/admin/orders", orderAdminRoutes);
app.use("/hotel-info", hotelInfoRoutes);
app.use("/events", eventRoutes);

app.get("/admin/protected-test", adminAuth, (req, res) => {
  res.json({
    message: "Admin access granted",
    admin: req.admin
  });
});

app.get("/debug/admins", async (req, res) => {
  try {
    const admins = await Admin.find().select("-passwordHash");
    res.json({
      count: admins.length,
      admins: admins
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/debug/create-test-stay", async (req, res) => {
  try {
    // Create a test active stay
    const testStay = await ActiveStay.create({
      guestName: "Test Guest",
      phone: "9999999999",
      roomNumber: "101",
      status: "ACTIVE",
      checkInAt: new Date()
    });
    
    res.json({
      message: "Test stay created",
      stay: testStay
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/debug/active-stays", async (req, res) => {
  try {
    const stays = await ActiveStay.find();
    res.json({
      count: stays.length,
      stays: stays
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/debug/qr-tokens", async (req, res) => {
  try {
    const tokens = await QRToken.find().limit(10);
    res.json({
      count: tokens.length,
      tokens: tokens
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/debug/rooms", async (req, res) => {
  const rooms = await Room.find();
  res.json(rooms);
});

app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Hotel App Backend Running" });
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
