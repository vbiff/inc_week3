import { blogCreateDto } from "../dto/input-dto/blog-create-dto";
import { Filter, ObjectId, WithId } from "mongodb";
import { blogCollection } from "./blogs.mongodb.repositories";
import { PaginationAndSortingReq } from "../../core/types/pagination-and-sorting-req";
import { BlogView } from "../dto/output-dto/blog-view";
import { mapBlogs } from "../mappers/mapper-blogs-output";
import { mapperOutput } from "../../core/mappers/mapper-output";
import { OutputDtoBlogs } from "../dto/output-dto/output-dto-blogs";

export const blogsQueryRepository = {
  async findAll(query: PaginationAndSortingReq): Promise<OutputDtoBlogs> {
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

    const mappedItems: BlogView[] = items.map(
      (item: WithId<blogCreateDto>): BlogView => mapBlogs(item),
    );

    return mapperOutput(mappedItems, {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
    });
  },

  async findByObjectId(id: string): Promise<BlogView | null> {
    const blog = await blogCollection.findOne({ _id: new ObjectId(id) });
    if (!blog) return null;
    return mapBlogs(blog);
  },
};
