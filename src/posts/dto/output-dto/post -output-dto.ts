import { Post } from "./posts";

export type PostOutputDto = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: Post[];
};
