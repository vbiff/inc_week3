import { Request, Response } from "express";
import { PaginationAndSortingReq } from "../../../../core/types/pagination-and-sorting-req";
import { queryInputDtoHelper } from "../../../../core/helpers/query.input.dto.helper";
import { BlogsQueryRepository } from "../../repositories/blogs.query-mongodb.repositories";
import { inject, injectable } from "inversify";

@injectable()
export class GetAllBlogsHandler {
  constructor(
    @inject(BlogsQueryRepository) private blogsQueryRepository: BlogsQueryRepository,
  ) {}

  getAllBlogsHandler = async (req: Request, res: Response) => {
    const queryInput: PaginationAndSortingReq = queryInputDtoHelper(req);

    const blogs = await this.blogsQueryRepository.findAll(queryInput);

    res.send(blogs);
  };
}
