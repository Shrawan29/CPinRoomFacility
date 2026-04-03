const TWILIO_API_BASE_URL = "https://api.twilio.com/2010-04-01";
const TWILIO_STUDIO_API_BASE_URL = "https://studio.twilio.com/v2";
const DEFAULT_TIMEOUT_MS = 10_000;
const DEFAULT_SUPERVISOR_PHONE = "+917972895563";
const DEFAULT_ESCALATION_PHONE = "+917972895563";

const toTrimmedString = (value) => String(value ?? "").trim();

const toBoolean = (value, fallback = false) => {
  const normalized = toTrimmedString(value).toLowerCase();
  if (!normalized) return fallback;
  if (["1", "true", "yes", "y", "on"].includes(normalized)) return true;
  if (["0", "false", "no", "n", "off"].includes(normalized)) return false;
  return fallback;
};

const toPositiveInt = (value, fallback) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.floor(parsed);
};

export const parseFloorFromRoomNumber = (roomNumber) => {
  const normalized = toTrimmedString(roomNumber);
  if (!normalized) return null;

  const digitsMatch = normalized.match(/\d+/);
  if (!digitsMatch) return null;

  const numeric = Number(digitsMatch[0]);
  if (!Number.isFinite(numeric)) return null;

  if (numeric >= 100) return Math.floor(numeric / 100);
  if (numeric >= 10) return Math.floor(numeric / 10);
  return numeric;
};

const parseFloorMapConfig = () => {
  const raw = toTrimmedString(process.env.HOUSEKEEPING_SUPERVISOR_FLOOR_MAP_JSON);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      console.warn("[HousekeepingVoiceAlert] HOUSEKEEPING_SUPERVISOR_FLOOR_MAP_JSON must be a JSON object.");
      return [];
    }

    const mappings = [];

    for (const [rawRange, rawPhone] of Object.entries(parsed)) {
      const phone = toTrimmedString(rawPhone);
      if (!phone) continue;

      const key = toTrimmedString(rawRange);
      if (!key) continue;

      const rangeMatch = key.match(/^(\d+)\s*-\s*(\d+)$/);
      if (rangeMatch) {
        const start = Number(rangeMatch[1]);
        const end = Number(rangeMatch[2]);
        if (Number.isFinite(start) && Number.isFinite(end) && start <= end) {
          mappings.push({ start, end, phone });
        }
        continue;
      }

      const singleMatch = key.match(/^\d+$/);
      if (singleMatch) {
        const floor = Number(singleMatch[0]);
        if (Number.isFinite(floor)) {
          mappings.push({ start: floor, end: floor, phone });
        }
      }
    }

    return mappings;
  } catch (error) {
    console.warn(
      `[HousekeepingVoiceAlert] Invalid JSON in HOUSEKEEPING_SUPERVISOR_FLOOR_MAP_JSON: ${error.message}`
    );
    return [];
  }
};

const resolveSupervisorPhone = (roomNumber) => {
  const fallbackPhone =
    toTrimmedString(process.env.HOUSEKEEPING_SUPERVISOR_DEFAULT_TO) ||
    toTrimmedString(process.env.TWILIO_TO) ||
    DEFAULT_SUPERVISOR_PHONE;

  const floor = parseFloorFromRoomNumber(roomNumber);
  if (floor === null) return fallbackPhone;

  const floorMappings = parseFloorMapConfig();
  for (const mapping of floorMappings) {
    if (floor >= mapping.start && floor <= mapping.end) {
      return mapping.phone;
    }
  }

  return fallbackPhone;
};

export const getSupervisorPhoneForRoom = (roomNumber) => resolveSupervisorPhone(roomNumber);

export const getEscalationPhone = () =>
  toTrimmedString(process.env.HOUSEKEEPING_ESCALATION_TO) ||
  toTrimmedString(process.env.HOUSEKEEPING_MANAGER_DEFAULT_TO) ||
  resolveSupervisorPhone("") ||
  DEFAULT_ESCALATION_PHONE;

const escapeXml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");

const buildItemSummary = (items = []) => {
  if (!Array.isArray(items) || items.length === 0) return "";

  return items
    .map((item) => {
      const name = toTrimmedString(item?.name);
      const quantity = Number(item?.quantity);
      if (!name) return null;
      if (!Number.isFinite(quantity) || quantity <= 0) return name;
      return `${quantity} ${name}`;
    })
    .filter(Boolean)
    .join(", ");
};

const buildVoiceMessage = ({ roomNumber, items, note, action = "created" }) => {
  const room = toTrimmedString(roomNumber) || "unknown room";
  const itemSummary = buildItemSummary(items);
  const cleanNote = toTrimmedString(note);

  let intro;
  if (action === "cancelled") {
    intro = itemSummary
      ? `Housekeeping update from room ${room}. Request for ${itemSummary} is no longer needed.`
      : `Housekeeping update from room ${room}. Previous housekeeping request is no longer needed.`;
  } else if (action === "escalated") {
    intro = itemSummary
      ? `Escalation alert. No one accepted housekeeping request from room ${room} for ${itemSummary}.`
      : `Escalation alert. No one accepted housekeeping request from room ${room}.`;
  } else {
    intro = itemSummary
      ? `Housekeeping request from room ${room} for ${itemSummary}.`
      : `Housekeeping request from room ${room}. Service is needed.`;
  }

  const notePart = cleanNote ? ` Note: ${cleanNote}.` : "";
  return `${intro}${notePart} Please check the housekeeping dashboard.`;
};

