import { BlogInputDto } from "../application/queries/dto/input-dto/blog_input_dto";
import { blogCollection } from "../../../db/mongo.db";
import { ObjectId } from "mongodb";
import { blogCreateDto } from "../application/command-services/dto/blog-create-dto";
import { injectable } from "inversify";

@injectable()
export class BlogsRepository {
  async createBlog(inputBlog: blogCreateDto): Promise<string> {
    const blogId = await blogCollection.insertOne(inputBlog);
    return blogId.insertedId.toString();
  }

  async updateBlog(dto: BlogInputDto, id: string): Promise<void | null> {
    const res = await blogCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name: dto.name,
          description: dto.description,
          websiteUrl: dto.websiteUrl,
        },
      },
    );
    if (res.matchedCount === 0) {
      return null;
    }
    return;
  }

  async deleteBlog(id: string): Promise<boolean> {
    const result = await blogCollection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }
}
