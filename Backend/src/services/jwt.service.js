import jwt from "jsonwebtoken";

export const generateAdminToken = (admin) => {
  return jwt.sign(
    {
      adminId: admin._id,
      role: admin.role
    },
    process.env.JWT_ADMIN_SECRET,
    { expiresIn: "8h" }
  );
};
 