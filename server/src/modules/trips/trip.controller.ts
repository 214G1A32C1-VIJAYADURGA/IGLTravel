import express from "express";
import { Types } from "mongoose";
import Trip from "../trips/trip.model";                  // trip model inside trips/
import Invite from "../invites/invite.model";              // invite model also inside trips/
import User from "../users/user.model";                  // user model inside users/
import sendEmail from "../../shared/utils/sendEmail";    // utils inside shared/

// Interface for req.body in addExpense
interface ExpenseBody {
  description: string;
  amount: number;
  paidBy: string;
}

export const createTrip = async (req: express.Request, res: express.Response) => {
  const { tripName, destination, numberOfPersons, startDate, endDate, preferences, itinerary } = req.body;
  try {
    const trip = await Trip.create({
      tripName,
      destination,
      numberOfPersons,
      startDate,
      endDate,
      preferences,
      organizer: req.user!._id,
      members: [{ user: req.user!._id, role: "Organizer", status: "accepted" }],
      itinerary,
      expenses: [],
      chatMessages: [],
    });
    res.status(201).json({ trip });
  } catch (err: unknown) {
    console.error("Create trip error:", err);
    res.status(500).json({ message: "Failed to create trip" });
  }
};

export const getMyTrips = async (req: express.Request, res: express.Response) => {
  try {
    const trips = await Trip.find({
      $or: [{ organizer: req.user!._id }, { "members.user": req.user!._id }],
    }).populate("organizer", "name email").populate("members.user", "name email");
    res.json({ trips });
  } catch (err: unknown) {
    console.error("Get my trips error:", err);
    res.status(500).json({ message: "Failed to get trips" });
  }
};

