import { HttpStatuses } from "../../../core/types/http-statuses";
import { Request, Response } from "express";
import { postsServices } from "../../domain/posts-services";
import { mapperPost } from "../../mappers/mapper-post";
import { WithId } from "mongodb";
import { PostCreateDto } from "../../dto/post-create-dto";

export async function getPostById(req: Request, res: Response) {
  const post: WithId<PostCreateDto> | null = await postsServices.findById(
    req.params.id,
  );

  if (!post) {
    res.sendStatus(HttpStatuses.NOT_FOUND_404);
    return;
  }
  const mappedPost = mapperPost(post);

  res.status(HttpStatuses.OK_200).send(mappedPost);
}
