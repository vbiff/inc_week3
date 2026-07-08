import { HttpStatuses } from "../../../../core/types/http-statuses";
import { Request, Response } from "express";
import { PostsService } from "../../application/command-services/posts-services";
import { inject, injectable } from "inversify";

@injectable()
export class UpdatePostHandler {
  constructor(@inject(PostsService) private postsService: PostsService) {}

  updatePostHandler = async (req: Request, res: Response) => {
    const result = await this.postsService.updatePost(req.body, req.params.id);
    if (result === null) {
      res.sendStatus(HttpStatuses.NOT_FOUND_404);
      return;
    }

    res.sendStatus(HttpStatuses.NO_CONTENT_204);
  };
}
