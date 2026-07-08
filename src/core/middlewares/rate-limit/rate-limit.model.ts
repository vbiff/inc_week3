import { Model, model, Schema } from "mongoose";

export type RateLimitEntry = {
  ip: string;
  url: string;
  date: Date;
};

export const RateLimitSchema = new Schema<RateLimitEntry>({
  ip: { type: String, required: true },
  url: { type: String, required: true },
  date: { type: Date, required: true },
});

export const RateLimitModel: Model<RateLimitEntry> = model<RateLimitEntry>(
  "RateLimit",
  RateLimitSchema,
);
