import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import { PostCreateDto } from "../features/posts/application/command-services/dto/post-create-dto";
import { blogCreateDto } from "../features/blogs/application/command-services/dto/blog-create-dto";
import { CommentCreateDto } from "../features/comments/application/command-service/dto/comment-create-dto";
import { AppConfig } from "../core/config/config";
import { UserCreateDto } from "../features/users/application/command-services/dto/user-create-dto";
import { RefreshTokenDTO } from "../features/auth/application/command-services/dto/refresh-token-dto";
dotenv.config();

const mongoUri = AppConfig.MONGO_URL || "mongodb://localhost:27017";

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
export const commentsCollection = client
  .db("blogger")
  .collection<CommentCreateDto>("comments");
export const refreshTokensCollection = client
  .db("blogger")
  .collection<RefreshTokenDTO>("refreshTokens");

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
