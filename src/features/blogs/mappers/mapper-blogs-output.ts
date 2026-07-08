import { BlogView } from "../application/queries/dto/output-dto/blog-view";
import { BlogDocument } from "../domain/blog_entity";

export function mapBlogs(blogs: BlogDocument): BlogView {
  return {
    id: blogs._id.toString(),
    name: blogs.name,
    description: blogs.description,
    websiteUrl: blogs.websiteUrl,
    createdAt: blogs.createdAt,
    isMembership: blogs.isMembership,
  };
}
