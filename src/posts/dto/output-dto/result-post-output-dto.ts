import { PostView } from "./posts-view";

export type ResultPostOutputDto = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: PostView[];
};
