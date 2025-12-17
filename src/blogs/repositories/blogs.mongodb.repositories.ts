import { Blog } from "../types/blog";
import { blogInputDto } from "../dto/blog.input_dto";
import { client } from "../../db/mongo.db";
import { PaginationAndSortingReq } from "../../core/types/pagination-and-sorting-req";

export const blogCollection = client.db("blogger").collection<Blog>("blogs");

export const blogsRepository = {
  async findAll(query: PaginationAndSortingReq): Promise<Blog[]> {
    const { pageNumber, pageSize, sortBy, sortDirection } = query;
    const skip: number = (pageNumber - 1) * pageSize;
    return blogCollection
      .find({}, { projection: { _id: 0 } })
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .toArray();
  },

  async findById(id: string): Promise<Blog | null> {
    return await blogCollection.findOne({ id: id }, { projection: { _id: 0 } });
  },

  async createBlog(inputBlog: blogInputDto): Promise<string> {
    const newBlog = {
      ...inputBlog,
      id: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      isMembership: false,
    };
    const blogId = await blogCollection.insertOne(newBlog);
    return blogId.insertedId.toString();
  },

  async updateBlog(dto: blogInputDto, id: string): Promise<void | null> {
    const res = await blogCollection.updateOne(
      { id: id },
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
    const result = await blogCollection.deleteOne({ id: id });
    return result.deletedCount === 1;
  },
};
