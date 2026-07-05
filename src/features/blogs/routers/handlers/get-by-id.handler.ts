import { HttpStatuses } from "../../../../core/types/http-statuses";
import { Request, Response } from "express";
import { ioc } from "../../../../composition-root";
import { BlogsQueryRepository } from "../../repositories/blogs.query-mongodb.repositories";

const blogsQueryRepository =
  ioc.getInstance<BlogsQueryRepository>(BlogsQueryRepository);

export async function getBlogById(req: Request, res: Response) {
  const blog = await blogsQueryRepository.findByObjectId(req.params.id);
  if (!blog) {
    res.sendStatus(HttpStatuses.NOT_FOUND_404);
    return;
  }

  res.status(HttpStatuses.OK_200).send(blog);
}
