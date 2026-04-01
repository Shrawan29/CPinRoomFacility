import api from "./api.js";

const IMAGE_FIELD_KEYS = [
  "image",
  "imageUrl",
  "imageURL",
  "img",
  "imgUrl",
  "photo",
  "photoUrl",
];

const normalizeText = (value) => String(value || "").trim();

const extractGoogleDriveFileId = (raw) => {
  const filePathMatch = raw.match(/drive\.google\.com\/file\/d\/([^/]+)/i);
  if (filePathMatch?.[1]) return filePathMatch[1];

  const queryIdMatch = raw.match(/[?&]id=([^&]+)/i);
  if (queryIdMatch?.[1]) return queryIdMatch[1];

  return "";
};

const getApiOrigin = () => {
  const configuredBase = normalizeText(
    import.meta.env.VITE_API_URL || api?.defaults?.baseURL || ""
  );

  if (configuredBase) {
    try {
      return new URL(configuredBase).origin;
    } catch {
      // Fall through to browser origin.
    }
  }

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return "";
};

const forceHttpsInSecureContext = (url) => {
  if (
    typeof window !== "undefined" &&
    window.location.protocol === "https:" &&
    url.startsWith("http://")
  ) {
    return `https://${url.slice("http://".length)}`;
  }

  return url;
};

export const extractMenuImageValue = (item) => {
  if (typeof item === "string") {
    return normalizeText(item);
  }

  if (!item || typeof item !== "object") {
    return "";
  }

  for (const key of IMAGE_FIELD_KEYS) {
    const value = normalizeText(item[key]);
    if (value) return value;
  }

  return "";
};

export const resolveMenuImageSrc = (value) => {
  const raw = normalizeText(value);
  if (!raw) return "";

  if (/^data:image\//i.test(raw) || /^blob:/i.test(raw)) {
    return raw;
  }

  const driveId = extractGoogleDriveFileId(raw);
  if (driveId) {
    return `https://drive.google.com/uc?export=view&id=${driveId}`;
  }

  if (/^\/\//.test(raw)) {
    return forceHttpsInSecureContext(`https:${raw}`);
  }

  if (/^https?:\/\//i.test(raw)) {
    return forceHttpsInSecureContext(raw);
  }

  const apiOrigin = getApiOrigin();
  if (!apiOrigin) return raw;

  const normalizedPath = raw.startsWith("/") ? raw : `/${raw.replace(/^\.\//, "")}`;

  try {
    return new URL(normalizedPath, `${apiOrigin}/`).toString();
  } catch {
    return raw;
  }
};
