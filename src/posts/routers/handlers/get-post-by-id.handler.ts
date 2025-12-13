import { HttpStatuses } from "../../../core/types/http-statuses";
import { Request, Response } from "express";
import { postsRepository } from "../../repositories/posts.mongodb.repositories";

export async function getPostById(req: Request, res: Response) {
  const post = await postsRepository.findById(req.params.id);
  if (!post) {
    res.sendStatus(HttpStatuses.NOT_FOUND_404);
    return;
  }

  res.status(HttpStatuses.OK_200).send(post);
}
