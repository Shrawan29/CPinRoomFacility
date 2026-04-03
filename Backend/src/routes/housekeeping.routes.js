import express from "express";

import adminAuth from "../middleware/adminAuth.middleware.js";
import guestAuth from "../middleware/guestAuth.middleware.js";
import housekeepingAuth from "../middleware/housekeepingAuth.middleware.js";
import allowRoles from "../middleware/role.middleware.js";

import {
  acceptHousekeepingRequest,
  assignHousekeepingRequest,
  completeHousekeepingRequest,
  createHousekeepingRequest,
  getHousekeepingTeam,
  listHousekeepingRequests,
  markHousekeepingRequestInProgress,
} from "../controllers/housekeeping.controller.js";

import {
  validateAssignmentPayload,
  validateCreateHousekeepingRequest,
  validateStatusQuery,
} from "../validators/housekeeping.validator.js";

const router = express.Router();

// Guest: create request
router.post("/request", guestAuth, validateCreateHousekeepingRequest, createHousekeepingRequest);

// Guest OR Housekeeping Admin: list requests (scoped automatically)
router.get("/", housekeepingAuth, validateStatusQuery, listHousekeepingRequests);

// Housekeeping team directory for assignment actions
router.get(
  "/team",
  adminAuth,
  allowRoles(
    "SUPER_ADMIN",
    "HOUSEKEEPING_ADMIN",
    "HOUSEKEEPING_SUPERVISOR",
    "HOUSEKEEPING_STAFF",
    "DINING_ADMIN"
  ),
  getHousekeepingTeam
);

// Housekeeping: accept
router.patch(
  "/:id/accept",
  adminAuth,
  allowRoles("SUPER_ADMIN", "HOUSEKEEPING_ADMIN", "HOUSEKEEPING_SUPERVISOR", "DINING_ADMIN"),
  acceptHousekeepingRequest
);

// Housekeeping: assign supervisor/staff
router.patch(
  "/:id/assign",
  adminAuth,
  allowRoles("SUPER_ADMIN", "HOUSEKEEPING_ADMIN", "HOUSEKEEPING_SUPERVISOR", "DINING_ADMIN"),
  validateAssignmentPayload,
  assignHousekeepingRequest
);

// Housekeeping: mark in-progress
router.patch(
  "/:id/in-progress",
  adminAuth,
  allowRoles(
    "SUPER_ADMIN",
    "HOUSEKEEPING_ADMIN",
    "HOUSEKEEPING_SUPERVISOR",
    "HOUSEKEEPING_STAFF",
    "DINING_ADMIN"
  ),
  markHousekeepingRequestInProgress
);

router.patch(
  "/:id/complete",
  adminAuth,
  allowRoles(
    "SUPER_ADMIN",
    "HOUSEKEEPING_ADMIN",
    "HOUSEKEEPING_SUPERVISOR",
    "HOUSEKEEPING_STAFF",
    "DINING_ADMIN"
  ),
  completeHousekeepingRequest
);

export default router;
