import mongoose, { Schema, Document } from "mongoose";

export interface ITrip extends Document {
  tripName: string;
  destination: string;
  numberOfPersons: number;
  startDate: Date;
  endDate: Date;
  preferences: string[];
  organizer: mongoose.Types.ObjectId;
  members: { user: mongoose.Types.ObjectId; role: string; status: string }[];
  itinerary: {
    best_time_to_visit: string;
    days: {
      day: number;
      activities: {
        time: string;
        activity: string;
        location: string;
        description: string;
        category: string;
        image: string;
        reactions: { user: mongoose.Types.ObjectId; type: string }[];
      }[];
      hotels: {
        HotelName: string;
        CleanedAttractions: string;
        Address: string;
        HotelRating: string;
        HotelWebsiteUrl: string;
        reactions: { user: mongoose.Types.ObjectId; type: string }[];
      }[];
    }[];
  };
  expenses: { description: string; amount: number; paidBy: mongoose.Types.ObjectId; createdAt: Date }[];
  chatMessages: { user: mongoose.Types.ObjectId; message: string; timestamp: Date }[];
}

const reactionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["like", "dislike"], required: true },
});

const activitySchema = new Schema({
  time: { type: String, required: true },
  activity: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  reactions: [reactionSchema],
});

const hotelSchema = new Schema({
  HotelName: { type: String, required: true },
  CleanedAttractions: { type: String, required: true },
  Address: { type: String, required: true },
  HotelRating: { type: String, required: true },
  HotelWebsiteUrl: { type: String, required: true },
  reactions: [reactionSchema],
});

const daySchema = new Schema({
  day: { type: Number, required: true },
  activities: [activitySchema],
  hotels: [hotelSchema],
});

const itinerarySchema = new Schema({
  best_time_to_visit: { type: String, required: true },
  days: [daySchema],
});

const memberSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  role: { type: String, enum: ["Organizer", "Member"], default: "Member" },
  status: { type: String, enum: ["pending", "accepted"], default: "accepted" },
});

const expenseSchema = new Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  paidBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

const chatMessageSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const tripSchema = new Schema<ITrip>(
  {
    tripName: { type: String, required: true },
    destination: { type: String, required: true },
    numberOfPersons: { type: Number, required: true, min: 1 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    preferences: [String],
    organizer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    members: [memberSchema],
    itinerary: itinerarySchema,
    expenses: [expenseSchema],
    chatMessages: [chatMessageSchema],
  },
  { timestamps: true }
);

export default mongoose.model<ITrip>("Trip", tripSchema);