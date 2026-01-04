import { Router, Request, Response } from "express";
import { HttpStatuses } from "../../core/types/http-statuses";
import { client } from "../../db/mongo.db";
import { BlogView } from "../../features/blogs/application/queries/dto/output-dto/blog-view";
import { PostView } from "../../features/posts/application/queries/dto/output-dto/posts-view";
import { UserView } from "../../features/users/application/queries/dto/output-dto/user-view";
import { CommentCreateDto } from "../../features/comments/application/command-service/dto/comment-create-dto";

export const testingRouter: Router = Router({});

testingRouter.delete("/all-data", async (req: Request, res: Response) => {
  await client.db("blogger").collection<BlogView>("blogs").deleteMany({});
  await client.db("blogger").collection<PostView>("posts").deleteMany({});
  await client.db("blogger").collection<UserView>("users").deleteMany({});
  await client
    .db("blogger")
    .collection<CommentCreateDto>("comments")
    .deleteMany({});
  res.sendStatus(HttpStatuses.NO_CONTENT_204);
});
