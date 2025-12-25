import { HttpStatuses } from "../../../core/types/http-statuses";
import { Request, Response } from "express";
import { blogsQueryRepository } from "../../repositories/blogs.query-mongodb.repositories";

export async function getBlogById(req: Request, res: Response) {
  const blog = await blogsQueryRepository.findByObjectId(req.params.id);
  if (!blog) {
    res.sendStatus(HttpStatuses.NOT_FOUND_404);
    return;
  }

  res.status(HttpStatuses.OK_200).send(blog);
}
