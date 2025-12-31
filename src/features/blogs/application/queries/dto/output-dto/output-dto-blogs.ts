import { BlogView } from "./blog-view";

export type OutputDtoBlogs = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: BlogView[];
};
