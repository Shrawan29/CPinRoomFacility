export const normalizeExternalUrl = (input) => {
  const value = String(input || "").trim();
  if (!value) return "";

  if (/^(javascript|data):/i.test(value)) return "";

  const lower = value.toLowerCase();
  if (
    lower.startsWith("http://") ||
    lower.startsWith("https://") ||
    lower.startsWith("mailto:") ||
    lower.startsWith("tel:")
  ) {
    return value;
  }

  if (lower.startsWith("//")) return `https:${value}`;

  return `https://${value}`;
};
