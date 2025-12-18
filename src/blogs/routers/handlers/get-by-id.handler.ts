import { HttpStatuses } from "../../../core/types/http-statuses";
import { Request, Response } from "express";
import { blogsServices } from "../../domain/blogs-services";
import { mapBlogs } from "../../mappers/mapper-blogs-output";

export async function getBlogById(req: Request, res: Response) {
  const blog = await blogsServices.findBlogById(req.params.id);
  if (!blog) {
    res.sendStatus(HttpStatuses.NOT_FOUND_404);
    return;
  }
  const mappedBlog = mapBlogs(blog);

  res.status(HttpStatuses.OK_200).send(mappedBlog);
}
