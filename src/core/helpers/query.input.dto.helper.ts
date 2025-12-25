import { Request } from "express";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORT_BY,
  DEFAULT_SORT_DIRECTION,
} from "../middlewares/validation/query-pagination-sorting.validation";
import { SortDirection } from "../types/sort-directions";
import { PaginationAndSortingReq } from "../types/pagination-and-sorting-req";

export function queryInputDtoHelper(req: Request): PaginationAndSortingReq {
  return {
    pageNumber: Number(req.query.pageNumber ?? DEFAULT_PAGE),
    pageSize: Number(req.query.pageSize ?? DEFAULT_PAGE_SIZE),
    sortBy: String(req.query.sortBy ?? DEFAULT_SORT_BY),
    sortDirection:
      req.query.sortDirection === SortDirection.ASC
        ? SortDirection.ASC
        : DEFAULT_SORT_DIRECTION,
    searchNameTerm: String(req.query.searchNameTerm ?? ""),
  };
}
