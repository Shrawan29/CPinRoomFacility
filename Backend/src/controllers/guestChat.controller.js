import OpenAI from "openai";

import Event from "../models/Event.js";
import HotelInfo from "../models/HotelInfo.js";
import MenuItem from "../models/MenuItem.js";

const MAX_MESSAGE_CHARS = 2000;
const MAX_HISTORY_MESSAGES = 10;
const MAX_TOOL_LIMIT = 20;
const MAX_TOOL_CALL_ROUNDS = 3;

const toTrimmedString = (value) => {
  if (value == null) return "";
  return String(value).trim();
};

const clampInt = (value, min, max, fallback) => {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) return fallback;
  return Math.max(min, Math.min(max, parsed));
};

const parseOptionalISODate = (value) => {
  const s = toTrimmedString(value);
  if (!s) return null;
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return null;
  return d;
};

const getUtcStartOfToday = () => {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
};

const buildRegex = (query) => {
  const q = toTrimmedString(query);
  if (!q) return null;
  // Keep it simple; Mongo will handle regex safely as a string.
  return new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
};

const searchMenu = async (args) => {
  const query = toTrimmedString(args?.query);
  const category = toTrimmedString(args?.category);
  const availableOnly = args?.availableOnly !== false;
  const isVeg = typeof args?.isVeg === "boolean" ? args.isVeg : null;
  const maxPrice = typeof args?.maxPrice === "number" && args.maxPrice >= 0 ? args.maxPrice : null;
  const limit = clampInt(args?.limit, 1, MAX_TOOL_LIMIT, 8);

  const filter = {};
  if (availableOnly) filter.isAvailable = true;
  if (category) filter.category = category;
  if (isVeg !== null) filter.isVeg = isVeg;
  if (maxPrice !== null) filter.price = { $lte: maxPrice };

  const regex = buildRegex(query);
  if (regex) {
    filter.$or = [{ name: regex }, { description: regex }];
  }

  const items = await MenuItem.find(filter)
    .select("name category price description isVeg isAvailable")
    .sort({ category: 1, name: 1 })
    .limit(limit);

  return {
    count: items.length,
    items: items.map((i) => ({
      name: i.name,
      category: i.category,
      price: i.price,
      description: i.description || "",
      isVeg: !!i.isVeg,
      isAvailable: !!i.isAvailable,
    })),
  };
};

const searchEvents = async (args) => {
  const query = toTrimmedString(args?.query);
  const statuses = Array.isArray(args?.statuses)
    ? args.statuses.map((s) => toTrimmedString(s)).filter(Boolean)
    : ["UPCOMING", "ACTIVE"];

  const fromDate = parseOptionalISODate(args?.fromDate) || getUtcStartOfToday();
  const toDate = parseOptionalISODate(args?.toDate);
  const limit = clampInt(args?.limit, 1, MAX_TOOL_LIMIT, 6);

  const filter = {
    status: { $in: statuses.length > 0 ? statuses : ["UPCOMING", "ACTIVE"] },
    eventDate: { $gte: fromDate },
  };

  if (toDate) {
    filter.eventDate = { ...filter.eventDate, $lte: toDate };
  }

  const regex = buildRegex(query);
  if (regex) {
    filter.$or = [{ title: regex }, { description: regex }, { location: regex }];
  }

  const events = await Event.find(filter)
    .select("title description eventDate eventTime location contact link status")
    .sort({ eventDate: 1 })
    .limit(limit);

  return {
    count: events.length,
    events: events.map((e) => ({
      title: e.title,
      description: e.description || "",
      eventDate: e.eventDate,
      eventTime: e.eventTime || "",
      location: e.location || "",
      contact: e.contact || "",
      link: e.link || "",
      status: e.status,
    })),
  };
};

