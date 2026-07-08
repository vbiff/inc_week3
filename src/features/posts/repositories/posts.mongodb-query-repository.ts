import { QueryFilter } from "mongoose";
import { PaginationAndSortingReq } from "../../../core/types/pagination-and-sorting-req";
import { PostView } from "../application/queries/dto/output-dto/posts-view";
import { mapperPost } from "../mappers/mapper-post";
import { mapperOutput } from "../../../core/mappers/mapper-output";
import { ResultPostOutputDto } from "../application/queries/dto/output-dto/result-post-output-dto";
import { getSkipNumber } from "../../../core/utils/skip";
import { injectable } from "inversify";
import { PostEntity, PostModel } from "../domain/post_entity";

@injectable()
export class PostsQueryRepository {
  async findAll(query: PaginationAndSortingReq): Promise<ResultPostOutputDto> {
    const { pageNumber, pageSize, sortBy, sortDirection } = query;
    const skip: number = getSkipNumber(pageNumber, pageSize);
    const posts = await PostModel.find({})
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize);

    const totalCount = await PostModel.countDocuments({});

    const mappedPosts: PostView[] = posts.map((post) => mapperPost(post));

    return mapperOutput(mappedPosts, {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
    });
  }

  async findByObjectId(id: string): Promise<PostView | null> {
    const post = await PostModel.findById(id);
    if (!post) {
      return null;
    }
    return mapperPost(post);
  }

  async findAllPostsByBlogId(
    blogId: string,
    queryInput: PaginationAndSortingReq,
  ): Promise<ResultPostOutputDto> {
    const { pageNumber, pageSize, sortBy, sortDirection } = queryInput;
    const skip: number = getSkipNumber(pageNumber, pageSize);

    const filter: QueryFilter<PostEntity> = { blogId: blogId };

    const posts = await PostModel.find(filter)
      .skip(skip)
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection });

    const totalCount = await PostModel.countDocuments(filter);

    const mappedPosts: PostView[] = posts.map((post) => mapperPost(post));

    return mapperOutput(mappedPosts, {
      pagesCount: Math.ceil(totalCount / queryInput.pageSize),
      page: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount: totalCount,
    });
  }
}
