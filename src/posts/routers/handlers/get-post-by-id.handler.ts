import { HttpStatuses } from "../../../core/types/http-statuses";
import { Request, Response } from "express";
import { postsQueryRepositories } from "../../repositories/posts.mongodb-query-repository";
import { PostView } from "../../dto/output-dto/posts-view";

export async function getPostById(req: Request, res: Response) {
  const post: PostView | null = await postsQueryRepositories.findByObjectId(
    req.params.id,
  );

  if (!post) {
    res.sendStatus(HttpStatuses.NOT_FOUND_404);
    return;
  }

  res.status(HttpStatuses.OK_200).send(post);
}
