import { Request, Response } from "express";
import { postsServices } from "../../../posts/domain/posts-services";
import { HttpStatuses } from "../../../core/types/http-statuses";
import { SortDirection } from "../../../core/types/sort-directions";
import { PaginationAndSortingReq } from "../../../core/types/pagination-and-sorting-req";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORT_BY,
  DEFAULT_SORT_DIRECTION,
} from "../../../core/middlewares/validation/query-pagination-sorting.validation";
import { mapperOutput } from "../../../core/mappers/mapper-output";

export async function getAllPostsForSpecificBlogIdHandler(
  req: Request,
  res: Response,
) {
  const sortDirection =
    req.query.sortDirection === SortDirection.ASC
      ? SortDirection.ASC
      : SortDirection.DESC;

  const queryInput: PaginationAndSortingReq = {
    pageNumber: Number(req.query.pageNumber ?? DEFAULT_PAGE),
    pageSize: Number(req.query.pageSize ?? DEFAULT_PAGE_SIZE),
    sortBy: String(req.query.sortBy ?? DEFAULT_SORT_BY),
    sortDirection: sortDirection ?? DEFAULT_SORT_DIRECTION,
    searchNameTerm: String(req.query.searchNameTerm ?? ""),
  };

  const { posts, totalCount } = await postsServices.findAllPostsByBlogId(
    req.params.blogId,
    queryInput,
  );

  if (!posts || !posts.length) {
    res.sendStatus(HttpStatuses.NOT_FOUND_404);
    return;
  }

  const resultPosts = mapperOutput(posts, {
    pagesCount: Math.ceil(totalCount / queryInput.pageSize),
    page: queryInput.pageNumber,
    pageSize: queryInput.pageSize,
    totalCount: totalCount,
  });

  res.send(resultPosts);
}
