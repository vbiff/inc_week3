import { BlogView } from "../dto/output-dto/blog-view";
import { WithId } from "mongodb";
import { blogCreateDto } from "../dto/input-dto/blog-create-dto";

export function mapBlogs(blogs: WithId<blogCreateDto>): BlogView {
  return {
    id: blogs._id.toString(),
    name: blogs.name,
    description: blogs.description,
    websiteUrl: blogs.websiteUrl,
    createdAt: blogs.createdAt,
    isMembership: blogs.isMembership,
  };
}
