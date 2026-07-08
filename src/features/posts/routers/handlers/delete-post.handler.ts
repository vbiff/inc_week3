import { HttpStatuses } from "../../../../core/types/http-statuses";
import { createErrorMessage } from "../../../../core/utils/error.utils";
import { Response, Request } from "express";
import { PostsService } from "../../application/command-services/posts-services";
import { inject, injectable } from "inversify";

@injectable()
export class DeletePostHandler {
  constructor(@inject(PostsService) private postsService: PostsService) {}

  deletePostHandler = async (req: Request, res: Response) => {
    const isDeleted = await this.postsService.deletePost(req.params.id);
    if (!isDeleted) {
      res
        .status(HttpStatuses.NOT_FOUND_404)
        .send(createErrorMessage([{ field: "id", message: "blog not found" }]));
      return;
    }

    res.sendStatus(HttpStatuses.NO_CONTENT_204);
  };
}
