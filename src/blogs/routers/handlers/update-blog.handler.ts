import { blogsRepository } from "../../repositories/blogs.mongodb.repositories";
import { HttpStatuses } from "../../../core/types/http-statuses";
import { Request, Response } from "express";

export async function updateBlogHandler(req: Request, res: Response) {
  const blog = await blogsRepository.findById(req.params.id);
  if (!blog) {
    res.sendStatus(HttpStatuses.NOT_FOUND_404);
    return;
  }
  await blogsRepository.updateBlog(req.body, req.params.id);
  res.sendStatus(HttpStatuses.NO_CONTENT_204);
}
