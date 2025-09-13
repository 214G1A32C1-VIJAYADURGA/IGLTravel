import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import connectDb from "./shared/utils/connectDb"; 
import userRoutes from "./modules/users/user.routes"; 
import tripRoutes from "./modules/trips/trip.routes"; 
import { errorHandler } from "./shared/middleware/errorHandler"; 

dotenv.config();
connectDb();

const app = express();

// CORS configuration: Allow frontend origin (update for production)
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:8080" }));
app.use(express.json());

// Test route for quick server check
app.get("/api/health", (req, res) => {
  res.send("API Server is running!");
});

// API routes
app.use("/api/users", userRoutes);
app.use("/api/trips", tripRoutes);

// Serve React static files
app.use(express.static(path.join(__dirname, "..", "public")));

// Catch-all route for React client-side routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

// Error handler (must be last)
app.use(errorHandler);

export default app;
