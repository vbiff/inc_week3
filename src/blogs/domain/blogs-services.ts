import { Blog } from "../types/blog";
import { blogInputDto } from "../dto/blog.input_dto";
import { blogsRepository } from "../repositories/blogs.mongodb.repositories";
import { PaginationAndSortingReq } from "../../core/types/pagination-and-sorting-req";

export const blogsServices = {
  async findBlogs(query: PaginationAndSortingReq): Promise<Blog[]> {
    return blogsRepository.findAll(query);
  },

  async findBlogById(id: string): Promise<Blog | null> {
    return await blogsRepository.findById(id);
  },

  async createBlog(inputBlog: blogInputDto): Promise<Blog | null> {
    const newBlog = {
      ...inputBlog,
      id: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      isMembership: false,
    };
    const _blogId = await blogsRepository.createBlog(newBlog);

    return blogsRepository.findByObjectId(_blogId);
  },

  async updateBlog(dto: blogInputDto, id: string): Promise<void | null> {
    return await blogsRepository.updateBlog(dto, id);
  },

  async deleteBlog(id: string): Promise<boolean> {
    return await blogsRepository.deleteBlog(id);
  },
};
