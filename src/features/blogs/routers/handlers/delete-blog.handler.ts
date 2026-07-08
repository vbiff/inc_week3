import { HttpStatuses } from "../../../../core/types/http-statuses";
import { createErrorMessage } from "../../../../core/utils/error.utils";
import { Response, Request } from "express";
import { BlogsService } from "../../application/command-services/blogs-services";
import { inject, injectable } from "inversify";

@injectable()
export class DeleteBlogHandler {
  constructor(@inject(BlogsService) private blogsService: BlogsService) {}
  deleteBlogHandler = async (req: Request, res: Response) => {
    const blog = await this.blogsService.deleteBlog(req.params.id);
    if (!blog) {
      res
        .status(HttpStatuses.NOT_FOUND_404)
        .send(createErrorMessage([{ field: "id", message: "blog not found" }]));
      return;
    }
    res.sendStatus(HttpStatuses.NO_CONTENT_204);
  };
}
