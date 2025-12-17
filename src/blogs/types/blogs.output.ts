import { Blog } from "./blog";

export type BlogsOutput = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: Blog[];
};
