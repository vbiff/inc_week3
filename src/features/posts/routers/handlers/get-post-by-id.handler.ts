import { HttpStatuses } from "../../../../core/types/http-statuses";
import { Request, Response } from "express";
import { ioc } from "../../../../composition-root";
import { PostView } from "../../application/queries/dto/output-dto/posts-view";
import { PostsQueryRepository } from "../../repositories/posts.mongodb-query-repository";

const postsQueryRepository =
  ioc.getInstance<PostsQueryRepository>(PostsQueryRepository);

export async function getPostById(req: Request, res: Response) {
  const post: PostView | null = await postsQueryRepository.findByObjectId(
    req.params.id,
  );

  if (!post) {
    res.sendStatus(HttpStatuses.NOT_FOUND_404);
    return;
  }

  res.status(HttpStatuses.OK_200).send(post);
}
