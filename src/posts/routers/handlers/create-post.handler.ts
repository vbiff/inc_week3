import { HttpStatuses } from "../../../core/types/http-statuses";
import { Request, Response } from "express";
import { postsRepository } from "../../repositories/posts.mongodb.repositories";

export async function createPostHandler(req: Request, res: Response) {
  const newBlog = await postsRepository.createPost(req.body);
  res.status(HttpStatuses.CREATED_201).send(newBlog);
}
