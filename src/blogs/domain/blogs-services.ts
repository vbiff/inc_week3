import { Blog } from "../types/blog";
import { blogInputDto } from "../dto/blog.input_dto";
import { blogsRepository } from "../repositories/blogs.mongodb.repositories";

export const blogsServices = {
  async findBlogs(): Promise<Blog[]> {
    return blogsRepository.findAll();
  },

  async findBlogById(id: string): Promise<Blog | null> {
    return await blogsRepository.findById(id);
  },

  async createBlog(inputBlog: blogInputDto): Promise<Blog> {
    const newBlog = {
      ...inputBlog,
      id: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      isMembership: false,
    };
    return await blogsRepository.createBlog(newBlog);
  },

  async updateBlog(dto: blogInputDto, id: string): Promise<void | null> {
    return await blogsRepository.updateBlog(dto, id);
  },

  async deleteBlog(id: string): Promise<boolean> {
    return await blogsRepository.deleteBlog(id);
  },
};
