import { HttpStatuses } from "../../../../core/types/http-statuses";
import { Request, Response } from "express";
import { BlogsService } from "../../application/command-services/blogs-services";
import { inject, injectable } from "inversify";

@injectable()
export class UpdateBlogHandler {
  constructor(@inject(BlogsService) private blogsService: BlogsService) {}

  updateBlogHandler = async (req: Request, res: Response) => {
    const blog = await this.blogsService.updateBlog(req.body, req.params.id);
    if (blog === null) {
      res.sendStatus(HttpStatuses.NOT_FOUND_404);
      return;
    }
    res.sendStatus(HttpStatuses.NO_CONTENT_204);
  };
}
