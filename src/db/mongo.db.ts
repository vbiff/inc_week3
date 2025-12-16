import { MongoClient } from "mongodb";
import dotenv from 'dotenv'
dotenv.config()


const mongoUri = process.env.MONGO_URL || "mongodb://localhost:27017"

export const client = new MongoClient(mongoUri);

export async function runDb(): Promise<void> {
  try {
    await client.connect();

    await client.db("product").command({ ping: 1 });
    console.log("Database Connected " + mongoUri);
  } catch {
    console.log("Can't connect to mongodb");
    await client.close();
  }
}
