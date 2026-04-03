import bcrypt from "bcrypt";
import Admin from "../models/Admin.js";

const SUPER_ADMIN_MANAGED_ROLES = [
  "DINING_ADMIN",
  "HOUSEKEEPING_ADMIN",
  "HOUSEKEEPING_SUPERVISOR",
  "HOUSEKEEPING_STAFF",
];

const DINING_ADMIN_MANAGED_ROLES = [
  "HOUSEKEEPING_SUPERVISOR",
  "HOUSEKEEPING_STAFF",
];

const getManageableRoles = (requesterRole) => {
  if (requesterRole === "DINING_ADMIN") {
    return DINING_ADMIN_MANAGED_ROLES;
  }

  return SUPER_ADMIN_MANAGED_ROLES;
};

const canManageAdmin = (requesterRole, targetRole) => {
  if (requesterRole === "SUPER_ADMIN") {
    return targetRole !== "SUPER_ADMIN";
  }

  if (requesterRole === "DINING_ADMIN") {
    return DINING_ADMIN_MANAGED_ROLES.includes(targetRole);
  }

  return false;
};

/**
 * SUPER_ADMIN / DINING_ADMIN → Create ADMIN
 */
export const createAdmin = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    const manageableRoles = getManageableRoles(req.admin?.role);

    if (!manageableRoles.includes(role)) {
      return res.status(400).json({
        message: "Invalid admin role for this account",
      });
    }

    if (!name || !email || !phone || !password || !role) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingAdmin = await Admin.findOne({
      email: email.toLowerCase(),
    });

    if (existingAdmin) {
      return res.status(409).json({
        message: "Admin already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name,
      email: email.toLowerCase(),
      phone,
      passwordHash,
      role,
      isActive: true,
    });

    res.status(201).json({
      message: "Admin created successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        loginId: admin.email,
        phone: admin.phone,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * SUPER_ADMIN / DINING_ADMIN → List ADMINs
 */
export const listAdmins = async (req, res) => {
  const manageableRoles = getManageableRoles(req.admin?.role);

  const admins = await Admin.find({
    role: { $in: manageableRoles },
  }).select("-passwordHash");

  res.json(admins);
};

/**
 * SUPER_ADMIN / DINING_ADMIN → Deactivate ADMIN
 */
export const deactivateAdmin = async (req, res) => {
  const { id } = req.params;

  const admin = await Admin.findById(id);
  if (!admin) {
    return res.status(404).json({ message: "Admin not found" });
  }

  // Prevent SUPER_ADMIN deactivation
  if (admin.role === "SUPER_ADMIN") {
    return res.status(400).json({ message: "Cannot deactivate Super Admin" });
  }

  if (!canManageAdmin(req.admin?.role, admin.role)) {
    return res.status(403).json({
      message: "You can only manage supervisor and staff logins",
    });
  }

  // 🔁 Toggle boolean
  admin.isActive = !admin.isActive;
  await admin.save();

  res.json({
    message: `Admin ${admin.isActive ? "activated" : "deactivated"} successfully`,
    admin,
  });
};

export const updateAdmin = async (req, res) => {
  const { id } = req.params;
  const { role, phone } = req.body;

  const admin = await Admin.findById(id);
  if (!admin) {
    return res.status(404).json({ message: "Admin not found" });
  }

  if (admin.role === "SUPER_ADMIN") {
    return res.status(400).json({ message: "Cannot modify Super Admin" });
  }

  if (!canManageAdmin(req.admin?.role, admin.role)) {
    return res.status(403).json({
      message: "You can only manage supervisor and staff logins",
    });
  }

  if (role) {
    const manageableRoles = getManageableRoles(req.admin?.role);

    if (!manageableRoles.includes(role)) {
      return res.status(400).json({
        message: "Invalid admin role for this account",
      });
    }

    admin.role = role;
  }

  if (phone) admin.phone = phone;

  await admin.save();

  res.json({
    message: "Admin updated successfully",
    admin,
  });
};

export const deleteAdmin = async (req, res) => {
  const { id } = req.params;

  const admin = await Admin.findById(id);
  if (!admin) {
    return res.status(404).json({ message: "Admin not found" });
  }

  if (admin.role === "SUPER_ADMIN") {
    return res.status(400).json({ message: "Cannot delete Super Admin" });
  }

  if (!canManageAdmin(req.admin?.role, admin.role)) {
    return res.status(403).json({
      message: "You can only manage supervisor and staff logins",
    });
  }

  await Admin.findByIdAndDelete(id);

  res.json({
    message: "Admin deleted successfully",
    admin,
  });
};
