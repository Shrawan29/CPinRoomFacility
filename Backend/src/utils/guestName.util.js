const normalizeWhitespace = (value) => {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
};

const TITLE_MAP = new Map([
  ["MR", "MR."],
  ["MR.", "MR."],
  ["MS", "MS."],
  ["MS.", "MS."],
  ["MRS", "MRS."],
  ["MRS.", "MRS."],
  ["DR", "DR."],
  ["DR.", "DR."],
]);

const canonicalizeTitleToken = (token) => {
  const upper = String(token || "").toUpperCase();
  return TITLE_MAP.get(upper) || null;
};

const isTitleToken = (token) => {
  return Boolean(canonicalizeTitleToken(token));
};

// Examples:
// - "CHARU MS. 25375" -> "MS. CHARU"
// - "AGRAWAL MR. 25374" -> "MR. AGRAWAL"
// - "RAHUL KUMAR MR. 123" -> "MR. RAHUL KUMAR"
export const normalizeGuestName = (raw) => {
  const cleaned = normalizeWhitespace(raw);
  if (!cleaned) return "";

  let parts = cleaned.split(" ");

  // Drop trailing numeric token (guest id)
  if (parts.length > 1 && /^\d+$/.test(parts[parts.length - 1])) {
    parts.pop();
  }

  // Move known title token to the front if present
  const titleIndex = parts.findIndex((p) => canonicalizeTitleToken(p));
  if (titleIndex !== -1) {
    const [titleRaw] = parts.splice(titleIndex, 1);
    const title = canonicalizeTitleToken(titleRaw);
    if (title) {
      parts.unshift(title);
    }
  }

  // Canonicalize case for consistency: "agrawal mr." -> "MR. AGRAWAL"
  parts = parts.map((p, idx) => {
    if (idx === 0) {
      const title = canonicalizeTitleToken(p);
      if (title) return title;
    }
    return String(p || "").toUpperCase();
  });

  return normalizeWhitespace(parts.join(" "));
};

/**
 * Normalize a last-name input.
 * - Trims/uppercases
 * - If the user enters multiple words, returns the last token
 * - Ignores title tokens (MR/MS/MRS/DR) with or without dot
 */
export const normalizeLastName = (raw) => {
  const cleaned = normalizeWhitespace(raw).toUpperCase();
  if (!cleaned) return "";

  const tokens = cleaned
    .split(" ")
    .filter(Boolean)
    .filter((t) => !isTitleToken(t));

  if (tokens.length === 0) return "";
  return tokens[tokens.length - 1];
};

/**
 * Extract the last name from a raw or normalized guest name.
 * Titles are ignored; returns the last token of the remaining name.
 */
export const extractLastNameFromGuestName = (rawOrNormalizedGuestName) => {
  const normalized = normalizeGuestName(rawOrNormalizedGuestName);
  if (!normalized) return "";
  const tokens = normalized.split(" ").filter(Boolean);
  if (tokens.length === 0) return "";

  const withoutTitle = isTitleToken(tokens[0]) ? tokens.slice(1) : tokens;
  if (withoutTitle.length === 0) return "";
  return withoutTitle[withoutTitle.length - 1];
};

export const normalizeRoomNumber = (raw) => {
  return normalizeWhitespace(raw);
};

export const normalizePasswordInput = (raw) => {
  // Normalize whitespace and case so passwords are case-insensitive.
  // Passwords are generated/stored in lowercase by seed/sync logic.
  return normalizeWhitespace(raw).toLowerCase();
};