const searchHotelInfo = async (args) => {
  const query = toTrimmedString(args?.query);
  const section = toTrimmedString(args?.section).toLowerCase();
  const limit = clampInt(args?.limit, 1, MAX_TOOL_LIMIT, 10);

  const info = await HotelInfo.findOne().sort({ updatedAt: -1, createdAt: -1 }).lean();
  if (!info) {
    return { found: false, message: "Hotel info not configured" };
  }

  const regex = buildRegex(query);
  const matches = (value) => {
    if (!regex) return true;
    return regex.test(String(value || ""));
  };

  const basicInfo = {
    name: toTrimmedString(info?.basicInfo?.name),
    description: toTrimmedString(info?.basicInfo?.description),
    address: toTrimmedString(info?.basicInfo?.address),
    contactPhone: toTrimmedString(info?.basicInfo?.contactPhone),
    contactEmail: toTrimmedString(info?.basicInfo?.contactEmail),
  };

  let amenities = Array.isArray(info?.amenities) ? info.amenities : [];
  amenities = amenities
    .filter((a) => a)
    .filter((a) => matches(a.name))
    .slice(0, limit)
    .map((a) => ({ name: toTrimmedString(a.name), available: a.available !== false }));

  let services = Array.isArray(info?.services) ? info.services : [];
  services = services
    .filter((s) => s)
    .filter((s) => matches(s.name) || matches(s.description))
    .slice(0, limit)
    .map((s) => ({
      name: toTrimmedString(s.name),
      description: toTrimmedString(s.description),
      available: s.available !== false,
    }));

  let policies = Array.isArray(info?.policies) ? info.policies : [];
  policies = policies
    .map((p) => toTrimmedString(p))
    .filter(Boolean)
    .filter((p) => matches(p))
    .slice(0, limit);

  const emergency = {
    frontDeskNumber: toTrimmedString(info?.emergency?.frontDeskNumber),
    ambulanceNumber: toTrimmedString(info?.emergency?.ambulanceNumber),
    fireSafetyInfo: toTrimmedString(info?.emergency?.fireSafetyInfo),
  };

  const guestDisplay = extractGuestDisplayForChat(info?.guestDisplay);
  const guestDisplayMatches = (() => {
    if (!guestDisplay) return null;
    const out = {};

    for (const [key, val] of Object.entries(guestDisplay)) {
      if (!val || typeof val !== "object") continue;

      if (key === "contactCard" && Array.isArray(val.items)) {
        const items = val.items
          .filter((d) => matches(d?.label))
          .slice(0, limit);
        if (items.length > 0) out[key] = { items };
        continue;
      }

      if (Array.isArray(val.items)) {
        const items = val.items
          .filter((i) => matches(i?.name) || matches(i?.desc) || matches(i?.hours) || matches(i?.tag))
          .slice(0, limit);
        if (items.length > 0) out[key] = { ...(val.headline ? { headline: val.headline } : {}), items };
        continue;
      }

      if (Array.isArray(val.details)) {
        const details = val.details
          .filter((d) => matches(d?.label) || matches(d?.value))
          .slice(0, limit);
        if (details.length > 0) out[key] = { ...(val.headline ? { headline: val.headline } : {}), details };
        continue;
      }

    }

    return Object.keys(out).length > 0 ? out : null;
  })();

  const payload = {
    found: true,
    basicInfo,
    amenities,
    services,
    policies,
    emergency,
    ...(guestDisplay ? { guestDisplay } : {}),
  };

  if (section === "basic" || section === "basicinfo") {
    return { found: true, basicInfo };
  }
  if (section === "amenities" || section === "amenity") {
    return { found: true, count: amenities.length, amenities };
  }
  if (section === "services" || section === "service") {
    return { found: true, count: services.length, services };
  }
  if (section === "policies" || section === "policy") {
    return { found: true, count: policies.length, policies };
  }
  if (section === "emergency") {
    return { found: true, emergency };
  }

  if (section === "guestdisplay" || section === "guest_display" || section === "guest") {
    return guestDisplayMatches
      ? { found: true, guestDisplay: guestDisplayMatches }
      : { found: true, guestDisplay: null, message: "No guestDisplay matches" };
  }

  return payload;
};

