import { BlogInputDto } from "../queries/dto/input-dto/blog_input_dto";
import { BlogsRepository } from "../../repositories/blogs.mongodb.repositories";
import { inject, injectable } from "inversify";

@injectable()
export class BlogsService {
  constructor(
    @inject(BlogsRepository) private blogsRepository: BlogsRepository,
  ) {}

  async createBlog(inputBlog: BlogInputDto): Promise<string | null> {
    const newBlog = {
      ...inputBlog,
      createdAt: new Date().toISOString(),
      isMembership: false,
    };
    return await this.blogsRepository.createBlog(newBlog);
  }

  async updateBlog(dto: BlogInputDto, id: string): Promise<void | null> {
    return await this.blogsRepository.updateBlog(dto, id);
  }

  async deleteBlog(id: string): Promise<boolean> {
    return await this.blogsRepository.deleteBlog(id);
  }
}
