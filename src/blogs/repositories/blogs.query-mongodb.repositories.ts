import { blogCreateDto } from "../dto/blog-create-dto";
import { Filter, ObjectId, WithId } from "mongodb";
import { blogCollection } from "./blogs.mongodb.repositories";
import { PaginationAndSortingReq } from "../../core/types/pagination-and-sorting-req";

export const blogsQueryRepository = {
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
};
