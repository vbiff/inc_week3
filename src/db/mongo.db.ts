import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import { UserCreateDto } from "../users/dto/input-dto/user-create-dto";
import { PostCreateDto } from "../posts/dto/input-dto/post-create-dto";
import { blogCreateDto } from "../blogs/dto/input-dto/blog-create-dto";
dotenv.config();

const mongoUri = process.env.MONGO_URL || "mongodb://localhost:27017";

export const client = new MongoClient(mongoUri);

export const usersCollection = client
  .db("blogger")
  .collection<UserCreateDto>("users");
export const postsCollection = client
  .db("blogger")
  .collection<PostCreateDto>("posts");
export const blogCollection = client
  .db("blogger")
  .collection<blogCreateDto>("blogs");

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
