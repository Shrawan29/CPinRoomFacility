import HotelInfo from "../models/HotelInfo.js";

// ADMIN / SUPER_ADMIN
export const upsertHotelInfo = async (req, res) => {
  const info = await HotelInfo.findOneAndUpdate(
    {},
    req.body,
    { upsert: true, new: true }
  );

  res.json({
    message: "Hotel info updated",
    info
  });
};

// GUEST (READ)
export const getHotelInfo = async (req, res) => {
  const info = await HotelInfo.findOne();
  res.json(info);
};
