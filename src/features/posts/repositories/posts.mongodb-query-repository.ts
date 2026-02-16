import { PostCreateDto } from "../application/command-services/dto/post-create-dto";
import { Filter, ObjectId } from "mongodb";
import { PaginationAndSortingReq } from "../../../core/types/pagination-and-sorting-req";
import { postsCollection } from "../../../db/mongo.db";
import { PostView } from "../application/queries/dto/output-dto/posts-view";
import { mapperPost } from "../mappers/mapper-post";
import { mapperOutput } from "../../../core/mappers/mapper-output";
import { ResultPostOutputDto } from "../application/queries/dto/output-dto/result-post-output-dto";
import { getSkipNumber } from "../../../core/utils/skip";

export class PostsQueryRepository {
  async findAll(query: PaginationAndSortingReq): Promise<ResultPostOutputDto> {
    const { pageNumber, pageSize, sortBy, sortDirection } = query;
    const skip: number = getSkipNumber(pageNumber, pageSize);
    const posts = await postsCollection
      .find({})
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const totalCount = await postsCollection.countDocuments({});

    const mappedPosts: PostView[] = posts.map((post) => mapperPost(post));

    return mapperOutput(mappedPosts, {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
    });
  }

  async findByObjectId(id: string): Promise<PostView | null> {
    const Post = await postsCollection.findOne({ _id: new ObjectId(id) });
    if (!Post) {
      return null;
    }
    return mapperPost(Post);
  }

  async findAllPostsByBlogId(
    blogId: string,
    queryInput: PaginationAndSortingReq,
  ): Promise<ResultPostOutputDto> {
    const { pageNumber, pageSize, sortBy, sortDirection } = queryInput;
    const skip: number = getSkipNumber(pageNumber, pageSize);

    const filter: Filter<PostCreateDto> = { blogId: blogId };

    const posts = await postsCollection
      .find(filter)
      .skip(skip)
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection })
      .toArray();

    const totalCount = await postsCollection.countDocuments(filter);

    const mappedPosts: PostView[] = posts.map((post) => mapperPost(post));

    return mapperOutput(mappedPosts, {
      pagesCount: Math.ceil(totalCount / queryInput.pageSize),
      page: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount: totalCount,
    });
  }
}
