import { Schema, model, models, Types } from "mongoose";

export interface IExchange {
  _id: Types.ObjectId;
  listingId: Types.ObjectId;
  matchId: Types.ObjectId;
  completedAt: Date;
  quantityExchanged: number;
  createdAt: Date;
  updatedAt: Date;
}

const ExchangeSchema = new Schema<IExchange>(
  {
    listingId: { type: Schema.Types.ObjectId, ref: "Listing", required: true, index: true },
    matchId: { type: Schema.Types.ObjectId, ref: "Match", required: true },
    completedAt: { type: Date, default: Date.now },
    quantityExchanged: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

export default models.Exchange || model<IExchange>("Exchange", ExchangeSchema);
