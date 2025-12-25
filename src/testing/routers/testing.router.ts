import { Router, Request, Response } from "express";
import { HttpStatuses } from "../../core/types/http-statuses";
import { client } from "../../db/mongo.db";
import { BlogView } from "../../blogs/dto/output-dto/blog-view";
import { PostView } from "../../posts/dto/output-dto/posts-view";
import { UserView } from "../../users/dto/output-dto/user-view";

export const testingRouter: Router = Router({});

testingRouter.delete("/all-data", async (req: Request, res: Response) => {
  await client.db("blogger").collection<BlogView>("blogs").deleteMany({});
  await client.db("blogger").collection<PostView>("posts").deleteMany({});
  await client.db("blogger").collection<UserView>("users").deleteMany({});
  res.sendStatus(HttpStatuses.NO_CONTENT_204);
});
