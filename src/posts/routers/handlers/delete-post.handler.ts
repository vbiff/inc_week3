import { HttpStatuses } from "../../../core/types/http-statuses";
import { createErrorMessage } from "../../../core/utils/error.utils";
import { Response, Request } from "express";
import { postsRepository } from "../../repositories/posts.mongodb.repositories";
import { Post } from "../../types/posts";

export async function deletePostHandler(req: Request, res: Response) {
  const post: Post | null = await postsRepository.findById(req.params.id);
  if (!post) {
    res
      .status(HttpStatuses.NOT_FOUND_404)
      .send(createErrorMessage([{ field: "id", message: "blog not found" }]));
    return;
  }
  await postsRepository.deletePost(req.params.id);
  res.sendStatus(HttpStatuses.NO_CONTENT_204);
}
