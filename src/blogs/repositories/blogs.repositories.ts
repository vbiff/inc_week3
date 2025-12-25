import { BlogView } from "../dto/output-dto/blog-view";
import { db } from "../../db/in-memory.db";
import { blogInputDto } from "../dto/input-dto/blog_input_dto";

export const blogsRepository = {
  async findAll(): Promise<BlogView[]> {
    return db.blogs;
  },

  async findById(id: string): Promise<BlogView | null> {
    return db.blogs.find((blog) => blog.id === id) ?? null;
  },

  async createBlog(inputBlog: blogInputDto): Promise<BlogView> {
    const newBlog = {
      ...inputBlog,
      id: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      isMembership: false,
    };
    db.blogs.push(newBlog);
    return newBlog;
  },

  async updateBlog(dto: blogInputDto, id: string): Promise<void> {
    const blog = db.blogs.find((blog) => blog.id === id);
    if (!blog) {
      throw new Error("blog does not exist");
    }
    blog.name = dto.name;
    blog.description = dto.description;
    blog.websiteUrl = dto.websiteUrl;

    return;
  },

  async deleteBlog(id: string): Promise<void> {
    const blogIndex = db.blogs.findIndex((m) => m.id === id);
    if (blogIndex === -1) {
      throw new Error("blog not found");
    }
    db.blogs.splice(blogIndex, 1);
    return;
  },
};
