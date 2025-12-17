import { PaginationRes } from "../types/pagination-res";

export function mapperOutput<T>(items: T[], meta: PaginationRes) {
  return {
    page: meta.page,
    pagesCount: meta.pagesCount,
    totalCount: meta.totalCount,
    pageSize: meta.pageSize,
    items,
  };
}
