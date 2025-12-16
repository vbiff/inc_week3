import { HttpStatuses } from "../../../core/types/http-statuses";
import { Request, Response } from "express";
import { postsServices } from "../../../posts/domain/posts-services";

export async function createPostForSpecificBlogIdHandler(
  req: Request,
  res: Response,
) {
  const newBlog = await postsServices.createPostforSpecificBlogId(
    req.body,
    req.params.blogId,
  );
  res.status(HttpStatuses.CREATED_201).send(newBlog);
}