export const inviteToTrip = async (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  const { email } = req.body;
  try {
    const trip = await Trip.findById(id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    if (trip.organizer.toString() !== req.user!._id.toString()) return res.status(403).json({ message: "Only organizer can invite" });
    const invitedUser = await User.findOne({ email }).select('_id name email');
    if (!invitedUser) return res.status(404).json({ message: "User not found" });
    const invitedUserId = invitedUser._id as Types.ObjectId; // Explicit type assertion
    if (trip.members.some((m) => m.user.toString() === invitedUserId.toString())) return res.status(400).json({ message: "User already a member" });
    const existingInvite = await Invite.findOne({ trip: id, invitedUser: invitedUserId, status: "pending" });
    if (existingInvite) return res.status(400).json({ message: "Invite already sent" });
    const invite = await Invite.create({ trip: id, invitedUser: invitedUserId, invitedBy: req.user!._id });
    await sendEmail({
      to: email,
      subject: "Invitation to Join Trip",
      html: `<p>You have been invited to join the trip "${trip.tripName}" to ${trip.destination} by ${req.user!.name}.</p>
             <p>Please <a href="${process.env.CLIENT_URL || 'http://localhost:8080'}/invites">log in to your account and visit the Invites page</a> to accept or decline the invitation.</p>`,
    });
    res.status(200).json({ message: "Invite sent successfully", invite });
  } catch (err: unknown) {
    console.error("Invite to trip error:", err);
    res.status(500).json({ message: "Failed to send invite" });
  }
};

export const getMyInvites = async (req: express.Request, res: express.Response) => {
  try {
    const invites = await Invite.find({ invitedUser: req.user!._id, status: "pending" }).populate("trip", "tripName destination").populate("invitedBy", "name");
    res.json({ invites });
  } catch (err: unknown) {
    console.error("Get my invites error:", err);
    res.status(500).json({ message: "Failed to get invites" });
  }
};

export const acceptInvite = async (req: express.Request, res: express.Response) => {
  const { inviteId } = req.params;
  try {
    const invite = await Invite.findById(inviteId);
    if (!invite) return res.status(404).json({ message: "Invite not found" });
    if (invite.invitedUser.toString() !== req.user!._id.toString()) return res.status(403).json({ message: "Not authorized" });
    const trip = await Trip.findById(invite.trip);
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    trip.members.push({ user: req.user!._id, role: "Member", status: "accepted" });
    await trip.save();
    invite.status = "accepted";
    await invite.save();
    res.status(200).json({ message: "Invite accepted", trip });
  } catch (err: unknown) {
    console.error("Accept invite error:", err);
    res.status(500).json({ message: "Failed to accept invite" });
  }
};

export const declineInvite = async (req: express.Request, res: express.Response) => {
  const { inviteId } = req.params;
  try {
    const invite = await Invite.findById(inviteId);
    if (!invite) return res.status(404).json({ message: "Invite not found" });
    if (invite.invitedUser.toString() !== req.user!._id.toString()) return res.status(403).json({ message: "Not authorized" });
    invite.status = "declined";
    await invite.save();
    res.status(200).json({ message: "Invite declined" });
  } catch (err: unknown) {
    console.error("Decline invite error:", err);
    res.status(500).json({ message: "Failed to decline invite" });
  }
};

export const reactToActivity = async (req: express.Request, res: express.Response) => {
  const { id, dayIndex, activityIndex } = req.params;
  const { type } = req.body;
  if (!["like", "dislike"].includes(type)) return res.status(400).json({ message: "Invalid reaction type" });
  try {
    const trip = await Trip.findById(id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    const isMember = trip.organizer.toString() === req.user!._id.toString() || trip.members.some((m) => m.user.toString() === req.user!._id.toString());
    if (!isMember) return res.status(403).json({ message: "Not a member" });
    const day = trip.itinerary.days[parseInt(dayIndex)];
    if (!day) return res.status(404).json({ message: "Day not found" });
    const activity = day.activities[parseInt(activityIndex)];
    if (!activity) return res.status(404).json({ message: "Activity not found" });
    const existing = activity.reactions.find((r) => r.user.toString() === req.user!._id.toString());
    if (existing) {
      if (existing.type === type) {
        activity.reactions = activity.reactions.filter((r) => r.user.toString() !== req.user!._id.toString());
      } else {
        existing.type = type;
      }
    } else {
      activity.reactions.push({ user: req.user!._id, type });
    }
    await trip.save();
    const updatedTrip = await Trip.findById(id).populate("itinerary.days.activities.reactions.user", "name");
    res.json({ trip: updatedTrip });
  } catch (err: unknown) {
    console.error("React to activity error:", err);
    res.status(500).json({ message: "Failed to add reaction" });
  }
};

export const reactToHotel = async (req: express.Request, res: express.Response) => {
  const { id, dayIndex, hotelIndex } = req.params;
  const { type } = req.body;
  if (!["like", "dislike"].includes(type)) return res.status(400).json({ message: "Invalid reaction type" });
  try {
    const trip = await Trip.findById(id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    const isMember = trip.organizer.toString() === req.user!._id.toString() || trip.members.some((m) => m.user.toString() === req.user!._id.toString());
    if (!isMember) return res.status(403).json({ message: "Not a member" });
    const day = trip.itinerary.days[parseInt(dayIndex)];
    if (!day) return res.status(404).json({ message: "Day not found" });
    const hotel = day.hotels[parseInt(hotelIndex)];
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });
    const existing = hotel.reactions.find((r) => r.user.toString() === req.user!._id.toString());
    if (existing) {
      if (existing.type === type) {
        hotel.reactions = hotel.reactions.filter((r) => r.user.toString() !== req.user!._id.toString());
      } else {
        existing.type = type;
      }
    } else {
      hotel.reactions.push({ user: req.user!._id, type });
    }
    await trip.save();
    const updatedTrip = await Trip.findById(id).populate("itinerary.days.hotels.reactions.user", "name");
    res.json({ trip: updatedTrip });
  } catch (err: unknown) {
    console.error("React to hotel error:", err);
    res.status(500).json({ message: "Failed to add reaction" });
  }
};

export const addExpense = async (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  const { description, amount, paidBy } = req.body as ExpenseBody;
  try {
    if (typeof description !== 'string' || description.trim() === '') {
      return res.status(400).json({ message: "Description must be a non-empty string" });
    }
    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ message: "Amount must be a positive number" });
    }
    if (typeof paidBy !== 'string' || paidBy.trim() === '') {
      return res.status(400).json({ message: "PaidBy must be a non-empty string" });
    }

    const trip = await Trip.findById(id);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }
    const isOrganizer = trip.organizer.toString() === req.user!._id.toString();
    const isMember = trip.members.some((member) => member.user.toString() === req.user!._id.toString());
    if (!isOrganizer && !isMember) {
      return res.status(403).json({ message: "You are not authorized to modify this trip" });
    }
    const paidByUser = await User.findOne({ name: paidBy }).select('_id name email') || await User.findById(req.user!._id).select('_id name email');
    if (!paidByUser) {
      return res.status(404).json({ message: "PaidBy user not found" });
    }
    trip.expenses.push({ description, amount, paidBy: paidByUser._id, createdAt: new Date() });
    await trip.save();
    const populatedTrip = await Trip.findById(id)
      .populate("expenses.paidBy", "name")
      .populate("organizer", "name email")
      .populate("members.user", "name email")
      .populate("chatMessages.user", "name")
      .populate("itinerary.days.activities.reactions.user", "name")
      .populate("itinerary.days.hotels.reactions.user", "name");
    res.json({ trip: populatedTrip });
  } catch (err: unknown) {
    console.error("Add expense error:", err);
    res.status(500).json({ message: "Failed to add expense" });
  }
};

