//db
import { BlogView } from "../features/blogs/application/queries/dto/output-dto/blog-view";
import { PostView } from "../features/posts/application/queries/dto/output-dto/posts-view";

export const db = {
  blogs: <BlogView[]>[],
  posts: <PostView[]>[],
};
