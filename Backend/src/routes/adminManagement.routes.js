import express from "express";
import adminAuth from "../middleware/adminAuth.middleware.js";
import allowRoles from "../middleware/role.middleware.js";
import {
  createAdmin,
  listAdmins,
  deactivateAdmin,
  updateAdmin,
  deleteAdmin
} from "../controllers/adminManagement.controller.js";

const router = express.Router();

router.post(
  "/create",
  adminAuth,
  allowRoles("SUPER_ADMIN"),
  createAdmin
);

router.get(
  "/admins",
  adminAuth,
  allowRoles("SUPER_ADMIN"),
  listAdmins
);

router.patch(
  "/deactivate/:id",
  adminAuth,
  allowRoles("SUPER_ADMIN"),
  deactivateAdmin
);

router.patch(
  "/update/:id",
  adminAuth,
  allowRoles("SUPER_ADMIN"),
  updateAdmin
);

router.delete(
  "/delete/:id",
  adminAuth,
  allowRoles("SUPER_ADMIN"),
  deleteAdmin
);

export default router;
