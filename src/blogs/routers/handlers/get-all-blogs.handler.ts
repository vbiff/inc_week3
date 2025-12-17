import { Request, Response } from "express";
import { blogsServices } from "../../domain/blogs-services";
import { PaginationAndSortingReq } from "../../../core/types/pagination-and-sorting-req";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORT_BY,
  DEFAULT_SORT_DIRECTION,
} from "../../../core/middlewares/validation/query-pagination-sorting.validation";
import { SortDirection } from "../../../core/types/sort-directions";
import { mapperOutputForBlogs } from "../../mappers/mapper-output-for-blogs";

export async function getAllBlogsHandler(req: Request, res: Response) {
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
  const { items, totalCount } = await blogsServices.findBlogs(queryInput);

  const blogs = mapperOutputForBlogs(items, {
    pagesCount: Math.ceil(totalCount / queryInput.pageSize),
    page: queryInput.pageNumber,
    pageSize: queryInput.pageSize,
    totalCount: totalCount,
  });

  console.log("blogs", blogs);
  res.send(blogs);
}

///get.   /blog/?sortBy=data&sortDirection=asc&....
