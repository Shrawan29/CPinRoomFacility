import crypto from "crypto";
import GuestCredential from "../models/GuestCredential.js";
import GuestSession from "../models/GuestSession.js";
import {
  normalizeGuestName,
  normalizePasswordInput,
  normalizeRoomNumber,
} from "../utils/guestName.util.js";

const TITLE_TOKENS = new Set(["MR.", "MS.", "MRS.", "DR."]);

const normalizeLastNameInput = (raw) => {
  const cleaned = String(raw || "")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
  if (!cleaned) return "";

  // If the user accidentally types a title or full name, keep only the last token
  // and strip known title tokens.
  const tokens = cleaned
    .replace(/\./g, ".")
    .split(" ")
    .filter(Boolean)
    .filter((t) => !TITLE_TOKENS.has(t));
  if (tokens.length === 0) return "";
  return tokens[tokens.length - 1];
};

const extractLastNameFromNormalizedGuestName = (normalizedGuestName) => {
  const cleaned = String(normalizedGuestName || "")
    .replace(/\s+/g, " ")
    .trim();
  if (!cleaned) return "";

  const tokens = cleaned.split(" ").filter(Boolean);
  if (tokens.length === 0) return "";

  const withoutTitle = TITLE_TOKENS.has(tokens[0]) ? tokens.slice(1) : tokens;
  if (withoutTitle.length === 0) return "";
  return withoutTitle[withoutTitle.length - 1];
};

/**
 * Guest Login - Username & Password
 * Password format: guestname_roomno
 */
export const guestLogin = async (req, res) => {
  try {
    const { guestName, roomNumber, password } = req.body;

    if (!guestName || !roomNumber || !password) {
      return res
        .status(400)
        .json({ message: "Guest name, room number, and password required" });
    }

    const normalizedGuestName = normalizeGuestName(guestName);
    const normalizedRoomNumber = normalizeRoomNumber(roomNumber);
    const normalizedPassword = normalizePasswordInput(password);
    const legacyPassword = String(password || "")
      .replace(/\s+/g, " ")
      .trim();

    // Find guest credential
    const credential = await GuestCredential.findOne({
      guestName: normalizedGuestName,
      roomNumber: normalizedRoomNumber,
      status: "ACTIVE",
    });

    if (!credential) {
      return res.status(401).json({
        message: "Invalid guest name or room number",
      });
    }

    // Verify password
    let passwordMatch = await credential.comparePassword(normalizedPassword);
    if (!passwordMatch && legacyPassword && legacyPassword !== normalizedPassword) {
      passwordMatch = await credential.comparePassword(legacyPassword);
    }
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Create guest session
    const sessionId = crypto.randomBytes(32).toString("hex");

    await GuestSession.create({
      sessionId,
      guestName: normalizedGuestName,
      roomNumber: normalizedRoomNumber,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    res.json({
      token: sessionId,
      guest: {
        guestName: normalizedGuestName,
        roomNumber: normalizedRoomNumber,
      },
    });
  } catch (err) {
    console.error("Guest login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
};

/**
 * Guest Login - Room + Last Name (no password)
 * Intended for QR flow: guest scans room QR, then types only last name.
 * Titles like MR/MS/MRS/DR are ignored.
 */
export const guestLoginByLastName = async (req, res) => {
  try {
    const { roomNumber, lastName } = req.body;

    if (!roomNumber || !lastName) {
      return res
        .status(400)
        .json({ message: "Room number and last name required" });
    }

    const normalizedRoomNumber = normalizeRoomNumber(roomNumber);
    const normalizedLastName = normalizeLastNameInput(lastName);
    if (!normalizedLastName) {
      return res.status(400).json({ message: "Valid last name required" });
    }

    const credentials = await GuestCredential.find({
      roomNumber: normalizedRoomNumber,
      status: "ACTIVE",
    }).select("guestName roomNumber");

    const matching = credentials.filter((c) => {
      const credLastName = extractLastNameFromNormalizedGuestName(c.guestName);
      return credLastName === normalizedLastName;
    });

    if (matching.length === 0) {
      return res.status(401).json({ message: "Invalid last name for room" });
    }

    // Deterministic pick if multiple guests share last name.
    matching.sort((a, b) => String(a.guestName).localeCompare(String(b.guestName)));
    const credential = matching[0];

    const sessionId = crypto.randomBytes(32).toString("hex");

    await GuestSession.create({
      sessionId,
      guestName: normalizeGuestName(credential.guestName),
      roomNumber: normalizedRoomNumber,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    return res.json({
      token: sessionId,
      guest: {
        guestName: normalizeGuestName(credential.guestName),
        roomNumber: normalizedRoomNumber,
      },
    });
  } catch (err) {
    console.error("Guest last-name login error:", err);
    return res.status(500).json({ message: "Login failed" });
  }
};
