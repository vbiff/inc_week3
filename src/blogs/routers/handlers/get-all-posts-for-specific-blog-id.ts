import { Request, Response } from "express";
import { postsServices } from "../../../posts/domain/posts-services";

export async function getAllPostsForSpecificBlogIdHandler(
  req: Request,
  res: Response,
) {
  const blogs = await postsServices.findAllPostsByBlogId(req.params.blogId);
  if (!blogs || !blogs.length) {
    res.sendStatus(404);
  }
  res.send(blogs);
}
