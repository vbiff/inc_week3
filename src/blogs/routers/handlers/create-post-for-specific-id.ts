import { HttpStatuses } from "../../../core/types/http-statuses";
import { Request, Response } from "express";
import { postsServices } from "../../../posts/domain/posts-services";
import { blogsServices } from "../../domain/blogs-services";

export async function createPostForSpecificBlogIdHandler(
  req: Request,
  res: Response,
) {
  const blog = await blogsServices.findBlogById(req.params.blogId);

  if (!blog) {
    res.sendStatus(HttpStatuses.NOT_FOUND_404);
    return;
  }

  const newBlog = await postsServices.createPostForSpecificBlogId(
    req.body,
    req.params.blogId,
  );

  if (newBlog === null) {
    res.sendStatus(HttpStatuses.NOT_FOUND_404);
  }
  res.status(HttpStatuses.CREATED_201).send(newBlog);
}
