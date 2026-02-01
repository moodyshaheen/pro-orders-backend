import express from "express";
import { loginUser, registerUser, getMe, getAllUsers, updateUser, deleteUser } from "../controllers/controlUser.js";
import { protect } from "../middleware/mideleWher.js"; // middleware للتحقق من الـ token
import authMidelWhere from "../middleware/authMidel.js";

const userRouter = express.Router();

// Auth routes
userRouter.post("/login", loginUser);
userRouter.post("/register", registerUser);

// New route to get logged-in user data
userRouter.get("/me", protect, getMe);

// Update user profile
userRouter.put("/update", authMidelWhere, updateUser);

// Delete user account
userRouter.delete("/delete", authMidelWhere, deleteUser);

// Admin routes - Get all users
userRouter.get("/all", protect, getAllUsers);

export default userRouter;
