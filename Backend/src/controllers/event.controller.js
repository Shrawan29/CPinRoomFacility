import Event from "../models/Event.js";

/* =========================
   ADMIN / SUPER_ADMIN
   ========================= */

export const createEvent = async (req, res) => {
  try {
    const { title, description, eventDate, location, contact, link, status, image, eventTime } = req.body;

    if (!title || !eventDate) {
      return res.status(400).json({
        message: "Title and event date are required",
      });
    }

    if (image && String(image).length > 2000000) {
      return res.status(413).json({ message: "Event image is too large" });
    }

    const event = await Event.create({
      title,
      description,
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

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
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