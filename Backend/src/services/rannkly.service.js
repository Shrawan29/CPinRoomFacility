const RANNKLY_DEFAULT_BASE_URL = "https://forms.rannkly.com/external-api/v1";
const DEFAULT_TIMEOUT_MS = 10_000;
const DEFAULT_SYNC_TYPES = "feedback,suggestion";

const toTrimmedString = (value) => String(value ?? "").trim();

const toBoolean = (value, defaultValue = false) => {
  const normalized = toTrimmedString(value).toLowerCase();
  if (!normalized) return defaultValue;
  if (["1", "true", "yes", "y", "on"].includes(normalized)) return true;
  if (["0", "false", "no", "n", "off"].includes(normalized)) return false;
  return defaultValue;
};

const toPositiveInt = (value, fallback) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.floor(parsed);
};

const withoutEmptyValues = (input = {}) => {
  const output = {};

  for (const [key, rawValue] of Object.entries(input)) {
    if (rawValue === null || rawValue === undefined) continue;

    if (typeof rawValue === "string") {
      const trimmed = rawValue.trim();
      if (!trimmed) continue;
      output[key] = trimmed;
      continue;
    }

    output[key] = rawValue;
  }

  return output;
};

const parseJsonObjectEnv = (envName) => {
  const raw = toTrimmedString(process.env[envName]);
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      console.warn(`[Rannkly] ${envName} must be a JSON object.`);
      return {};
    }
    return parsed;
  } catch (error) {
    console.warn(`[Rannkly] Invalid JSON in ${envName}: ${error.message}`);
    return {};
  }
};

const isTypeAllowedForSync = (type) => {
  const configured = toTrimmedString(process.env.RANNKLY_SYNC_TYPES).toLowerCase();
  const effective = configured || DEFAULT_SYNC_TYPES;

  if (effective === "*" || effective === "all") {
    return true;
  }

  const allowed = new Set(
    effective
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
  );

  return allowed.has(toTrimmedString(type).toLowerCase());
};

const getQuestionMap = () => {
  const discreteMap = {
    type: process.env.RANNKLY_Q_TYPE_ID,
    category: process.env.RANNKLY_Q_CATEGORY_ID,
    subject: process.env.RANNKLY_Q_SUBJECT_ID,
    message: process.env.RANNKLY_Q_MESSAGE_ID,
    roomNumber: process.env.RANNKLY_Q_ROOM_ID,
    guestName: process.env.RANNKLY_Q_GUEST_NAME_ID,
    complaintId: process.env.RANNKLY_Q_COMPLAINT_ID,
  };

  const jsonMap = parseJsonObjectEnv("RANNKLY_QUESTION_MAP_JSON");
  const merged = {
    ...discreteMap,
    ...jsonMap,
  };

  const cleaned = {};
  for (const [sourceKey, questionIdRaw] of Object.entries(merged)) {
    const questionId = toTrimmedString(questionIdRaw);
    if (!questionId) continue;
    cleaned[sourceKey] = questionId;
  }

  return cleaned;
};

const buildAnswers = (payload) => {
  const sourceValues = withoutEmptyValues({
    type: payload?.type,
    category: payload?.category,
    subject: payload?.subject,
    message: payload?.message,
    roomNumber: payload?.roomNumber,
    guestName: payload?.guestName,
    complaintId: payload?.complaintId,
  });

  const questionMap = getQuestionMap();
  const answers = {};

  for (const [sourceKey, questionId] of Object.entries(questionMap)) {
    if (!(sourceKey in sourceValues)) continue;
    answers[questionId] = sourceValues[sourceKey];
  }

  return answers;
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

export const submitComplaintToRannkly = async (payload) => {
  if (!toBoolean(process.env.RANNKLY_ENABLED, false)) {
    return { attempted: false, synced: false, reason: "disabled" };
  }

  if (!isTypeAllowedForSync(payload?.type)) {
    return { attempted: false, synced: false, reason: "type_not_enabled" };
  }

  if (typeof fetch !== "function") {
    return { attempted: false, synced: false, reason: "fetch_unavailable" };
  }

  const apiKey = toTrimmedString(process.env.RANNKLY_API_KEY);
  const formId = toTrimmedString(process.env.RANNKLY_FORM_ID);

  if (!apiKey || !formId) {
    return { attempted: false, synced: false, reason: "missing_config" };
  }

  const answers = buildAnswers(payload);
  if (Object.keys(answers).length === 0) {
    return {
      attempted: false,
      synced: false,
      reason: "question_map_empty",
      message: "Configure RANNKLY_QUESTION_MAP_JSON or RANNKLY_Q_* question IDs.",
    };
  }

  const baseUrl = toTrimmedString(process.env.RANNKLY_BASE_URL) || RANNKLY_DEFAULT_BASE_URL;
  const normalizedBaseUrl = baseUrl.replace(/\/+$/, "");
  const endpoint = `${normalizedBaseUrl}/forms/${encodeURIComponent(formId)}/submit`;

  const teamId = toTrimmedString(process.env.RANNKLY_TEAM_ID);
  const timeoutMs = toPositiveInt(process.env.RANNKLY_REQUEST_TIMEOUT_MS, DEFAULT_TIMEOUT_MS);
  const extraHiddenFields = parseJsonObjectEnv("RANNKLY_EXTRA_HIDDEN_FIELDS_JSON");

  const hiddenFields = withoutEmptyValues({
    source: "cpinroomfacility",
    complaintId: payload?.complaintId,
    type: payload?.type,
    category: payload?.category,
    subject: payload?.subject,
    roomNumber: payload?.roomNumber,
    guestName: payload?.guestName,
    ...extraHiddenFields,
  });

  const body = {
    answers,
    ...(Object.keys(hiddenFields).length > 0 ? { hiddenFields } : {}),
    ...(toTrimmedString(payload?.guestName)
      ? { respondentName: toTrimmedString(payload.guestName) }
      : {}),
    ...withoutEmptyValues({
      utmSource: process.env.RANNKLY_UTM_SOURCE,
      utmMedium: process.env.RANNKLY_UTM_MEDIUM,
      utmCampaign: process.env.RANNKLY_UTM_CAMPAIGN,
      utmTerm: process.env.RANNKLY_UTM_TERM,
      utmContent: process.env.RANNKLY_UTM_CONTENT,
    }),
  };

  const headers = {
    "Content-Type": "application/json",
    "X-API-Key": apiKey,
    ...(teamId ? { "X-Team-Id": teamId } : {}),
  };

  const controller = new AbortController();
  const timeoutHandle = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const responseBody = await parseResponseJson(response);
    const apiSuccess = Boolean(responseBody?.success);

    if (!response.ok || !apiSuccess) {
      return {
        attempted: true,
        synced: false,
        reason: "api_error",
        statusCode: response.status,
        message:
          toTrimmedString(responseBody?.message) ||
          `Rannkly API request failed with status ${response.status}`,
      };
    }

    return {
      attempted: true,
      synced: true,
      reason: "ok",
      submissionId: toTrimmedString(responseBody?.data?.submissionId),
    };
  } catch (error) {
    const isAbort = error?.name === "AbortError";
    return {
      attempted: true,
      synced: false,
      reason: isAbort ? "timeout" : "network_error",
      message: error?.message || "Unknown Rannkly request error",
    };
  } finally {
    clearTimeout(timeoutHandle);
  }
};
