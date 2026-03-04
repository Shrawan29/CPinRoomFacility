import HotelInfo from "../models/HotelInfo.js";

// ADMIN / SUPER_ADMIN
export const upsertHotelInfo = async (req, res) => {
  // Important: use $set to avoid replacing the whole document.
  // The Admin UI may not send optional fields like `guestDisplay`.
  const info = await HotelInfo.findOneAndUpdate(
    {},
    { $set: req.body },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
      runValidators: true,
      sort: { updatedAt: -1, createdAt: -1 },
    }
  );

  res.json({
    message: "Hotel info updated",
    info
  });
};

// GUEST (READ)
export const getHotelInfo = async (req, res) => {
  const info = await HotelInfo.findOne().sort({ updatedAt: -1, createdAt: -1 });
  res.json(info);
};
