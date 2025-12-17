import { Blog } from "./blog";
import { PaginationRes } from "../../core/types/pagination-res";

export type BlogsOutput = {
  meta: PaginationRes;
  items: Blog[];
};
