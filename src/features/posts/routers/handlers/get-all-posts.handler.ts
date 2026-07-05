import { Request, Response } from "express";
import { PaginationAndSortingReq } from "../../../../core/types/pagination-and-sorting-req";
import { ioc } from "../../../../composition-root";
import { PostsQueryRepository } from "../../repositories/posts.mongodb-query-repository";

const postsQueryRepository =
  ioc.getInstance<PostsQueryRepository>(PostsQueryRepository);
import { queryInputDtoHelper } from "../../../../core/helpers/query.input.dto.helper";

export async function getAllPostsHandler(req: Request, res: Response) {
  const queryInput: PaginationAndSortingReq = queryInputDtoHelper(req);

  const resultPosts = await postsQueryRepository.findAll(queryInput);

  res.send(resultPosts);
}
