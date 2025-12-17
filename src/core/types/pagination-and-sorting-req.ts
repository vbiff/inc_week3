import { SortDirection } from "./sort-directions";

export type PaginationAndSortingReq = {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: SortDirection;
  searchNameTerm: string;
};
