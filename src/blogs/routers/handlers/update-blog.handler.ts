import { HttpStatuses } from "../../../core/types/http-statuses";
import { Request, Response } from "express";
import { blogsServices } from "../../domain/blogs-services";

export async function updateBlogHandler(req: Request, res: Response) {
  const blog = await blogsServices.updateBlog(req.body, req.params.id);
  if (blog === null) {
    res.sendStatus(HttpStatuses.NOT_FOUND_404);
    return;
  }
  res.sendStatus(HttpStatuses.NO_CONTENT_204);
}
