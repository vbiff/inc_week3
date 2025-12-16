import { HttpStatuses } from "../../../core/types/http-statuses";
import { Request, Response } from "express";
import { postsServices } from "../../domain/posts-services";

export async function updatePostHandler(req: Request, res: Response) {
  const result = await postsServices.updatePost(req.body, req.params.id);
  if (result === null) {
    res.sendStatus(HttpStatuses.NOT_FOUND_404);
    return;
  }

  res.sendStatus(HttpStatuses.NO_CONTENT_204);
}
