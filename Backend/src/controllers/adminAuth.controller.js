import bcrypt from "bcrypt";
import Admin from "../models/Admin.js";
import { generateAdminToken } from "../services/jwt.service.js";

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (!admin) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    if (!admin.isActive) {
      return res.status(403).json({
        message: "Admin account is deactivated"
      });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    admin.lastLoginAt = new Date();
    await admin.save();

    const token = generateAdminToken(admin);

    res.json({
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};
