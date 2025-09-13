"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const connectDb_1 = __importDefault(require("./utils/connectDb"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const tripRoutes_1 = __importDefault(require("./routes/tripRoutes"));
const errorHandler_1 = require("./middleware/errorHandler");
dotenv_1.default.config();
(0, connectDb_1.default)();
const app = (0, express_1.default)();
// CORS configuration: Allow frontend origin (update for production)
app.use((0, cors_1.default)({ origin: process.env.CLIENT_URL || "http://localhost:8080" }));
app.use(express_1.default.json());
// Test route for quick server check
app.get("/api/health", (req, res) => {
    res.send("API Server is running!");
});
// API routes
app.use("/api/users", userRoutes_1.default);
app.use("/api/trips", tripRoutes_1.default);
// Serve React static files
app.use(express_1.default.static(path_1.default.join(__dirname, "..", "public")));
// Catch-all route for React client-side routing
app.get("*", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "..", "public", "index.html"));
});
// Error handler (must be last)
app.use(errorHandler_1.errorHandler);
exports.default = app;
