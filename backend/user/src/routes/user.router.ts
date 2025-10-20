import { Router } from "express";
import { loginUser, verifyOtp } from "../controllers/user.controller.js";

export const userRouter = Router();

userRouter.post("/login", loginUser);
userRouter.post("/verifyotp", verifyOtp);

