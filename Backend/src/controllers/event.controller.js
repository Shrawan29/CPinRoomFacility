import Event from "../models/Event.js";

const MAX_SHORT_DESCRIPTION_LEN = 160;
const MAX_DESCRIPTION_LEN = 5000;

const toTrimmedString = (value) => {
  if (value === undefined || value === null) return "";
  return String(value).trim();
};

const normalizeShortDescription = (value) => {
  const s = toTrimmedString(value).replace(/\s+/g, " ");
  if (s.length > MAX_SHORT_DESCRIPTION_LEN) {
    return { ok: false, value: "", message: `Short description must be at most ${MAX_SHORT_DESCRIPTION_LEN} characters` };
  }
  return { ok: true, value: s, message: "" };
};

const normalizeDescription = (value) => {
  const s = toTrimmedString(value);
  if (s.length > MAX_DESCRIPTION_LEN) {
    return { ok: false, value: "", message: `Description must be at most ${MAX_DESCRIPTION_LEN} characters` };
  }
  return { ok: true, value: s, message: "" };
};

const deriveShortDescription = (shortDescription, description) => {
  const shortNorm = normalizeShortDescription(shortDescription);
  if (!shortNorm.ok) return shortNorm;
  if (shortNorm.value) return shortNorm;

  const descNorm = normalizeDescription(description);
  if (!descNorm.ok) return descNorm;
  if (!descNorm.value) return { ok: true, value: "", message: "" };

  const firstNonEmptyLine = descNorm.value
    .split(/\r?\n/)
    .map((l) => l.trim())
    .find((l) => Boolean(l)) || "";

  const derived = firstNonEmptyLine.replace(/\s+/g, " ").slice(0, MAX_SHORT_DESCRIPTION_LEN).trim();
  return { ok: true, value: derived, message: "" };
};

/* =========================
   ADMIN / SUPER_ADMIN
   ========================= */

export const createEvent = async (req, res) => {
  try {
    const { title, shortDescription, description, eventDate, location, contact, link, status, image, eventTime } = req.body;

    if (!title || !eventDate) {
      return res.status(400).json({
        message: "Title and event date are required",
      });
    }

    if (image && String(image).length > 2000000) {
      return res.status(413).json({ message: "Event image is too large" });
    }

    const descNorm = normalizeDescription(description);
    if (!descNorm.ok) return res.status(400).json({ message: descNorm.message });

    const shortNorm = deriveShortDescription(shortDescription, descNorm.value);
    if (!shortNorm.ok) return res.status(400).json({ message: shortNorm.message });

    const event = await Event.create({
      title,
      shortDescription: shortNorm.value,
      description: descNorm.value,
      image: image ? String(image) : "",
      eventDate,
      eventTime,
      location,
      contact,
      link,
      status: status || "UPCOMING",
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    if (req.body?.image && String(req.body.image).length > 2000000) {
      return res.status(413).json({ message: "Event image is too large" });
    }

    const update = { ...req.body };

    if (Object.prototype.hasOwnProperty.call(req.body || {}, "description")) {
      const descNorm = normalizeDescription(req.body.description);
      if (!descNorm.ok) return res.status(400).json({ message: descNorm.message });
      update.description = descNorm.value;
    }

    if (
      Object.prototype.hasOwnProperty.call(req.body || {}, "shortDescription") ||
      Object.prototype.hasOwnProperty.call(req.body || {}, "description")
    ) {
      const shortNorm = deriveShortDescription(req.body.shortDescription, update.description);
      if (!shortNorm.ok) return res.status(400).json({ message: shortNorm.message });
      update.shortDescription = shortNorm.value;
    }

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const listEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ eventDate: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   GUEST
   ========================= */

export const listActiveEvents = async (req, res) => {
  try {
    // Get today's date in UTC (00:00:00 UTC)
    const now = new Date();
    const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));

    const events = await Event.find({
      status: { $in: ["UPCOMING", "ACTIVE"] },
      eventDate: { $gte: today },
    }).sort({ eventDate: 1 });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getActiveEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const now = new Date();
    const today = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0)
    );

    const event = await Event.findOne({
      _id: id,
      status: { $in: ["UPCOMING", "ACTIVE"] },
      eventDate: { $gte: today },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res.json(event);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};