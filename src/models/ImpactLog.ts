import { Schema, model, models, Types } from "mongoose";

export interface IImpactLog {
  _id: Types.ObjectId;
  exchangeId: Types.ObjectId;
  wasteDivertedKg: number;
  co2SavedKg: number;
  createdAt: Date;
  updatedAt: Date;
}

const ImpactLogSchema = new Schema<IImpactLog>(
  {
    exchangeId: { type: Schema.Types.ObjectId, ref: "Exchange", required: true, index: true },
    wasteDivertedKg: { type: Number, required: true, min: 0 },
    co2SavedKg: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

export default models.ImpactLog || model<IImpactLog>("ImpactLog", ImpactLogSchema);