const buildStudioParameters = ({ roomNumber, items, note, action = "created" }) => {
  const room = toTrimmedString(roomNumber);
  const cleanNote = toTrimmedString(note);
  const itemSummary = buildItemSummary(items);
  const voiceMessage = buildVoiceMessage({ roomNumber, items, note, action });

  return {
    action,
    roomNumber: room || undefined,
    room: room || undefined,
    note: cleanNote || undefined,
    itemSummary: itemSummary || undefined,
    items: itemSummary || undefined,
    voiceMessage,
    message: voiceMessage,
  };
};

const parseResponseJson = async (response) => {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

export const triggerHousekeepingSupervisorCall = async ({
  roomNumber,
  items,
  note,
  action = "created",
  toNumberOverride,
}) => {
  if (!toBoolean(process.env.TWILIO_ENABLED, false)) {
    return { attempted: false, alerted: false, reason: "disabled" };
  }

  if (typeof fetch !== "function") {
    return { attempted: false, alerted: false, reason: "fetch_unavailable" };
  }

  const accountSid = toTrimmedString(process.env.TWILIO_ACCOUNT_SID);
  const authToken = toTrimmedString(process.env.TWILIO_AUTH_TOKEN);
  const fromNumber =
    toTrimmedString(process.env.TWILIO_FROM_NUMBER) ||
    toTrimmedString(process.env.TWILIO_FROM);
  const toNumber = toTrimmedString(toNumberOverride) || resolveSupervisorPhone(roomNumber);

  if (!accountSid || !authToken || !fromNumber || !toNumber) {
    return {
      attempted: false,
      alerted: false,
      reason: "missing_config",
      message:
        "Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER, and supervisor destination number env vars.",
    };
  }

  const endpoint = `${TWILIO_API_BASE_URL}/Accounts/${encodeURIComponent(accountSid)}/Calls.json`;
  const studioFlowSid = toTrimmedString(process.env.TWILIO_STUDIO_FLOW_SID);
  const timeoutMs = toPositiveInt(process.env.TWILIO_REQUEST_TIMEOUT_MS, DEFAULT_TIMEOUT_MS);
  const twimlUrl = toTrimmedString(process.env.TWILIO_HOUSEKEEPING_URL);

  const voice = toTrimmedString(process.env.TWILIO_HOUSEKEEPING_VOICE) || "alice";
  const language = toTrimmedString(process.env.TWILIO_HOUSEKEEPING_LANGUAGE) || "en-IN";
  const message = buildVoiceMessage({ roomNumber, items, note, action });
  const twiml = `<Response><Say voice=\"${escapeXml(voice)}\" language=\"${escapeXml(
    language
  )}\">${escapeXml(message)}</Say></Response>`;

  const body = studioFlowSid
    ? new URLSearchParams({
        To: toNumber,
        From: fromNumber,
        Parameters: JSON.stringify(buildStudioParameters({ roomNumber, items, note, action })),
      })
    : new URLSearchParams({
        To: toNumber,
        From: fromNumber,
        ...(twimlUrl ? { Url: twimlUrl } : { Twiml: twiml }),
      });

  const authHeader = Buffer.from(`${accountSid}:${authToken}`).toString("base64");

  const controller = new AbortController();
  const timeoutHandle = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const endpoint = studioFlowSid
      ? `${TWILIO_STUDIO_API_BASE_URL}/Flows/${encodeURIComponent(studioFlowSid)}/Executions`
      : `${TWILIO_API_BASE_URL}/Accounts/${encodeURIComponent(accountSid)}/Calls.json`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${authHeader}`,
      },
      body: body.toString(),
      signal: controller.signal,
    });

    const responseBody = await parseResponseJson(response);

    if (!response.ok) {
      return {
        attempted: true,
        alerted: false,
        reason: "api_error",
        mode: studioFlowSid ? "studio_flow" : "call_api",
        statusCode: response.status,
        message:
          toTrimmedString(responseBody?.message) ||
          `Twilio ${studioFlowSid ? "Studio Flow" : "call"} API failed with status ${response.status}`,
      };
    }

    if (studioFlowSid) {
      return {
        attempted: true,
        alerted: true,
        reason: "ok",
        mode: "studio_flow",
        flowSid: studioFlowSid,
        to: toNumber,
        executionSid: toTrimmedString(responseBody?.sid),
      };
    }

    return {
      attempted: true,
      alerted: true,
      reason: "ok",
      mode: "call_api",
      to: toNumber,
      callSid: toTrimmedString(responseBody?.sid),
    };
  } catch (error) {
    const isAbort = error?.name === "AbortError";
    return {
      attempted: true,
      alerted: false,
      reason: isAbort ? "timeout" : "network_error",
      mode: studioFlowSid ? "studio_flow" : "call_api",
      message: error?.message || "Unknown Twilio call error",
    };
  } finally {
    clearTimeout(timeoutHandle);
  }
};
