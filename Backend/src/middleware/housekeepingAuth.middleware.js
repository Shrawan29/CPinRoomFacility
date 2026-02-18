import adminAuth from "./adminAuth.middleware.js";
import guestAuth from "./guestAuth.middleware.js";

const housekeepingAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const hasBearer = Boolean(authHeader && String(authHeader).startsWith("Bearer "));
  const hasGuestSession = Boolean(req.headers["x-guest-session"]);

  if (hasBearer) {
    return adminAuth(req, res, next);
  }

  if (hasGuestSession) {
    return guestAuth(req, res, next);
  }

  return res.status(401).json({
    message: "Authorization token missing",
  });
};

export default housekeepingAuth;
