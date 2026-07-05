import { HttpStatuses } from "../../../../core/types/http-statuses";
import { Request, Response } from "express";
import { ioc } from "../../../../composition-root";
import { PostsService } from "../../application/command-services/posts-services";

const postsService = ioc.getInstance<PostsService>(PostsService);

export async function updatePostHandler(req: Request, res: Response) {
  const result = await postsService.updatePost(req.body, req.params.id);
  if (result === null) {
    res.sendStatus(HttpStatuses.NOT_FOUND_404);
    return;
  }

  res.sendStatus(HttpStatuses.NO_CONTENT_204);
}
