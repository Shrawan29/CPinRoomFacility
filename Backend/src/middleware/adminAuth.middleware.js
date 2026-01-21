import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.error("❌ No authorization header:", authHeader);
      return res.status(401).json({
        message: "Authorization token missing"
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET);

    const admin = await Admin.findById(decoded.adminId);

    if (!admin || !admin.isActive) {
      console.error("❌ Admin not found or inactive:", decoded.adminId);
      return res.status(401).json({
        message: "Invalid or inactive admin"
      });
    }

    req.admin = {
      id: admin._id,
      role: admin.role
    };

    next();
  } catch (error) {
    console.error("❌ Auth error:", error.message);
    return res.status(401).json({
      message: "Invalid or expired token",
      error: error.message
    });
  }
};

export default adminAuth;
