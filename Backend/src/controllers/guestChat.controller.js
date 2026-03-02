import OpenAI from "openai";

import Event from "../models/Event.js";
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

const buildRestrictedContext = async (userMessage) => {
  const wantsMenu = inferNeedsMenu(userMessage);
  const wantsEvents = inferNeedsEvents(userMessage);

  const shouldFetchMenu = wantsMenu || !wantsEvents;
  const shouldFetchEvents = wantsEvents || !wantsMenu;

  const isBroadMenuRequest = /\b(menu|food|dishes|items)\b/i.test(String(userMessage || ""));

  const [menu, events] = await Promise.all([
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
  ]);

  return { menu, events };
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

    const system = {
      role: "system",
      content:
        "You are a hotel guest assistant. You ONLY have access to two data sources: (1) hotel EVENTS, (2) the FOOD MENU. " +
        "Do not answer questions about anything else (orders, billing, rooms, staff, housekeeping, admin, guest accounts, etc). " +
        "When you need factual info, call the provided tools. If the user asks for something outside events/menu, refuse briefly and redirect to events/menu.",
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

    const messages = [system, ...history, { role: "user", content: userMessage }];

    let round = 0;
    // Tool calling loop
    while (round < MAX_TOOL_CALL_ROUNDS) {
      round += 1;

      let completion;
      try {
        const provider = getOpenRouterProviderPrefs();
        completion = await client.chat.completions.create({
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
                "If it doesn't contain the answer, say you don't know and offer to help with menu or events.\n\n" +
                JSON.stringify(context),
            },
            ...history,
            { role: "user", content: userMessage },
          ];

          const provider = getOpenRouterProviderPrefs();

          const fallbackCompletion = await client.chat.completions.create({
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
    return res.status(500).json({
      message:
        error?.message ||
        "Chat failed. If using OpenRouter and you see 'no endpoints found matching your data policy', check https://openrouter.ai/settings/privacy for account-wide ZDR/data-collection filtering.",
    });
  }
};
