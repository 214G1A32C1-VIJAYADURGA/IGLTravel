"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = exports.login = exports.register = exports.resetPassword = exports.verifyOTP = exports.sendOTP = exports.checkEmail = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const OTP_1 = __importDefault(require("../models/OTP"));
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
const randomstring_1 = __importDefault(require("randomstring"));
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};
const checkEmail = async (req, res) => {
    const { email } = req.body;
    try {
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Email not found in database" });
        }
        res.status(200).json({ message: "Email exists" });
    }
    catch (err) {
        console.error("Check email error:", err);
        res.status(500).json({ message: "Server error during email check" });
    }
};
exports.checkEmail = checkEmail;
const sendOTP = async (req, res) => {
    const { email } = req.body;
    try {
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const otp = randomstring_1.default.generate({ length: 6, charset: "numeric" });
        await OTP_1.default.create({ email, otp });
        await (0, sendEmail_1.default)({
            to: email,
            subject: "Password Reset OTP",
            html: `<p>Your OTP for password reset is: <strong>${otp}</strong></p><p>This OTP is valid for 5 minutes.</p>`,
        });
        res.status(200).json({ message: "OTP sent successfully" });
    }
    catch (err) {
        console.error("Send OTP error:", err);
        res.status(500).json({ message: `Failed to send OTP: ${err.message}` });
    }
};
exports.sendOTP = sendOTP;
const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
    try {
        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }
        const otpRecord = await OTP_1.default.findOne({ email, otp });
        if (!otpRecord) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }
        await OTP_1.default.deleteOne({ email, otp });
        res.status(200).json({ message: "OTP verified successfully" });
    }
    catch (err) {
        console.error("Verify OTP error:", err);
        res.status(500).json({ message: "Failed to verify OTP" });
    }
};
exports.verifyOTP = verifyOTP;
const resetPassword = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.password = password;
        await user.save();
        res.status(200).json({ message: "Password reset successfully" });
    }
    catch (err) {
        console.error("Reset password error:", err);
        res.status(500).json({ message: "Failed to reset password" });
    }
};
exports.resetPassword = resetPassword;
const register = async (req, res) => {
    const { name, email, password, mobile } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required" });
        }
        const userExists = await User_1.default.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }
        const user = await User_1.default.create({ name, email, password, mobile });
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            token: generateToken(user.id),
        });
    }
    catch (err) {
        console.error("Register error:", err);
        res.status(500).json({ message: "Server error during registration" });
    }
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const user = await User_1.default.findOne({ email });
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
    }
    catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Server error during login" });
    }
};
exports.login = login;
const getCurrentUser = async (req, res) => {
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
    }
    catch (err) {
        console.error("Get current user error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getCurrentUser = getCurrentUser;
