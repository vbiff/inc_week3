import { HttpStatuses } from "../../../core/types/http-statuses";
import { Request, Response } from "express";
import { blogsServices } from "../../domain/blogs-services";
import { mapBlogs } from "../../mappers/mapper-blogs-output";

export async function createBlogHandler(req: Request, res: Response) {
  const newBlog = await blogsServices.createBlog(req.body);

  if (!newBlog) {
    return;
  }

  const mappedBlog = mapBlogs(newBlog);

  res.status(HttpStatuses.CREATED_201).send(mappedBlog);
}
