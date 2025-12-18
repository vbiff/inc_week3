import { Blog } from "../types/blog";
import { WithId } from "mongodb";
import { blogCreateDto } from "../dto/blog-create-dto";

export function mapBlogs(blogs: WithId<blogCreateDto>): Blog {
  return {
    id: blogs._id.toString(),
    name: blogs.name,
    description: blogs.description,
    websiteUrl: blogs.websiteUrl,
    createdAt: blogs.createdAt,
    isMembership: blogs.isMembership,
  };
}
