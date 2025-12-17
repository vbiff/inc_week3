import { Blog } from "../types/blog";
import { blogInputDto } from "../dto/blog.input_dto";
import { client } from "../../db/mongo.db";
import { PaginationAndSortingReq } from "../../core/types/pagination-and-sorting-req";
import { Filter, ObjectId } from "mongodb";

export const blogCollection = client.db("blogger").collection<Blog>("blogs");

export const blogsRepository = {
  async findAll(
    query: PaginationAndSortingReq,
  ): Promise<{ items: Blog[]; totalCount: number }> {
    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } =
      query;
    const skip: number = (pageNumber - 1) * pageSize;
    const filter: Filter<Blog> = {};

    if (searchNameTerm) {
      filter.$or = [];
      filter.$or.push({ name: { $regex: searchNameTerm, $options: "i" } });
    }

    const items = await blogCollection
      .find(filter, { projection: { _id: 0 } })
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const totalCount = await blogCollection.countDocuments({});

    return { items, totalCount };
  },

  async findByObjectId(id: string): Promise<Blog | null> {
    return await blogCollection.findOne(
      { _id: new ObjectId(id) },
      { projection: { _id: 0 } },
    );
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
