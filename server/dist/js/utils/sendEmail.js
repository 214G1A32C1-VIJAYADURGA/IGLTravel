"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = async (options) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error("Email credentials not configured");
    }
    const transporter = nodemailer_1.default.createTransport({
        host: process.env.EMAIL_USER.includes("ethereal.email") ? "smtp.ethereal.email" : "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        logger: true,
        debug: true,
        tls: {
            rejectUnauthorized: true,
        },
    });
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: options.to,
        subject: options.subject,
        html: options.html,
    };
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${options.to}: ${info.messageId}`);
        if (process.env.EMAIL_USER.includes("ethereal.email")) {
            console.log(`Preview URL: ${nodemailer_1.default.getTestMessageUrl(info)}`);
        }
        return info;
    }
    catch (error) {
        console.error("Email sending error:", error);
        throw new Error(`Failed to send email: ${error.message}`);
    }
};
exports.default = sendEmail;
