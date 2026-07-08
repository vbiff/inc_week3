import dotenv from "dotenv";
import { AppConfig } from "../core/config/config";
import mongoose from "mongoose";

dotenv.config();

const mongoUri = AppConfig.MONGO_URL || "mongodb://localhost:27017";
const dbName = "blogger";

export async function runDb(): Promise<void> {
  try {
    await mongoose.connect(mongoUri, { dbName });
    await mongoose.connection.db!.command({ ping: 1 });
    console.log("Database Connected " + mongoUri);
  } catch {
    console.log("Can't connect to mongodb");
    await mongoose.disconnect();
  }
}
