import { HttpStatuses } from "../../../core/types/http-statuses";
import { Request, Response } from "express";
import { blogsServices } from "../../domain/blogs-services";

export async function getBlogById(req: Request, res: Response) {
  const blog = await blogsServices.findBlogById(req.params.id);
  if (!blog) {
    res.sendStatus(HttpStatuses.NOT_FOUND_404);
    return;
  }
  console.log(blog);
  res.status(HttpStatuses.OK_200).send(blog);
}
