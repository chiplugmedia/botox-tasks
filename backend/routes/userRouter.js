import express from "express";
import authMiddlewave from "../middleware/auth.js";
import {
  registerUser,
  loginUser,
  getCurrentUser,
  updateUserProfile,
  updatePassword,
} from "../controllers/userController.js";

// Create a new router instance
const userRouter = express.Router();

// Public routes
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

// PRIVATE LINKS PROTECT
userRouter.get("/me", authMiddlewave, getCurrentUser);
userRouter.put("/profile", authMiddlewave, updateUserProfile);
userRouter.put("/password", authMiddlewave, updatePassword);

export default userRouter;
