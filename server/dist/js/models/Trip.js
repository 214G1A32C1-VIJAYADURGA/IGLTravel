"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const reactionSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["like", "dislike"], required: true },
});
const activitySchema = new mongoose_1.Schema({
    time: { type: String, required: true },
    activity: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    reactions: [reactionSchema],
});
const hotelSchema = new mongoose_1.Schema({
    HotelName: { type: String, required: true },
    CleanedAttractions: { type: String, required: true },
    Address: { type: String, required: true },
    HotelRating: { type: String, required: true },
    HotelWebsiteUrl: { type: String, required: true },
    reactions: [reactionSchema],
});
const daySchema = new mongoose_1.Schema({
    day: { type: Number, required: true },
    activities: [activitySchema],
    hotels: [hotelSchema],
});
const itinerarySchema = new mongoose_1.Schema({
    best_time_to_visit: { type: String, required: true },
    days: [daySchema],
});
const memberSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, enum: ["Organizer", "Member"], default: "Member" },
    status: { type: String, enum: ["pending", "accepted"], default: "accepted" },
});
const expenseSchema = new mongoose_1.Schema({
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    paidBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
});
const chatMessageSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});
const tripSchema = new mongoose_1.Schema({
    tripName: { type: String, required: true },
    destination: { type: String, required: true },
    numberOfPersons: { type: Number, required: true, min: 1 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    preferences: [String],
    organizer: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    members: [memberSchema],
    itinerary: itinerarySchema,
    expenses: [expenseSchema],
    chatMessages: [chatMessageSchema],
}, { timestamps: true });
exports.default = mongoose_1.default.model("Trip", tripSchema);
