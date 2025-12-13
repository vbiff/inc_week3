import { Router, Request, Response } from "express";
import { HttpStatuses } from "../../core/types/http-statuses";
import { client } from "../../db/mongo.db";
import { Blog } from "../../blogs/types/blog";
import { Post } from "../../posts/types/posts";

export const testingRouter: Router = Router({});

testingRouter.delete("/all-data", async (req: Request, res: Response) => {
  await client.db("blogger").collection<Blog>("blogs").deleteMany({});
  await client.db("blogger").collection<Post>("posts").deleteMany({});
  res.sendStatus(HttpStatuses.NO_CONTENT_204);
});
