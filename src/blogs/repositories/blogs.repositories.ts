import { Blog } from "../types/blog";
import { db } from "../../db/in-memory.db";
import { blogInputDto } from "../dto/blog.input_dto";

export const blogsRepository = {
  findAll(): Blog[] {
    return db.blogs;
  },

  findById(id: string): Blog | null {
    return db.blogs.find((blog) => (blog.id = id)) ?? null;
  },

  createBlog(inputBlog: blogInputDto): Blog {
    const newBlog = { ...inputBlog, id: new Date().toISOString() };
    db.blogs.push(newBlog);
    return newBlog;
  },

  updateBlog(dto: blogInputDto, id: string) {
    const blog = db.blogs.find((blog) => (blog.id = id));
    if (!blog) {
      throw new Error("blog does not exist");
    }
    blog.name = dto.name;
    blog.description = dto.description;
    blog.websiteUrl = dto.websiteUrl;

    return;
  },

  deleteBlog(id: string) {
    const blogIndex = db.blogs.findIndex((m) => m.id === id);
    if (blogIndex === -1) {
      throw new Error("blog not found");
    }
    db.blogs.splice(blogIndex, 1);
    return;
  },
};