function extractGuestDisplayForChat(guestDisplay) {
  if (!guestDisplay || typeof guestDisplay !== "object") return null;

  const pickString = (v) => {
    const s = toTrimmedString(v);
    return s ? s : null;
  };

  const sanitizeItems = (items) => {
    if (!Array.isArray(items)) return null;
    const out = items
      .slice(0, 40)
      .map((i) => ({
        name: toTrimmedString(i?.name),
        desc: toTrimmedString(i?.desc || i?.description),
        hours: toTrimmedString(i?.hours),
        tag: toTrimmedString(i?.tag),
      }))
      .filter((i) => i.name || i.desc || i.hours || i.tag);
    return out.length > 0 ? out : null;
  };

  const sanitizeDetails = (details) => {
    if (!Array.isArray(details)) return null;
    const out = details
      .slice(0, 40)
      .map((d) => ({
        label: toTrimmedString(d?.label),
        value: toTrimmedString(d?.value),
      }))
      .filter((d) => d.label || d.value);
    return out.length > 0 ? out : null;
  };

  const sanitizeContactCard = (contactCard) => {
    const items = contactCard?.items;
    if (!Array.isArray(items)) return null;
    const out = items
      .slice(0, 20)
      .map((c) => ({ label: toTrimmedString(c?.label) }))
      .filter((c) => c.label);
    return out.length > 0 ? { items: out } : null;
  };

  const allowedKeys = new Set([
    "dining",
    "wellness",
    "business",
    "facilities",
    "wifi",
    "emergency",
    "checkout",
    "contactCard",
  ]);

  const result = {};
  for (const [key, val] of Object.entries(guestDisplay)) {
    if (!allowedKeys.has(key)) continue;

    if (key === "contactCard") {
      const cc = sanitizeContactCard(val);
      if (cc) result[key] = cc;
      continue;
    }

    if (!val || typeof val !== "object") continue;

    const entry = {};
    const headline = pickString(val?.headline);
    const sub = pickString(val?.sub);
    if (headline) entry.headline = headline;
    if (sub) entry.sub = sub;

    const items = sanitizeItems(val?.items);
    if (items) entry.items = items;

    const details = sanitizeDetails(val?.details);
    if (details) entry.details = details;

    if (Object.keys(entry).length > 0) result[key] = entry;
  }

  return Object.keys(result).length > 0 ? result : null;
}

const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  const baseURL = toTrimmedString(process.env.OPENAI_BASE_URL);
  if (!apiKey) return null;

  const openRouterReferer = toTrimmedString(process.env.OPENROUTER_REFERER);
  const openRouterAppName = toTrimmedString(process.env.OPENROUTER_APP_NAME);

  const defaultHeaders = {
    ...(openRouterReferer ? { "HTTP-Referer": openRouterReferer } : {}),
    // OpenRouter documents X-OpenRouter-Title. Keep X-Title as a fallback.
    ...(openRouterAppName ? { "X-OpenRouter-Title": openRouterAppName } : {}),
    ...(openRouterAppName ? { "X-Title": openRouterAppName } : {}),
  };

  return new OpenAI({
    apiKey,
    ...(baseURL ? { baseURL } : {}),
    ...(Object.keys(defaultHeaders).length > 0 ? { defaultHeaders } : {}),
  });
};

const isOpenRouterNoEndpointsDataPolicyError = (error) => {
  const status = error?.status || error?.response?.status;
  const message = String(error?.message || "").toLowerCase();
  return (
    status === 404 &&
    (message.includes("no endpoints found") || message.includes("data policy"))
  );
};

const isRateLimitError = (error) => {
  const status = error?.status || error?.response?.status;
  const message = String(error?.message || "").toLowerCase();
  return status === 429 || message.includes("rate limit") || message.includes("too many requests");
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const createChatCompletionWithRetry = async (client, params) => {
  const maxAttempts = 3;
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await client.chat.completions.create(params);
    } catch (error) {
      lastError = error;

      if (!isRateLimitError(error) || attempt === maxAttempts) {
        throw error;
      }

      // Exponential backoff with small jitter
      const baseDelayMs = 600;
      const jitterMs = Math.floor(Math.random() * 250);
      const delayMs = baseDelayMs * Math.pow(2, attempt - 1) + jitterMs;
      await sleep(delayMs);
    }
  }

  throw lastError;
};

const createResponseWithRetry = async (client, params) => {
  const maxAttempts = 3;
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await client.responses.create(params);
    } catch (error) {
      lastError = error;

      if (!isRateLimitError(error) || attempt === maxAttempts) {
        throw error;
      }

      // Exponential backoff with small jitter
      const baseDelayMs = 600;
      const jitterMs = Math.floor(Math.random() * 250);
      const delayMs = baseDelayMs * Math.pow(2, attempt - 1) + jitterMs;
      await sleep(delayMs);
    }
  }

  throw lastError;
};

const shouldUseResponsesApi = ({ baseUrlLower, model }) => {
  // OpenRouter is OpenAI-chat-compatible but does not universally support /responses.
  if (baseUrlLower.includes("openrouter.ai")) return false;

  const forced = parseBoolEnv(process.env.OPENAI_USE_RESPONSES_API);
  if (forced === true) return true;
  if (forced === false) return false;

  const m = toTrimmedString(model).toLowerCase();
  // o-series models commonly require the Responses API.
  return m.startsWith("o") || m.includes("/o");
};

const toResponsesTools = (chatTools) => {
  if (!Array.isArray(chatTools)) return [];

  return chatTools
    .filter((t) => t?.type === "function" && t?.function?.name)
    .map((t) => ({
      type: "function",
      name: t.function.name,
      description: t.function.description,
      parameters: t.function.parameters || null,
      strict: true,
    }));
};

