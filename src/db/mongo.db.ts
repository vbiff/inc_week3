import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import { AppConfig } from "../core/config/config";
import { RefreshTokenDTO } from "../features/auth/application/command-services/dto/refresh-token-dto";
import { DeviceDTO } from "../features/security/application/dto/device-dto";
import mongoose from "mongoose";

dotenv.config();

const mongoUri = AppConfig.MONGO_URL || "mongodb://localhost:27017";

export const client = new MongoClient(mongoUri);

const dbName = "blogger";

export const refreshTokensCollection = client
  .db(dbName)
  .collection<RefreshTokenDTO>("refreshTokens");
export const devicesCollection = client
  .db(dbName)
  .collection<DeviceDTO>("devices");
export const rateLimitCollection = client
  .db(dbName)
  .collection<{ ip: string; url: string; date: Date }>("rateLimit");

export async function runDb(): Promise<void> {
  try {
    await client.connect();
    await mongoose.connect(mongoUri, { dbName });
    await client.db(dbName).command({ ping: 1 });
    console.log("Database Connected " + mongoUri);
  } catch {
    console.log("Can't connect to mongodb");
    await mongoose.disconnect();
    await client.close();
  }
}
