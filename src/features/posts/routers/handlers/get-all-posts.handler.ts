import { Request, Response } from "express";
import { PaginationAndSortingReq } from "../../../../core/types/pagination-and-sorting-req";
import { PostsQueryRepository } from "../../repositories/posts.mongodb-query-repository";
import { queryInputDtoHelper } from "../../../../core/helpers/query.input.dto.helper";
import { inject, injectable } from "inversify";

@injectable()
export class GetAllPostsHandler {
  constructor(
    @inject(PostsQueryRepository) private postsQueryRepository: PostsQueryRepository,
  ) {}

  getAllPostsHandler = async (req: Request, res: Response) => {
    const queryInput: PaginationAndSortingReq = queryInputDtoHelper(req);

    const resultPosts = await this.postsQueryRepository.findAll(queryInput);

    res.send(resultPosts);
  };
}
