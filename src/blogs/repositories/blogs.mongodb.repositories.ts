import { blogInputDto } from "../dto/blog.input_dto";
import { client } from "../../db/mongo.db";
import { ObjectId } from "mongodb";
import { blogCreateDto } from "../dto/blog-create-dto";

export const blogCollection = client
  .db("blogger")
  .collection<blogCreateDto>("blogs");

export const blogsRepository = {
  async createBlog(inputBlog: blogCreateDto): Promise<ObjectId> {
    const blogId = await blogCollection.insertOne(inputBlog);
    return blogId.insertedId;
  },

  async updateBlog(dto: blogInputDto, id: string): Promise<void | null> {
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
  },

  async deleteBlog(id: string): Promise<boolean> {
    const result = await blogCollection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  },
};
