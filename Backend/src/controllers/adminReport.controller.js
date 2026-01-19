import ActiveStay from "../models/ActiveStay.js";
import Room from "../models/Room.js";

/**
 * ADMIN / SUPER_ADMIN → Daily Report
 */
export const getDailyReport = async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const [
      todayCheckIns,
      todayCheckOuts,
      occupiedRooms
    ] = await Promise.all([
      ActiveStay.countDocuments({
        checkInAt: { $gte: start, $lte: end }
      }),
      ActiveStay.countDocuments({
        checkOutAt: { $gte: start, $lte: end }
      }),
      Room.countDocuments({ status: "OCCUPIED" })
    ]);

    res.json({
      date: start.toDateString(),
      todayCheckIns,
      todayCheckOuts,
      occupiedRooms
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load daily report" });
  }
};

/**
 * ADMIN / SUPER_ADMIN → Monthly Report
 */
export const getMonthlyReport = async (req, res) => {
  try {
    const { year, month } = req.query; // month: 1–12

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);

    const [
      monthlyCheckIns,
      monthlyCheckOuts
    ] = await Promise.all([
      ActiveStay.countDocuments({
        checkInAt: { $gte: start, $lte: end }
      }),
      ActiveStay.countDocuments({
        checkOutAt: { $gte: start, $lte: end }
      })
    ]);

    res.json({
      month,
      year,
      monthlyCheckIns,
      monthlyCheckOuts
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load monthly report" });
  }
};
