import { Blog } from "./blog";

export type BlogOutputDto = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: Blog[];
};
