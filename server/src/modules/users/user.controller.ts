import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../users/user.model";
import OTP from "../auth/otp.model"; 
import sendEmail from "../../shared/utils/sendEmail";  
import randomstring from "randomstring";
import bcrypt from "bcryptjs";


const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: "7d" });
};

export const checkEmail = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not found in database" });
    }
    res.status(200).json({ message: "Email exists" });
  } catch (err: unknown) {
    console.error("Check email error:", err);
    res.status(500).json({ message: "Server error during email check" });
  }
};

export const sendOTP = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = randomstring.generate({ length: 6, charset: "numeric" });
    await OTP.create({ email, otp });

    await sendEmail({
      to: email,
      subject: "Password Reset OTP",
      html: `<p>Your OTP for password reset is: <strong>${otp}</strong></p><p>This OTP is valid for 5 minutes.</p>`,
    });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err: unknown) {
    console.error("Send OTP error:", err);
    res.status(500).json({ message: `Failed to send OTP: ${(err as Error).message}` });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  try {
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    await OTP.deleteOne({ email, otp });
    res.status(200).json({ message: "OTP verified successfully" });
  } catch (err: unknown) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ message: "Failed to verify OTP" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = password;
    await user.save();
    res.status(200).json({ message: "Password reset successfully" });
  } catch (err: unknown) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Failed to reset password" });
  }
};

export const register = async (req: Request, res: Response) => {
  const { name, email, password, mobile } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password, mobile });
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      token: generateToken(user.id),
    });
  } catch (err: unknown) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      token: generateToken(user.id),
    });
  } catch (err: unknown) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};

export const getCurrentUser = async (req: any, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }
    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      mobile: req.user.mobile,
    });
  } catch (err: unknown) {
    console.error("Get current user error:", err);
    res.status(500).json({ message: "Server error" });
  }
};