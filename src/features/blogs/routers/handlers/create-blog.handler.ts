import { HttpStatuses } from "../../../../core/types/http-statuses";
import { Request, Response } from "express";
import { blogsService, blogsQueryRepository } from "../../../../composition-root";

export async function createBlogHandler(req: Request, res: Response) {
  const blogId = await blogsService.createBlog(req.body);

  if (!blogId) {
    return;
  }

  const newBlog = await blogsQueryRepository.findByObjectId(blogId);

  if (!newBlog) {
    return;
  }

  res.status(HttpStatuses.CREATED_201).send(newBlog);
}
