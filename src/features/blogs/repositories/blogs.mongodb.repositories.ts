import { BlogInputDto } from "../application/queries/dto/input-dto/blog_input_dto";

import { injectable } from "inversify";
import { BlogEntity, BlogModel } from "../domain/blog_entity";

@injectable()
export class BlogsRepository {
  async createBlog(inputBlog: BlogInputDto): Promise<string> {
    const blog = new BlogEntity(inputBlog);
    const created = await BlogModel.create(blog);
    return created._id.toString();
  }

  async updateBlog(dto: BlogInputDto, id: string): Promise<void | null> {
    const blog = await BlogModel.findById(id);
    if (!blog) {
      return null;
    }
    blog.updateBlog(dto);
    await blog.save();
    return;
  }

  async deleteBlog(id: string): Promise<boolean> {
    const result = await BlogModel.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }
}
