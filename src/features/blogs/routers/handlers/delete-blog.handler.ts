import { HttpStatuses } from "../../../../core/types/http-statuses";
import { createErrorMessage } from "../../../../core/utils/error.utils";
import { Response, Request } from "express";
import { container } from "../../../../composition-root";
import { BlogsService } from "../../application/command-services/blogs-services";

const blogsService = container.get(BlogsService);

export async function deleteBlogHandler(req: Request, res: Response) {
  const blog = await blogsService.deleteBlog(req.params.id);
  if (!blog) {
    res
      .status(HttpStatuses.NOT_FOUND_404)
      .send(createErrorMessage([{ field: "id", message: "blog not found" }]));
    return;
  }
  res.sendStatus(HttpStatuses.NO_CONTENT_204);
}
