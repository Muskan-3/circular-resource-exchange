import { Schema, model, models, Types } from "mongoose";
import { CATEGORIES, CONDITIONS, LISTING_STATUSES } from "@/lib/constants";

const CATEGORY_VALUES = CATEGORIES.map((c) => c.value);
const CONDITION_VALUES = CONDITIONS.map((c) => c.value);

export interface IAiTags {
  material?: string;
  condition?: string;
  description?: string;
  source: "ai" | "user";
}

export interface IListing {
  _id: Types.ObjectId;
  ownerId: Types.ObjectId;
  category: (typeof CATEGORY_VALUES)[number];
  description: string;
  quantity: number;
  unit: string;
  condition: (typeof CONDITION_VALUES)[number];
  photoUrl?: string;
  aiTags?: IAiTags;
  embedding: number[];
  location: {
    address: string;
    lat?: number;
    lng?: number;
  };
  status: (typeof LISTING_STATUSES)[number];
  createdAt: Date;
  updatedAt: Date;
}

const ListingSchema = new Schema<IListing>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    category: { type: String, enum: CATEGORY_VALUES, required: true },
    description: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 0 },
    unit: { type: String, default: "kg", trim: true },
    condition: { type: String, enum: CONDITION_VALUES, required: true },
    photoUrl: { type: String, trim: true },
    aiTags: {
      material: String,
      condition: String,
      description: String,
      source: { type: String, enum: ["ai", "user"] },
    },
    embedding: { type: [Number], default: [] },
    location: {
      address: { type: String, required: true, trim: true },
      lat: Number,
      lng: Number,
    },
    status: { type: String, enum: LISTING_STATUSES, default: "available", index: true },
  },
  { timestamps: true }
);

ListingSchema.index({ category: 1, status: 1 });

export default models.Listing || model<IListing>("Listing", ListingSchema);
