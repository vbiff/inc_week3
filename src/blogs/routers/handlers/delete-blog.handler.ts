import { blogsRepository } from "../../repositories/blogs.repositories";
import { HttpStatuses } from "../../../core/types/http-statuses";
import { createErrorMessage } from "../../../core/utils/error.utils";
import { Response, Request } from "express";

export function deleteBlogHandler(req: Request, res: Response) {
  const blog = blogsRepository.findById(req.params.id);
  if (blog !== null) {
    res
      .status(HttpStatuses.NOT_FOUND_404)
      .send(createErrorMessage([{ field: "id", message: "blog not found" }]));
    return;
  }
  blogsRepository.deleteBlog(req.params.id);
  res.sendStatus(HttpStatuses.NO_CONTENT_204);
}
