const REELO_API_BASE = "https://api.reelo.io";

const REELO_CODES = {
  check: "DQbBj",
  register: "xQTqO",
};

const buildApiUrl = (path) => `${REELO_API_BASE}${path}`;

const parseApiErrorMessage = (payload, fallbackMessage) => {
  if (!payload) return fallbackMessage;

  if (Array.isArray(payload.errors) && payload.errors.length > 0) {
    const joined = payload.errors
      .map((entry) => entry?.msg || entry?.message)
      .filter(Boolean)
      .join(" ");

    if (joined) return joined;
  }

  return payload.message || payload.error || fallbackMessage;
};

const requestJson = async (path, options = {}, fallbackMessage = "Request failed") => {
  const response = await fetch(buildApiUrl(path), {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new Error(parseApiErrorMessage(payload, fallbackMessage));
  }

  return payload;
};

const resolveQrCodeContext = async (flow) => {
  const shortCode = REELO_CODES[flow];
  if (!shortCode) {
    throw new Error("Unsupported flow.");
  }

  const shortlink = await requestJson(
    `/v1/utility/shortlink/${shortCode}`,
    { method: "GET" },
    "Unable to connect to Reelo right now."
  );

  const qrCode = shortlink?.payload?.qr_code;
  const qrId = qrCode?.id;
  const entityId = qrCode?.entity_id?.id;
  const countryCode = shortlink?.payload?.country_code || "IN";

  if (!qrCode || !qrId || !entityId) {
    throw new Error("Reelo configuration is incomplete for this flow.");
  }

  return {
    shortCode,
    qrId,
    entityId,
    countryCode,
    shortlink,
  };
};

export const submitFointsLead = async ({ flow, name, phone }) => {
  const context = await resolveQrCodeContext(flow);

  if (flow === "check") {
    const submission = await requestJson(
      `/v1/qr-code/customer/rewards/${context.entityId}`,
      {
        method: "POST",
        body: JSON.stringify({
          phone,
          country_code: context.countryCode,
        }),
      },
      "Unable to check points right now."
    );

    return { ...context, submission };
  }

  if (flow === "register") {
    const submission = await requestJson(
      `/v1/qr-code/scan-customer/${context.qrId}`,
      {
        method: "POST",
        body: JSON.stringify({
          name,
          mobile: phone,
          country_code: context.countryCode,
        }),
      },
      "Unable to complete registration right now."
    );

    return { ...context, submission };
  }

  throw new Error("Unsupported flow.");
};
