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

export const MENU_IMAGE_MAX_SIZE_MB = 2;
export const MENU_IMAGE_MAX_SIZE_BYTES = MENU_IMAGE_MAX_SIZE_MB * 1024 * 1024;

const normalizeText = (value) => String(value || "").trim();

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Failed to read selected image file."));
    reader.readAsDataURL(file);
  });

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

export const readMenuImageFileAsDataUrl = async (file) => {
  if (!file) {
    throw new Error("No image file selected.");
  }

  if (!String(file.type || "").toLowerCase().startsWith("image/")) {
    throw new Error("Please select a valid image file.");
  }

  if (file.size > MENU_IMAGE_MAX_SIZE_BYTES) {
    throw new Error(
      `Image is too large. Maximum allowed size is ${MENU_IMAGE_MAX_SIZE_MB}MB.`
    );
  }

  return readFileAsDataUrl(file);
};
