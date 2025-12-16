import { HttpStatuses } from "../../../core/types/http-statuses";
import { Request, Response } from "express";
import { blogsServices } from "../../domain/blogs-services";

export async function createBlogHandler(req: Request, res: Response) {
  const newBlog = await blogsServices.createBlog(req.body);

  res.status(HttpStatuses.CREATED_201).send(newBlog);
}
