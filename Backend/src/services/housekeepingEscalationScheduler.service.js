import ServiceRequest from "../models/ServiceRequest.js";
import {
  getEscalationPhone,
  triggerHousekeepingSupervisorCall,
} from "./housekeepingVoiceAlert.service.js";

const DEFAULT_CALL_DELAY_MS = 75_000;
const DEFAULT_ESCALATION_DELAY_MS = 180_000;
const MIN_DELAY_MS = 1_000;

const scheduledTimers = new Map();

const toPositiveInt = (value, fallback) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.floor(parsed);
};

const getCallDelayMs = () =>
  toPositiveInt(process.env.HOUSEKEEPING_CALL_DELAY_MS, DEFAULT_CALL_DELAY_MS);

const getEscalationDelayMs = () =>
  toPositiveInt(process.env.HOUSEKEEPING_ESCALATION_DELAY_MS, DEFAULT_ESCALATION_DELAY_MS);

const requestKey = (requestId) => String(requestId);

const clearTimersByKey = (key) => {
  const existing = scheduledTimers.get(key);
  if (!existing) return;

  if (existing.primary) clearTimeout(existing.primary);
  if (existing.escalation) clearTimeout(existing.escalation);
  scheduledTimers.delete(key);
};

const setTimer = (requestId, stage, delayMs, callback) => {
  const key = requestKey(requestId);
  const safeDelay = Math.max(delayMs, MIN_DELAY_MS);

  const timer = setTimeout(async () => {
    try {
      await callback();
    } catch (error) {
      console.error(`[HousekeepingEscalation] ${stage} timer failed for ${key}:`, error?.message || error);
    }
  }, safeDelay);

  const existing = scheduledTimers.get(key) || {};
  existing[stage] = timer;
  scheduledTimers.set(key, existing);
};

const fetchPendingRequest = async (requestId) => {
  const request = await ServiceRequest.findById(requestId);
  if (!request) return null;
  if (request.status !== "pending") return null;
  if (request.acceptedAt) return null;
  return request;
};

const runPrimaryCallAttempt = async (requestId) => {
  const request = await fetchPendingRequest(requestId);
  if (!request) {
    clearHousekeepingEscalationTimers(requestId);
    return;
  }

  const alertResult = await triggerHousekeepingSupervisorCall({
    roomNumber: request.roomNumber,
    items: request.items,
    note: request.note,
    action: "created",
  });

  if (alertResult.attempted) {
    await ServiceRequest.updateOne(
      { _id: request._id },
      { $inc: { callAttemptCount: 1 } }
    );
  }
};

const runEscalationCallAttempt = async (requestId) => {
  const request = await fetchPendingRequest(requestId);
  if (!request) {
    clearHousekeepingEscalationTimers(requestId);
    return;
  }

  const alertResult = await triggerHousekeepingSupervisorCall({
    roomNumber: request.roomNumber,
    items: request.items,
    note: request.note,
    action: "escalated",
    toNumberOverride: getEscalationPhone(),
  });

  const updates = {
    $set: { escalatedAt: new Date() },
  };

  if (alertResult.attempted) {
    updates.$inc = { callAttemptCount: 1 };
  }

  await ServiceRequest.updateOne({ _id: request._id }, updates);
  clearHousekeepingEscalationTimers(requestId);
};

export const clearHousekeepingEscalationTimers = (requestId) => {
  clearTimersByKey(requestKey(requestId));
};

export const scheduleHousekeepingEscalation = (request) => {
  if (!request?._id) return;
  if (request.status !== "pending") return;

  const key = requestKey(request._id);
  clearTimersByKey(key);

  const callDelayMs = getCallDelayMs();
  const escalationDelayMs = Math.max(getEscalationDelayMs(), callDelayMs + MIN_DELAY_MS);

  const notifiedAt = request.notifiedAt ? new Date(request.notifiedAt) : new Date(request.createdAt || Date.now());
  const elapsedMs = Date.now() - notifiedAt.getTime();

  if (!request.acceptedAt) {
    const shouldRunPrimaryNow = elapsedMs >= callDelayMs && Number(request.callAttemptCount || 0) === 0;
    const primaryDelay = shouldRunPrimaryNow ? MIN_DELAY_MS : callDelayMs - elapsedMs;

    if (shouldRunPrimaryNow || primaryDelay > 0) {
      setTimer(request._id, "primary", primaryDelay, async () => {
        await runPrimaryCallAttempt(request._id);
      });
    }

    const shouldRunEscalationNow = elapsedMs >= escalationDelayMs && !request.escalatedAt;
    const escalationDelay = shouldRunEscalationNow ? MIN_DELAY_MS : escalationDelayMs - elapsedMs;

    if (shouldRunEscalationNow || escalationDelay > 0) {
      setTimer(request._id, "escalation", escalationDelay, async () => {
        await runEscalationCallAttempt(request._id);
      });
    }
  }
};

export const initializeHousekeepingEscalationScheduler = async () => {
  try {
    const pendingRequests = await ServiceRequest.find({
      status: "pending",
      acceptedAt: { $exists: false },
    })
      .select("_id status notifiedAt createdAt acceptedAt escalatedAt callAttemptCount roomNumber items note")
      .lean();

    for (const request of pendingRequests) {
      scheduleHousekeepingEscalation(request);
    }

    console.log(
      `[HousekeepingEscalation] Scheduler initialized for ${pendingRequests.length} pending request(s).`
    );
  } catch (error) {
    console.error("[HousekeepingEscalation] Failed to initialize scheduler:", error?.message || error);
  }
};
