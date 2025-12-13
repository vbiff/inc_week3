import { HttpStatuses } from "../../../core/types/http-statuses";
import { Request, Response } from "express";
import { postsRepository } from "../../repositories/posts.mongodb.repositories";

export async function updatePostHandler(req: Request, res: Response) {
  const post = await postsRepository.findById(req.params.id);
  if (!post) {
    res.sendStatus(HttpStatuses.NOT_FOUND_404);
    return;
  }
  await postsRepository.updatePost(req.body, req.params.id);
  res.sendStatus(HttpStatuses.NO_CONTENT_204);
}
