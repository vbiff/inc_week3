import { Blog } from "../types/blog";
import { PaginationRes } from "../../core/types/pagination-res";
import { BlogsOutput } from "../types/blogs.output";

export function mapperOutputForBlogs(
  blogs: Blog[],
  meta: PaginationRes,
): BlogsOutput {
  return { meta, items: blogs };
}