const runResponsesToolLoop = async ({
  client,
  model,
  input,
  tools,
  temperature,
  maxRounds,
}) => {
  let response = await createResponseWithRetry(client, {
    model,
    input,
    tools,
    tool_choice: "auto",
    temperature,
  });

  let round = 0;
  while (round < maxRounds) {
    round += 1;

    const functionCalls = Array.isArray(response?.output)
      ? response.output.filter((item) => item?.type === "function_call")
      : [];

    if (functionCalls.length === 0) {
      return response?.output_text || "";
    }

    const toolOutputs = [];
    for (const call of functionCalls) {
      const toolName = call?.name;
      let args = {};
      try {
        args = call?.arguments ? JSON.parse(call.arguments) : {};
      } catch {
        args = {};
      }

      let result;
      if (toolName === "search_menu") {
        result = await searchMenu(args);
      } else if (toolName === "search_hotel_info") {
        result = await searchHotelInfo(args);
      } else if (toolName === "search_events") {
        result = await searchEvents(args);
      } else {
        result = { error: "Tool not allowed" };
      }

      toolOutputs.push({
        type: "function_call_output",
        call_id: call.call_id,
        output: JSON.stringify(result),
      });
    }

    response = await createResponseWithRetry(client, {
      model,
      tools,
      tool_choice: "auto",
      temperature,
      previous_response_id: response.id,
      input: toolOutputs,
    });
  }

  return null;
};

const parseBoolEnv = (value) => {
  const v = String(value ?? "").trim().toLowerCase();
  if (!v) return null;
  if (["1", "true", "yes", "y", "on"].includes(v)) return true;
  if (["0", "false", "no", "n", "off"].includes(v)) return false;
  return null;
};

const getOpenRouterProviderPrefs = () => {
  const baseUrlLower = toTrimmedString(process.env.OPENAI_BASE_URL).toLowerCase();
  if (!baseUrlLower.includes("openrouter.ai")) return null;

  const dataCollection = toTrimmedString(process.env.OPENROUTER_DATA_COLLECTION);
  const zdr = parseBoolEnv(process.env.OPENROUTER_ZDR);
  const requireParameters = parseBoolEnv(process.env.OPENROUTER_REQUIRE_PARAMETERS);
  const allowFallbacks = parseBoolEnv(process.env.OPENROUTER_ALLOW_FALLBACKS);

  const provider = {
    ...(dataCollection ? { data_collection: dataCollection } : {}),
    ...(typeof zdr === "boolean" ? { zdr } : {}),
    ...(typeof requireParameters === "boolean" ? { require_parameters: requireParameters } : {}),
    ...(typeof allowFallbacks === "boolean" ? { allow_fallbacks: allowFallbacks } : {}),
  };

  return Object.keys(provider).length > 0 ? provider : null;
};

const inferNeedsMenu = (text) => {
  const t = String(text || "").toLowerCase();
  return (
    t.includes("menu") ||
    t.includes("food") ||
    t.includes("eat") ||
    t.includes("dish") ||
    t.includes("breakfast") ||
    t.includes("lunch") ||
    t.includes("dinner") ||
    t.includes("veg") ||
    t.includes("vegetarian") ||
    t.includes("price") ||
    t.includes("beverage") ||
    t.includes("drink")
  );
};

const inferNeedsEvents = (text) => {
  const t = String(text || "").toLowerCase();
  return (
    t.includes("event") ||
    t.includes("events") ||
    t.includes("activity") ||
    t.includes("activities") ||
    t.includes("what's on") ||
    t.includes("whats on") ||
    t.includes("today") ||
    t.includes("tomorrow") ||
    t.includes("week")
  );
};

const inferNeedsHotelInfo = (text) => {
  const t = String(text || "").toLowerCase();
  return (
    t.includes("facility") ||
    t.includes("facilities") ||
    t.includes("amenit") ||
    t.includes("hotel info") ||
    t.includes("hotel") ||
    t.includes("policy") ||
    t.includes("policies") ||
    t.includes("wifi") ||
    t.includes("internet") ||
    t.includes("ev") ||
    t.includes("electric vehicle") ||
    t.includes("charging") ||
    t.includes("charger") ||
    t.includes("check out") ||
    t.includes("checkout") ||
    t.includes("late checkout") ||
    t.includes("emergency") ||
    t.includes("front desk") ||
    t.includes("contact") ||
    t.includes("phone") ||
    t.includes("address") ||
    t.includes("pool") ||
    t.includes("gym") ||
    t.includes("spa") ||
    t.includes("laundry") ||
    t.includes("parking")
  );
};

