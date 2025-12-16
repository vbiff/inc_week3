import { HttpStatuses } from "../../../core/types/http-statuses";
import { createErrorMessage } from "../../../core/utils/error.utils";
import { Response, Request } from "express";
import { blogsServices } from "../../domain/blogs-services";

export async function deleteBlogHandler(req: Request, res: Response) {
  const blog = await blogsServices.deleteBlog(req.params.id);
  if (!blog) {
    res
      .status(HttpStatuses.NOT_FOUND_404)
      .send(createErrorMessage([{ field: "id", message: "blog not found" }]));
    return;
  }
  res.sendStatus(HttpStatuses.NO_CONTENT_204);
}
