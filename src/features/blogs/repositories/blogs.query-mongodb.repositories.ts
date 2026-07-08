import { ObjectId } from "mongodb";
import { PaginationAndSortingReq } from "../../../core/types/pagination-and-sorting-req";
import { BlogView } from "../application/queries/dto/output-dto/blog-view";
import { mapBlogs } from "../mappers/mapper-blogs-output";
import { mapperOutput } from "../../../core/mappers/mapper-output";
import { OutputDtoBlogs } from "../application/queries/dto/output-dto/output-dto-blogs";
import { injectable } from "inversify";
import { BlogEntity, BlogModel } from "../domain/blog_entity";
import { QueryFilter } from "mongoose";

@injectable()
export class BlogsQueryRepository {
  async findAll(query: PaginationAndSortingReq): Promise<OutputDtoBlogs> {
    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } =
      query;
    const skip: number = (pageNumber - 1) * pageSize;
    const filter: QueryFilter<BlogEntity> = {};

    if (searchNameTerm) {
      filter.name = { $regex: searchNameTerm, $options: "i" };
    }

    const items = await BlogModel.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize);

    const totalCount = await BlogModel.countDocuments(filter);

    const mappedItems: BlogView[] = items.map(
      (item): BlogView => mapBlogs(item),
    );

    return mapperOutput(mappedItems, {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
    });
  }

  async findByObjectId(id: string): Promise<BlogView | null> {
    const blog = await BlogModel.findOne({ _id: new ObjectId(id) });
    if (!blog) return null;
    return mapBlogs(blog);
  }
}
