import express from "express";
import {
  createTrip,
  getMyTrips,
  getTrip,
  inviteToTrip,
  getMyInvites,
  acceptInvite,
  declineInvite,
  reactToActivity,
  reactToHotel,
  addExpense,
  addChatMessage,
} from "./trip.controller";
import { protect } from "../../shared/middleware/authMiddleware";  

const router = express.Router();

router.post("/", protect, createTrip);
router.get("/my", protect, getMyTrips);
router.get("/:id", protect, getTrip);
router.post("/:id/invite", protect, inviteToTrip);
router.get("/invites/my", protect, getMyInvites);
router.post("/invites/:inviteId/accept", protect, acceptInvite);
router.post("/invites/:inviteId/decline", protect, declineInvite);
router.post("/:id/day/:dayIndex/activity/:activityIndex/react", protect, reactToActivity);
router.post("/:id/day/:dayIndex/hotel/:hotelIndex/react", protect, reactToHotel);
router.post("/:id/expenses", protect, addExpense);
router.post("/:id/chat", protect, addChatMessage);

export default router;