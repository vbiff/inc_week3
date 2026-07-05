import { Request, Response } from "express";
import { PaginationAndSortingReq } from "../../../../core/types/pagination-and-sorting-req";
import { container } from "../../../../composition-root";
import { PostsQueryRepository } from "../../repositories/posts.mongodb-query-repository";

const postsQueryRepository = container.get(PostsQueryRepository);
import { queryInputDtoHelper } from "../../../../core/helpers/query.input.dto.helper";

export async function getAllPostsHandler(req: Request, res: Response) {
  const queryInput: PaginationAndSortingReq = queryInputDtoHelper(req);

  const resultPosts = await postsQueryRepository.findAll(queryInput);

  res.send(resultPosts);
}
