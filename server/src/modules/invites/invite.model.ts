import mongoose, { Schema, Document } from "mongoose";

export interface IInvite extends Document {
  trip: mongoose.Types.ObjectId;
  invitedUser: mongoose.Types.ObjectId;
  invitedBy: mongoose.Types.ObjectId;
  status: "pending" | "accepted" | "declined";
  createdAt: Date;
  updatedAt: Date;
}

const inviteSchema = new Schema<IInvite>(
  {
    trip: { type: Schema.Types.ObjectId, ref: "Trip", required: true },
    invitedUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
    invitedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IInvite>("Invite", inviteSchema);
