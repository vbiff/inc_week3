import { blogsRepository } from "../../repositories/blogs.mongodb.repositories";
import { HttpStatuses } from "../../../core/types/http-statuses";
import { Request, Response } from "express";

export async function createBlogHandler(req: Request, res: Response) {
  const newBlog = await blogsRepository.createBlog(req.body);

  res.status(HttpStatuses.CREATED_201).send(newBlog);
}
