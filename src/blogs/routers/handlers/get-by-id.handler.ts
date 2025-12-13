import { blogsRepository } from "../../repositories/blogs.mongodb.repositories";
import { HttpStatuses } from "../../../core/types/http-statuses";
import { Request, Response } from "express";

export async function getBlogById(req: Request, res: Response) {
  const blog = await blogsRepository.findById(req.params.id);
  if (!blog) {
    res.sendStatus(HttpStatuses.NOT_FOUND_404);
    return;
  }
  res.status(HttpStatuses.OK_200).send(blog);
}
