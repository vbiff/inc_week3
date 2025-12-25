import { Request, Response } from "express";
import { PaginationAndSortingReq } from "../../../core/types/pagination-and-sorting-req";
import { blogsQueryRepository } from "../../repositories/blogs.query-mongodb.repositories";
import { queryInputDtoHelper } from "../../../core/helpers/query.input.dto.helper";

export async function getAllBlogsHandler(req: Request, res: Response) {
  const queryInput: PaginationAndSortingReq = queryInputDtoHelper(req);

  const blogs = await blogsQueryRepository.findAll(queryInput);

  res.send(blogs);
}
