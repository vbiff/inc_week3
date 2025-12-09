import { blogsRepository } from "../../repositories/blogs.repositories";
import { HttpStatuses } from "../../../core/types/http-statuses";
import { Request, Response } from "express";

export function createBlogHandler(req: Request, res: Response) {
  const newBlog = blogsRepository.createBlog(req.body);
  res.status(HttpStatuses.CREATED_201).send(newBlog);
}