const buildHotelInfoContext = async () => {
  const info = await HotelInfo.findOne().sort({ updatedAt: -1, createdAt: -1 }).lean();
  if (!info) return null;

  const basicInfo = {
    name: toTrimmedString(info?.basicInfo?.name),
    description: toTrimmedString(info?.basicInfo?.description),
    address: toTrimmedString(info?.basicInfo?.address),
    contactPhone: toTrimmedString(info?.basicInfo?.contactPhone),
    contactEmail: toTrimmedString(info?.basicInfo?.contactEmail),
  };

  const amenities = (Array.isArray(info?.amenities) ? info.amenities : [])
    .filter((a) => a)
    .map((a) => ({
      name: toTrimmedString(a.name),
      available: a.available !== false,
    }))
    .filter((a) => a.name);

  const services = (Array.isArray(info?.services) ? info.services : [])
    .filter((s) => s)
    .map((s) => ({
      name: toTrimmedString(s.name),
      description: toTrimmedString(s.description),
      available: s.available !== false,
    }))
    .filter((s) => s.name);

  const policies = (Array.isArray(info?.policies) ? info.policies : [])
    .map((p) => toTrimmedString(p))
    .filter(Boolean);

  const emergency = {
    frontDeskNumber: toTrimmedString(info?.emergency?.frontDeskNumber),
    ambulanceNumber: toTrimmedString(info?.emergency?.ambulanceNumber),
    fireSafetyInfo: toTrimmedString(info?.emergency?.fireSafetyInfo),
  };

  const guestDisplay = extractGuestDisplayForChat(info?.guestDisplay);

  return {
    basicInfo,
    amenities,
    services,
    policies,
    emergency,
    ...(guestDisplay ? { guestDisplay } : {}),
  };
};

const formatHotelInfoContextForPrompt = (ctx) => {
  if (!ctx) return "";

  const lines = [];
  const name = toTrimmedString(ctx?.basicInfo?.name);
  if (name) lines.push(`Hotel Name: ${name}`);

  const address = toTrimmedString(ctx?.basicInfo?.address);
  if (address) lines.push(`Address: ${address}`);

  const contactPhone = toTrimmedString(ctx?.basicInfo?.contactPhone);
  const contactEmail = toTrimmedString(ctx?.basicInfo?.contactEmail);
  if (contactPhone) lines.push(`Contact Phone: ${contactPhone}`);
  if (contactEmail) lines.push(`Contact Email: ${contactEmail}`);

  const description = toTrimmedString(ctx?.basicInfo?.description);
  if (description) lines.push(`Description: ${description}`);

  const amenities = Array.isArray(ctx?.amenities) ? ctx.amenities : [];
  if (amenities.length > 0) {
    lines.push("\nAmenities:");
    for (const a of amenities) {
      const label = toTrimmedString(a?.name);
      if (!label) continue;
      lines.push(`- ${label} (${a?.available === false ? "unavailable" : "available"})`);
    }
  }

  const services = Array.isArray(ctx?.services) ? ctx.services : [];
  if (services.length > 0) {
    lines.push("\nServices:");
    for (const s of services) {
      const label = toTrimmedString(s?.name);
      if (!label) continue;
      const availability = s?.available === false ? "unavailable" : "available";
      const desc = toTrimmedString(s?.description);
      lines.push(`- ${label} (${availability})${desc ? ` — ${desc}` : ""}`);
    }
  }

  const policies = Array.isArray(ctx?.policies) ? ctx.policies : [];
  if (policies.length > 0) {
    lines.push("\nPolicies:");
    for (const p of policies) {
      const policy = toTrimmedString(p);
      if (policy) lines.push(`- ${policy}`);
    }
  }

  const emergency = ctx?.emergency || {};
  const frontDesk = toTrimmedString(emergency?.frontDeskNumber);
  const ambulance = toTrimmedString(emergency?.ambulanceNumber);
  const fire = toTrimmedString(emergency?.fireSafetyInfo);
  if (frontDesk || ambulance || fire) {
    lines.push("\nEmergency:");
    if (frontDesk) lines.push(`- Front Desk: ${frontDesk}`);
    if (ambulance) lines.push(`- Ambulance: ${ambulance}`);
    if (fire) lines.push(`- Fire Safety: ${fire}`);
  }

  const guestDisplay = ctx?.guestDisplay && typeof ctx.guestDisplay === "object" ? ctx.guestDisplay : null;
  if (guestDisplay) {
    lines.push("\nGuest Display (guest-facing hotel info cards):");
    for (const [key, val] of Object.entries(guestDisplay)) {
      if (!val || typeof val !== "object") continue;
      lines.push(`\n[${key}]`);

      const headline = toTrimmedString(val?.headline);
      const sub = toTrimmedString(val?.sub);
      if (headline) lines.push(`- Headline: ${headline}`);
      if (sub) lines.push(`- Sub: ${sub}`);

      if (Array.isArray(val?.items) && val.items.length > 0) {
        lines.push("- Items:");
        for (const it of val.items.slice(0, 25)) {
          const n = toTrimmedString(it?.name);
          const d = toTrimmedString(it?.desc);
          const h = toTrimmedString(it?.hours);
          const t = toTrimmedString(it?.tag);
          const parts = [n, d].filter(Boolean).join(" — ");
          const meta = [h ? `hours: ${h}` : "", t ? `tag: ${t}` : ""].filter(Boolean).join(", ");
          if (parts || meta) lines.push(`  - ${parts}${meta ? ` (${meta})` : ""}`);
        }
      }

      if (Array.isArray(val?.details) && val.details.length > 0) {
        lines.push("- Details:");
        for (const d of val.details.slice(0, 25)) {
          const label = toTrimmedString(d?.label);
          const value = toTrimmedString(d?.value);
          if (label || value) lines.push(`  - ${label ? `${label}: ` : ""}${value}`);
        }
      }

      if (key === "contactCard" && Array.isArray(val?.items) && val.items.length > 0) {
        lines.push("- Contact:");
        for (const c of val.items.slice(0, 15)) {
          const label = toTrimmedString(c?.label);
          if (label) lines.push(`  - ${label}`);
        }
      }
    }
  }

  return lines.join("\n");
};

