import { blogsRepository } from "../../repositories/blogs.repositories";
import { HttpStatuses } from "../../../core/types/http-statuses";
import { Request, Response } from "express";

export function updateBlogHandler(req: Request, res: Response) {
  blogsRepository.updateBlog(req.body, req.params.id);
  res.sendStatus(HttpStatuses.NO_CONTENT_204);
}
