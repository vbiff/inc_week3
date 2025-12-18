import { HttpStatuses } from "../../../core/types/http-statuses";
import { Request, Response } from "express";
import { postsServices } from "../../domain/posts-services";
import { mapperPost } from "../../mappers/mapper-post";

export async function createPostHandler(req: Request, res: Response) {
  const newPost = await postsServices.createPost(req.body);

  if (!newPost) {
    return;
  }
  const mappedPost = mapperPost(newPost);

  res.status(HttpStatuses.CREATED_201).send(mappedPost);
}
