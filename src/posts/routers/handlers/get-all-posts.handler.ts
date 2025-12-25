import { Request, Response } from "express";
import { PaginationAndSortingReq } from "../../../core/types/pagination-and-sorting-req";
import { postsQueryRepositories } from "../../repositories/posts.mongodb-query-repository";
import { queryInputDtoHelper } from "../../../core/helpers/query.input.dto.helper";

export async function getAllPostsHandler(req: Request, res: Response) {
  const queryInput: PaginationAndSortingReq = queryInputDtoHelper(req);

  const resultPosts = await postsQueryRepositories.findAll(queryInput);

  res.send(resultPosts);
}