const buildRestrictedContext = async (userMessage) => {
  const wantsMenu = inferNeedsMenu(userMessage);
  const wantsEvents = inferNeedsEvents(userMessage);
  const wantsHotelInfo = inferNeedsHotelInfo(userMessage);

  const shouldFetchMenu = wantsMenu || (!wantsEvents && !wantsHotelInfo);
  const shouldFetchEvents = wantsEvents || (!wantsMenu && !wantsHotelInfo);
  const shouldFetchHotelInfo = wantsHotelInfo || (!wantsMenu && !wantsEvents);

  const isBroadMenuRequest = /\b(menu|food|dishes|items)\b/i.test(String(userMessage || ""));

  const [menu, events, hotelInfoContext] = await Promise.all([
    shouldFetchMenu
      ? searchMenu({
          query: isBroadMenuRequest ? "" : userMessage,
          availableOnly: true,
          limit: isBroadMenuRequest ? 12 : 8,
        })
      : Promise.resolve({ count: 0, items: [] }),
    shouldFetchEvents
      ? searchEvents({
          query: userMessage,
          limit: 6,
        })
      : Promise.resolve({ count: 0, events: [] }),
    shouldFetchHotelInfo
      ? buildHotelInfoContext()
      : Promise.resolve(null),
  ]);

  return {
    menu,
    events,
    hotelInfo: hotelInfoContext
      ? { found: true, ...hotelInfoContext }
      : { found: false, message: "Hotel info not configured" },
  };
};

