const allowRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.admin || !allowedRoles.includes(req.admin.role)) {
      return res.status(403).json({
        message: "Access denied"
      });
    }
    next();
  };
};

export default allowRoles;
