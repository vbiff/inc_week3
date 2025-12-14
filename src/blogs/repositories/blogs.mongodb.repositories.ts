import { Blog } from "../types/blog";
import { blogInputDto } from "../dto/blog.input_dto";
import { client } from "../../db/mongo.db";
import { ObjectId } from "mongodb";

export const blogCollection = client.db("blogger").collection<Blog>("blogs");

export const blogsRepository = {
  async findAll(): Promise<Blog[]> {
    return client.db("blogger").collection<Blog>("blogs").find({}).toArray();
  },

  async findById(id: string): Promise<Blog | null> {
    const blog = await blogCollection.findOne({ _id: new ObjectId(id) }, {projection: {_id: 0} });
    if (!blog) {
      return null;
    }
    return blog;
  },

  async createBlog(inputBlog: blogInputDto): Promise<Blog> {
    const newBlog = {
      ...inputBlog,
      id: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      isMembership: false,
    };
    const noMongoIdBlog = {...newBlog}
    await blogCollection.insertOne(newBlog);

    return noMongoIdBlog;
  },

  async updateBlog(dto: blogInputDto, id: string): Promise<void> {
    await blogCollection.updateOne(
      { _id: new ObjectId(id) },

      {
        $set: {
          name: dto.name,
          description: dto.description,
          websiteUrl: dto.websiteUrl,
        },
      },
    );
    return;
  },

  async deleteBlog(id: string): Promise<void> {
    await blogCollection.deleteOne({ _id: new ObjectId(id) });
    return;
  },
};
