import jwt from "jsonwebtoken";
import User from "../models/userModels.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

export default async function authMiddlewave(req, res, next) {
  // GRAB TOKEN FROM AUTHORIZATION HEADER
  const authHeader = req.headers.authorization;

  if (!authHeader || authHeader.startsWith("Bearer ") === false) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid token format" });
  }

  const token = authHeader.split(" ")[1];
  // VERFY & ATTECH THE USER OBJECT

  try {
    const payLoad = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payLoad.id).select("-password");

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }
    req.user = user; // Attach user to request object
    next(); // Call the next middleware or route handler
  } catch (error) {
    console.error("JWT verification error:", error);
    // If token verification fails, return an error response
    return res
      .status(401)
      .json({ success: false, message: "Invalid token or Expired" });
  }
}
