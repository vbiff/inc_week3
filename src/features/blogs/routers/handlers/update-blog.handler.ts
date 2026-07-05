import { HttpStatuses } from "../../../../core/types/http-statuses";
import { Request, Response } from "express";
import { container } from "../../../../composition-root";
import { BlogsService } from "../../application/command-services/blogs-services";

const blogsService = container.get(BlogsService);

export async function updateBlogHandler(req: Request, res: Response) {
  const blog = await blogsService.updateBlog(req.body, req.params.id);
  if (blog === null) {
    res.sendStatus(HttpStatuses.NOT_FOUND_404);
    return;
  }
  res.sendStatus(HttpStatuses.NO_CONTENT_204);
}
