import { Router } from "express";
import { loginUser, verifyOtp } from "../controllers/user.controller.js";
import { isAuth } from "../middleware/auth.middleware.js";
import { getUserProfile } from "../controllers/user.controller.js";
export const userRouter = Router();

userRouter.post("/login", loginUser);
userRouter.post("/verifyotp", verifyOtp);
userRouter.get("/profile", isAuth, getUserProfile);
