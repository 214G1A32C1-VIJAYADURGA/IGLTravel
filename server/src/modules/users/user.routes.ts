import express from "express";
import {
  register,
  login,
  getCurrentUser,
  checkEmail,
  sendOTP,
  verifyOTP,
  resetPassword,
} from "./user.controller";   

import { protect } from "../../shared/middleware/authMiddleware"; 

const router = express.Router();

router.get("/test", (req, res) => {
  res.send("User routes working!");
});

router.post("/check-email", checkEmail);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);
router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getCurrentUser);

export default router;