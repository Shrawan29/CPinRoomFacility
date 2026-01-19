import Event from "../models/Event.js";

// ADMIN / SUPER_ADMIN
export const createEvent = async (req, res) => {
  const event = await Event.create(req.body);
  res.status(201).json(event);
};

export const updateEvent = async (req, res) => {
  const event = await Event.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  res.json(event);
};

// GUEST
export const listActiveEvents = async (req, res) => {
  const today = new Date();

  const events = await Event.find({
    isActive: true,
    eventDate: { $gte: today }
  }).sort({ eventDate: 1 });

  res.json(events);
};
