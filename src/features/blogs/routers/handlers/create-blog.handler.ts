import { HttpStatuses } from "../../../../core/types/http-statuses";
import { Request, Response } from "express";
import { ioc } from "../../../../composition-root";
import { BlogsService } from "../../application/command-services/blogs-services";
import { BlogsQueryRepository } from "../../repositories/blogs.query-mongodb.repositories";

const blogsService = ioc.getInstance<BlogsService>(BlogsService);
const blogsQueryRepository =
  ioc.getInstance<BlogsQueryRepository>(BlogsQueryRepository);

export async function createBlogHandler(req: Request, res: Response) {
  const blogId = await blogsService.createBlog(req.body);

  if (!blogId) {
    return;
  }

  const newBlog = await blogsQueryRepository.findByObjectId(blogId);

  if (!newBlog) {
    return;
  }

  res.status(HttpStatuses.CREATED_201).send(newBlog);
}
