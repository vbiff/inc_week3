import { blogsRepository } from "../../repositories/blogs.mongodb.repositories";
import { HttpStatuses } from "../../../core/types/http-statuses";
import { createErrorMessage } from "../../../core/utils/error.utils";
import { Response, Request } from "express";
import { Blog } from "../../types/blog";

export async function deleteBlogHandler(req: Request, res: Response) {
  const blog: Blog | null = await blogsRepository.findById(req.params.id);
  if (!blog) {
    res
      .status(HttpStatuses.NOT_FOUND_404)
      .send(createErrorMessage([{ field: "id", message: "blog not found" }]));
    return;
  }
  await blogsRepository.deleteBlog(req.params.id);
  res.sendStatus(HttpStatuses.NO_CONTENT_204);
}
