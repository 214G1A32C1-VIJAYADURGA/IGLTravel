"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get("/test", (req, res) => {
    res.send("User routes working!");
});
router.post("/check-email", userController_1.checkEmail);
router.post("/send-otp", userController_1.sendOTP);
router.post("/verify-otp", userController_1.verifyOTP);
router.post("/reset-password", userController_1.resetPassword);
router.post("/register", userController_1.register);
router.post("/login", userController_1.login);
router.get("/me", authMiddleware_1.protect, userController_1.getCurrentUser);
exports.default = router;
