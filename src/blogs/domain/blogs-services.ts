import { BlogInputDto } from "../dto/input-dto/blog_input_dto";
import { blogsRepository } from "../repositories/blogs.mongodb.repositories";
import { ObjectId } from "mongodb";

export const blogsServices = {
  async createBlog(inputBlog: BlogInputDto): Promise<ObjectId | null> {
    const newBlog = {
      ...inputBlog,
      createdAt: new Date().toISOString(),
      isMembership: false,
    };
    return await blogsRepository.createBlog(newBlog);
  },

  async updateBlog(dto: BlogInputDto, id: string): Promise<void | null> {
    return await blogsRepository.updateBlog(dto, id);
  },

  async deleteBlog(id: string): Promise<boolean> {
    return await blogsRepository.deleteBlog(id);
  },
};
