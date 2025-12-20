import { blogInputDto } from "../dto/blog.input_dto";
import { blogsRepository } from "../repositories/blogs.mongodb.repositories";
import { blogCreateDto } from "../dto/blog-create-dto";
import { WithId } from "mongodb";
import { blogsQueryRepository } from "../repositories/blogs.query-mongodb.repositories";

export const blogsServices = {
  async createBlog(
    inputBlog: blogInputDto,
  ): Promise<WithId<blogCreateDto> | null> {
    const newBlog = {
      ...inputBlog,
      createdAt: new Date().toISOString(),
      isMembership: false,
    };
    const _blogId = await blogsRepository.createBlog(newBlog);

    return blogsQueryRepository.findByObjectId(_blogId.toString());
  },

  async updateBlog(dto: blogInputDto, id: string): Promise<void | null> {
    return await blogsRepository.updateBlog(dto, id);
  },

  async deleteBlog(id: string): Promise<boolean> {
    return await blogsRepository.deleteBlog(id);
  },
};
