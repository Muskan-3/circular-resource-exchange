import { Schema, model, models, Types } from "mongoose";

export interface IMatch {
  _id: Types.ObjectId;
  listingId: Types.ObjectId;
  requesterId: Types.ObjectId;
  matchScore: number;
  status: "pending" | "accepted" | "declined";
  createdAt: Date;
  updatedAt: Date;
}

const MatchSchema = new Schema<IMatch>(
  {
    listingId: { type: Schema.Types.ObjectId, ref: "Listing", required: true, index: true },
    requesterId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    matchScore: { type: Number, required: true },
    status: { type: String, enum: ["pending", "accepted", "declined"], default: "pending" },
  },
  { timestamps: true }
);

export default models.Match || model<IMatch>("Match", MatchSchema);
