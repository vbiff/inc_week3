import { HttpStatuses } from "../../../core/types/http-statuses";
import { Request, Response } from "express";
import { postsRepository } from "../../repositories/posts.repositories";

export function updatePostHandler(req: Request, res: Response) {
  const post = postsRepository.findById(req.params.id);
  if (!post) {
    res.sendStatus(HttpStatuses.NOT_FOUND_404);
    return;
  }
  postsRepository.updatePost(req.body, req.params.id);
  res.sendStatus(HttpStatuses.NO_CONTENT_204);
}
