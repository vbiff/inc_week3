import { HttpStatuses } from "../../../core/types/http-statuses";
import { Request, Response } from "express";
import { postsServices } from "../../domain/posts-services";

export async function createPostHandler(req: Request, res: Response) {
  const newBlog = await postsServices.createPost(req.body);
  res.status(HttpStatuses.CREATED_201).send(newBlog);
}
