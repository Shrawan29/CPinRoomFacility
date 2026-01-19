import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import adminAuthRoutes from "./routes/adminAuth.routes.js";
import adminAuth from "./middleware/adminAuth.middleware.js";
import adminManagementRoutes from "./routes/adminManagement.routes.js";
import Room from "./models/Room.js";
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

dotenv.config();
connectDB();

const app = express();

app.use(cors());
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

app.get("/debug/rooms", async (req, res) => {
  const rooms = await Room.find();
  res.json(rooms);
});

app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Hotel App Backend Running" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
