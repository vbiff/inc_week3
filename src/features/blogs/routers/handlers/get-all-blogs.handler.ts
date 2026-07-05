import { Request, Response } from "express";
import { PaginationAndSortingReq } from "../../../../core/types/pagination-and-sorting-req";
import { ioc } from "../../../../composition-root";
import { queryInputDtoHelper } from "../../../../core/helpers/query.input.dto.helper";
import { BlogsQueryRepository } from "../../repositories/blogs.query-mongodb.repositories";

const blogsQueryRepository =
  ioc.getInstance<BlogsQueryRepository>(BlogsQueryRepository);

export async function getAllBlogsHandler(req: Request, res: Response) {
  const queryInput: PaginationAndSortingReq = queryInputDtoHelper(req);

  const blogs = await blogsQueryRepository.findAll(queryInput);

  res.send(blogs);
}
