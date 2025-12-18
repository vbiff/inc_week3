import { blogInputDto } from "../dto/blog.input_dto";
import { blogsRepository } from "../repositories/blogs.mongodb.repositories";
import { PaginationAndSortingReq } from "../../core/types/pagination-and-sorting-req";
import { blogCreateDto } from "../dto/blog-create-dto";
import { WithId } from "mongodb";

export const blogsServices = {
  async findBlogs(
    query: PaginationAndSortingReq,
  ): Promise<{ items: WithId<blogCreateDto>[]; totalCount: number }> {
    return blogsRepository.findAll(query);
  },

  async findBlogById(id: string): Promise<WithId<blogCreateDto> | null> {
    return await blogsRepository.findByObjectId(id);
  },

  async createBlog(
    inputBlog: blogInputDto,
  ): Promise<WithId<blogCreateDto> | null> {
    const newBlog = {
      ...inputBlog,
      createdAt: new Date().toISOString(),
      isMembership: false,
    };
    const _blogId = await blogsRepository.createBlog(newBlog);

    return blogsRepository.findByObjectId(_blogId.toString());
  },

  async updateBlog(dto: blogInputDto, id: string): Promise<void | null> {
    return await blogsRepository.updateBlog(dto, id);
  },

  async deleteBlog(id: string): Promise<boolean> {
    return await blogsRepository.deleteBlog(id);
  },
};
