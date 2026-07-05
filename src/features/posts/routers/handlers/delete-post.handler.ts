import { HttpStatuses } from "../../../../core/types/http-statuses";
import { createErrorMessage } from "../../../../core/utils/error.utils";
import { Response, Request } from "express";
import { ioc } from "../../../../composition-root";
import { PostsService } from "../../application/command-services/posts-services";

const postsService = ioc.getInstance<PostsService>(PostsService);

export async function deletePostHandler(req: Request, res: Response) {
  const isDeleted = await postsService.deletePost(req.params.id);
  if (!isDeleted) {
    res
      .status(HttpStatuses.NOT_FOUND_404)
      .send(createErrorMessage([{ field: "id", message: "blog not found" }]));
    return;
  }

  res.sendStatus(HttpStatuses.NO_CONTENT_204);
}
