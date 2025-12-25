import { Router, Request, Response } from "express";
import { HttpStatuses } from "../../core/types/http-statuses";
import { client } from "../../db/mongo.db";
import { BlogView } from "../../blogs/dto/output-dto/blog-view";
import { Post } from "../../posts/dto/output-dto/posts";

export const testingRouter: Router = Router({});

testingRouter.delete("/all-data", async (req: Request, res: Response) => {
  await client.db("blogger").collection<BlogView>("blogs").deleteMany({});
  await client.db("blogger").collection<Post>("posts").deleteMany({});
  res.sendStatus(HttpStatuses.NO_CONTENT_204);
});
