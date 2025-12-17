import { SortDirection } from "mongodb";

export type PaginationAndSortingReq = {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: SortDirection;
};
