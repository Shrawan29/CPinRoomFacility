import crypto from "crypto";
import Room from "../models/Room.js";
import GuestCredential from "../models/GuestCredential.js";
import GuestSession from "../models/GuestSession.js";
import {
  extractLastNameFromGuestName,
  normalizeGuestName,
  normalizeLastName,
  normalizePasswordInput,
  normalizeRoomNumber,
} from "../utils/guestName.util.js";

/**
 * Guest Login - Username & Password
 * Password format: roomno_lastname (case-insensitive)
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
    const underscorePassword = normalizePasswordInput(
      String(password || "")
        .replace(/\s+/g, "_")
        .trim()
    );
    const legacyPassword = String(password || "")
      .replace(/\s+/g, " ")
      .trim();

    const room = await Room.findOne({ roomNumber: normalizedRoomNumber }).select(
      "status"
    );
    if (!room || room.status !== "OCCUPIED") {
      return res.status(403).json({
        message: "No guest registered for this room",
      });
    }

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
    if (!passwordMatch && underscorePassword && underscorePassword !== normalizedPassword) {
      passwordMatch = await credential.comparePassword(underscorePassword);
    }
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
 * Guest Login - Room + Last Name + Password
 * Intended for QR flow: guest scans room QR, then types only last name.
 * Titles like MR/MS/MRS/DR are ignored.
 */
export const guestLoginByLastName = async (req, res) => {
  try {
    const { roomNumber, lastName, password } = req.body;

    if (!roomNumber || !lastName || !password) {
      return res
        .status(400)
        .json({ message: "Room number, last name, and password required" });
    }

    const normalizedRoomNumber = normalizeRoomNumber(roomNumber);
    const normalizedLastName = normalizeLastName(lastName);
    if (!normalizedLastName) {
      return res.status(400).json({ message: "Valid last name required" });
    }

    const room = await Room.findOne({ roomNumber: normalizedRoomNumber }).select(
      "status"
    );
    if (!room || room.status !== "OCCUPIED") {
      return res.status(403).json({
        message: "No guest registered for this room",
      });
    }

    const credentials = await GuestCredential.find({
      roomNumber: normalizedRoomNumber,
      status: "ACTIVE",
    }).select("guestName roomNumber passwordHash");

    const matching = credentials.filter((c) => {
      const credLastName = extractLastNameFromGuestName(c.guestName);
      return credLastName === normalizedLastName;
    });

    if (matching.length === 0) {
      return res.status(401).json({ message: "Invalid last name for room" });
    }

    // Deterministic pick if multiple guests share last name.
    matching.sort((a, b) => String(a.guestName).localeCompare(String(b.guestName)));
    const credential = matching[0];

    // Enforce password scheme: roomno_lastname (case-insensitive)
    const expectedPassword = normalizePasswordInput(`${normalizedRoomNumber}_${normalizedLastName}`);
    const providedPassword = normalizePasswordInput(password);
    const providedUnderscore = normalizePasswordInput(
      String(password || "")
        .replace(/\s+/g, "_")
        .trim()
    );

    let passwordMatch = await credential.comparePassword(providedPassword);
    if (!passwordMatch && providedUnderscore && providedUnderscore !== providedPassword) {
      passwordMatch = await credential.comparePassword(providedUnderscore);
    }

    // If the user typed something else, still require it matches the expected scheme.
    if (passwordMatch && providedPassword !== expectedPassword && providedUnderscore !== expectedPassword) {
      passwordMatch = false;
    }
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password for room" });
    }

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