export const addChatMessage = async (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  const { message } = req.body;
  try {
    const trip = await Trip.findById(id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    const isMember = trip.organizer.toString() === req.user!._id.toString() || trip.members.some((m) => m.user.toString() === req.user!._id.toString());
    if (!isMember) return res.status(403).json({ message: "Not a member" });
    trip.chatMessages.push({ user: req.user!._id, message, timestamp: new Date() });
    await trip.save();
    const updatedTrip = await Trip.findById(id).populate("chatMessages.user", "name");
    res.json({ trip: updatedTrip });
  } catch (err: unknown) {
    console.error("Add chat message error:", err);
    res.status(500).json({ message: "Failed to add message" });
  }
};

export const getTrip = async (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  try {
    const trip = await Trip.findById(id)
      .populate("organizer", "name email")
      .populate("members.user", "name email")
      .populate("expenses.paidBy", "name")
      .populate("chatMessages.user", "name")
      .populate("itinerary.days.activities.reactions.user", "name")
      .populate("itinerary.days.hotels.reactions.user", "name");

    if (!trip) {
      console.log(`Trip not found: ${id}`);
      return res.status(404).json({ message: "Trip not found" });
    }

    const userIdStr = req.user!._id.toString();

    // Organizer check
    const isOrganizer = trip.organizer._id.toString() === userIdStr;

    // Member check (robust for populated or unpopulated)
    const isMember = trip.members.some((m) => {
      if (m.user instanceof Types.ObjectId) return m.user.toString() === userIdStr;
      if (m.user && "_id" in m.user) return (m.user as any)._id.toString() === userIdStr;
      return false;
    });

    if (!isOrganizer && !isMember) {
      console.log(`User ${userIdStr} not authorized for trip ${id}. Organizer ID: ${trip.organizer._id}, Member IDs: ${trip.members.map((m) => (m.user instanceof Types.ObjectId ? m.user.toString() : (m.user as any)._id.toString()))}`);
      return res.status(403).json({ message: "Not authorized to view this trip" });
    }

    res.json({ trip });
  } catch (err: unknown) {
    console.error("Get trip error:", err);
    res.status(500).json({ message: "Failed to get trip" });
  }
};
