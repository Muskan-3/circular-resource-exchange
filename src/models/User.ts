import { Schema, model, models, Types } from "mongoose";

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  role: "donor" | "business" | "collector";
  location?: {
    address?: string;
    lat?: number;
    lng?: number;
  };
  contactInfo?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["donor", "business", "collector"], default: "donor" },
    location: {
      address: { type: String, trim: true },
      lat: Number,
      lng: Number,
    },
    contactInfo: { type: String, trim: true },
  },
  { timestamps: true }
);

export default models.User || model<IUser>("User", UserSchema);
