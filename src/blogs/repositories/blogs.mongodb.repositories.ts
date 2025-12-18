import { blogInputDto } from "../dto/blog.input_dto";
import { client } from "../../db/mongo.db";
import { PaginationAndSortingReq } from "../../core/types/pagination-and-sorting-req";
import { Filter, ObjectId, WithId } from "mongodb";
import { blogCreateDto } from "../dto/blog-create-dto";

export const blogCollection = client
  .db("blogger")
  .collection<blogCreateDto>("blogs");

export const blogsRepository = {
  async findAll(
    query: PaginationAndSortingReq,
  ): Promise<{ items: WithId<blogCreateDto>[]; totalCount: number }> {
    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } =
      query;
    const skip: number = (pageNumber - 1) * pageSize;
    const filter: Filter<blogCreateDto> = {};

    if (searchNameTerm) {
      filter.$or = [];
      filter.$or.push({ name: { $regex: searchNameTerm, $options: "i" } });
    }

    const items = await blogCollection
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const totalCount = await blogCollection.countDocuments(filter);

    return { items, totalCount };
  },

  async findByObjectId(id: string): Promise<WithId<blogCreateDto> | null> {
    return await blogCollection.findOne({ _id: new ObjectId(id) });
  },

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
