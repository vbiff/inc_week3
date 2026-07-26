import { PaginationRes } from "../types/pagination-res";

export function mapperOutput<T>(items: T[], meta: PaginationRes) {
  return {
    pagesCount: meta.pagesCount,
    page: meta.page,
    pageSize: meta.pageSize,
    totalCount: meta.totalCount,
    items,
  };
}