export const guestChat = async (req, res) => {
  try {
    const client = getOpenAIClient();
    if (!client) {
      return res.status(501).json({
        message:
          "Chat is not configured. Set OPENAI_API_KEY (and for OpenRouter set OPENAI_BASE_URL=https://openrouter.ai/api/v1).",
      });
    }

    const userMessage = toTrimmedString(req.body?.message);
    if (!userMessage) {
      return res.status(400).json({ message: "message is required" });
    }
    if (userMessage.length > MAX_MESSAGE_CHARS) {
      return res.status(413).json({ message: "message too long" });
    }

    const rawHistory = Array.isArray(req.body?.history) ? req.body.history : [];
    const history = rawHistory
      .slice(-MAX_HISTORY_MESSAGES)
      .map((m) => ({
        role: m?.role === "assistant" ? "assistant" : "user",
        content: toTrimmedString(m?.content).slice(0, MAX_MESSAGE_CHARS),
      }))
      .filter((m) => m.content);

    const baseUrlLower = toTrimmedString(process.env.OPENAI_BASE_URL).toLowerCase();
    const defaultModel = baseUrlLower.includes("openrouter.ai")
      ? "openai/gpt-oss-120b:free"
      : "gpt-4o-mini";
    const model = toTrimmedString(process.env.OPENAI_MODEL) || defaultModel;

    const isBroadHotelInfoRequest = /\b(facilit(?:y|ies)|amenit(?:y|ies)|services?|what (do|does) (you|the hotel) have|available facilities)\b/i.test(
      userMessage
    );

    // Pre-fetch hotel info matches for the current question so the model reliably
    // sees the relevant items (e.g., "EV charging") even if it doesn't call tools.
    const wantsHotelInfoNow = inferNeedsHotelInfo(userMessage) || isBroadHotelInfoRequest;
    const prefetchedHotelInfo = wantsHotelInfoNow
      ? await searchHotelInfo({
          query: isBroadHotelInfoRequest ? "" : userMessage,
          limit: 20,
        })
      : null;

    const prefetchedHotelInfoSystemContext = prefetchedHotelInfo
      ? {
          role: "system",
          content:
            "Relevant HOTEL INFO matches for this question (from database). Treat as factual. " +
            "Only say something is unavailable if it explicitly has available=false. " +
            "If the relevant item is not present here, call search_hotel_info.\n\n" +
            JSON.stringify(prefetchedHotelInfo),
        }
      : null;

    // Always include a compact snapshot of hotel info so the assistant has property context
    // without needing to call a tool first.
    const hotelInfoContext = await buildHotelInfoContext();
    const hotelInfoSystemContext = hotelInfoContext
      ? {
          role: "system",
          content:
            "Hotel info context (from database). Treat this as factual and consult it BEFORE answering. " +
            "Amenities/services may include an 'available' flag; if available=false, it is currently unavailable. " +
            "If the answer is not present in this context, call search_hotel_info.\n\n" +
            formatHotelInfoContextForPrompt(hotelInfoContext) +
            "\n\nRaw JSON:\n" +
            JSON.stringify(hotelInfoContext),
        }
      : null;

    const system = {
      role: "system",
      content:
        "You are a hotel guest assistant. You ONLY have access to three data sources: (1) hotel EVENTS, (2) the FOOD MENU, (3) HOTEL INFO (amenities/services/policies/contact/emergency). " +
        "Do not answer questions about anything else (orders, billing, rooms, staff, housekeeping, admin, guest accounts, etc). " +
        "When you need factual info, call the provided tools. " +
        "IMPORTANT: Do NOT claim an amenity/service is unavailable unless the database explicitly marks it available=false. " +
        "If you cannot find the item in hotel info, say you don't have that detail and suggest checking with the front desk. " +
        "If the user asks for something outside events/menu/hotel info, refuse briefly and redirect.",
    };

    const tools = [
      {
        type: "function",
        function: {
          name: "search_menu",
          description:
            "Search available menu items by text query and optional filters. Returns a short list.",
          parameters: {
            type: "object",
            additionalProperties: false,
            properties: {
              query: { type: "string", description: "Text to search in name/description" },
              category: { type: "string", description: "Exact category to filter" },
              isVeg: { type: "boolean", description: "Filter veg/non-veg" },
              availableOnly: { type: "boolean", description: "Only available items (default true)" },
              maxPrice: { type: "number", description: "Maximum price" },
              limit: { type: "integer", description: "Max results (1-20)" },
            },
          },
        },
      },
      {
        type: "function",
        function: {
          name: "search_hotel_info",
          description:
            "Search hotel info (amenities/services/policies/contact/emergency). Returns matching items or a compact summary.",
          parameters: {
            type: "object",
            additionalProperties: false,
            properties: {
              query: { type: "string", description: "Text to search (optional)" },
              section: {
                type: "string",
                description:
                  "Optional section: basicInfo, amenities, services, policies, emergency, guestDisplay",
              },
              limit: { type: "integer", description: "Max results per section (1-20)" },
            },
          },
        },
      },
      {
        type: "function",
        function: {
          name: "search_events",
          description:
            "Search upcoming/active events by text query and optional date/status filters. Returns a short list.",
          parameters: {
            type: "object",
            additionalProperties: false,
            properties: {
              query: { type: "string", description: "Text to search in title/description/location" },
              fromDate: { type: "string", description: "ISO date string lower bound" },
              toDate: { type: "string", description: "ISO date string upper bound" },
              statuses: {
                type: "array",
                items: { type: "string" },
                description: "Status filters, e.g. UPCOMING, ACTIVE",
              },
              limit: { type: "integer", description: "Max results (1-20)" },
            },
          },
        },
      },
    ];

    // If the selected model/provider expects the Responses API (common for o-series), use it.
    if (shouldUseResponsesApi({ baseUrlLower, model })) {
      const responsesTools = toResponsesTools(tools);
      const input = [
        system,
        ...(hotelInfoSystemContext ? [hotelInfoSystemContext] : []),
        ...(prefetchedHotelInfoSystemContext ? [prefetchedHotelInfoSystemContext] : []),
        ...history,
        { role: "user", content: userMessage },
      ];

      const reply = await runResponsesToolLoop({
        client,
        model,
        input,
        tools: responsesTools,
        temperature: 0.2,
        maxRounds: MAX_TOOL_CALL_ROUNDS,
      });

      if (typeof reply === "string") {
        return res.json({ reply });
      }

      return res.status(504).json({
        message: "Chat timed out while calling tools. Please try again.",
      });
    }

    const messages = [
      system,
      ...(hotelInfoSystemContext ? [hotelInfoSystemContext] : []),
      ...(prefetchedHotelInfoSystemContext ? [prefetchedHotelInfoSystemContext] : []),
      ...history,
      { role: "user", content: userMessage },
    ];

    let round = 0;
    // Tool calling loop
    while (round < MAX_TOOL_CALL_ROUNDS) {
      round += 1;

      let completion;
      try {
        const provider = getOpenRouterProviderPrefs();
        completion = await createChatCompletionWithRetry(client, {
          model,
          messages,
          tools,
          tool_choice: "auto",
          temperature: 0.2,
          ...(provider ? { provider } : {}),
        });
      } catch (error) {
        // Some OpenRouter endpoints (commonly :free routes) reject tool-calling and respond with:
        // "404 error no endpoints found matching your data policy".
        // Fallback: do server-side restricted retrieval (events/menu only) and retry WITHOUT tools.
        if (isOpenRouterNoEndpointsDataPolicyError(error)) {
          const context = await buildRestrictedContext(userMessage);
          const fallbackMessages = [
            system,
            {
              role: "system",
              content:
                "The following JSON is the ONLY database information you may use. " +
                "If it doesn't contain the answer, say you don't know and offer to help with menu, events, or hotel info.\n\n" +
                JSON.stringify(context),
            },
            ...history,
            { role: "user", content: userMessage },
          ];

          const provider = getOpenRouterProviderPrefs();

          const fallbackCompletion = await createChatCompletionWithRetry(client, {
            model,
            messages: fallbackMessages,
            temperature: 0.2,
            ...(provider ? { provider } : {}),
          });

          const fallbackMsg = fallbackCompletion.choices?.[0]?.message;
          return res.json({ reply: fallbackMsg?.content || "" });
        }

        throw error;
      }

      const msg = completion.choices?.[0]?.message;
      if (!msg) {
        return res.status(502).json({ message: "No response from model" });
      }

      // If no tool calls, we're done.
      if (!Array.isArray(msg.tool_calls) || msg.tool_calls.length === 0) {
        return res.json({ reply: msg.content || "" });
      }

      messages.push({
        role: "assistant",
        content: msg.content || "",
        tool_calls: msg.tool_calls,
      });

      for (const toolCall of msg.tool_calls) {
        if (toolCall.type !== "function") continue;
        const toolName = toolCall.function?.name;
        let args = {};
        try {
          args = toolCall.function?.arguments ? JSON.parse(toolCall.function.arguments) : {};
        } catch {
          args = {};
        }

        let result;
        if (toolName === "search_menu") {
          result = await searchMenu(args);
        } else if (toolName === "search_hotel_info") {
          result = await searchHotelInfo(args);
        } else if (toolName === "search_events") {
          result = await searchEvents(args);
        } else {
          result = { error: "Tool not allowed" };
        }

        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify(result),
        });
      }
    }

    return res.status(504).json({
      message: "Chat timed out while calling tools. Please try again.",
    });
  } catch (error) {
    const status = error?.status || error?.response?.status;
    if (status === 429 || isRateLimitError(error)) {
      return res.status(429).json({
        message:
          "Chat is rate-limited by the AI provider right now. Please wait a moment and try again (or switch to a non-free model on OpenRouter).",
      });
    }

    return res.status(500).json({
      message:
        error?.message ||
        "Chat failed. If using OpenRouter and you see 'no endpoints found matching your data policy', check https://openrouter.ai/settings/privacy for account-wide ZDR/data-collection filtering.",
    });
  }
};
