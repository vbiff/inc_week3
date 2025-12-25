import { HttpStatuses } from "../../../core/types/http-statuses";
import { Request, Response } from "express";
import { blogsServices } from "../../domain/blogs-services";
import { blogsQueryRepository } from "../../repositories/blogs.query-mongodb.repositories";

export async function createBlogHandler(req: Request, res: Response) {
  const blogId = await blogsServices.createBlog(req.body);

  if (!blogId) {
    return;
  }

  const newBlog = await blogsQueryRepository.findByObjectId(blogId.toString());

  if (!newBlog) {
    return;
  }

  res.status(HttpStatuses.CREATED_201).send(newBlog);
}
