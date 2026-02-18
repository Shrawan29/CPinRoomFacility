import express from "express";

import adminAuth from "../middleware/adminAuth.middleware.js";
import guestAuth from "../middleware/guestAuth.middleware.js";
import housekeepingAuth from "../middleware/housekeepingAuth.middleware.js";
import allowRoles from "../middleware/role.middleware.js";

import {
  acceptHousekeepingRequest,
  completeHousekeepingRequest,
  createHousekeepingRequest,
  listHousekeepingRequests,
} from "../controllers/housekeeping.controller.js";

import {
  validateCreateHousekeepingRequest,
  validateStatusQuery,
} from "../validators/housekeeping.validator.js";

const router = express.Router();

// Guest: create request
router.post("/request", guestAuth, validateCreateHousekeepingRequest, createHousekeepingRequest);

// Guest OR Housekeeping Admin: list requests (scoped automatically)
router.get("/", housekeepingAuth, validateStatusQuery, listHousekeepingRequests);

// Housekeeping Admin: accept / complete
router.patch(
  "/:id/accept",
  adminAuth,
  allowRoles("HOUSEKEEPING_ADMIN"),
  acceptHousekeepingRequest
);

router.patch(
  "/:id/complete",
  adminAuth,
  allowRoles("HOUSEKEEPING_ADMIN"),
  completeHousekeepingRequest
);

export default router;
