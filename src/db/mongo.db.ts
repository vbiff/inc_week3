import { MongoClient } from "mongodb";

const mongoUri = process.env.MONGODB_URI || "mongodb+srv://mbseq_db_user:admin@incubator.6ym49dy.mongodb.net/?appName=incubator";

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
