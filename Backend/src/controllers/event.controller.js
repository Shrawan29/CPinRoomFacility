import Event from "../models/Event.js";

/* =========================
   ADMIN / SUPER_ADMIN
   ========================= */

export const createEvent = async (req, res) => {
  try {
    const { title, description, eventDate, location, contact, link, status } = req.body;

    if (!title || !eventDate) {
      return res.status(400).json({
        message: "Title and event date are required",
      });
    }

    const event = await Event.create({
      title,
      description,
      eventDate,
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
    const today = new Date();

    const events = await Event.find({
      status: { $in: ["UPCOMING", "ACTIVE"] },
      eventDate: { $gte: today },
    }).sort({ eventDate: 1 });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};