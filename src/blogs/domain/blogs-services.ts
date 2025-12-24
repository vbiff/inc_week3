import { blogInputDto } from "../dto/blog.input_dto";
import { blogsRepository } from "../repositories/blogs.mongodb.repositories";
import { ObjectId } from "mongodb";

export const blogsServices = {
  async createBlog(inputBlog: blogInputDto): Promise<ObjectId | null> {
    const newBlog = {
      ...inputBlog,
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
