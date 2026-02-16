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

export const normalizeRoomNumber = (raw) => {
  return normalizeWhitespace(raw);
};

export const normalizePasswordInput = (raw) => {
  // Normalize whitespace and case so passwords are case-insensitive.
  // Passwords are generated/stored in lowercase by seed/sync logic.
  return normalizeWhitespace(raw).toLowerCase();
};
