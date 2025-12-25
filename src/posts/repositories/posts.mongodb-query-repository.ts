import { PostCreateDto } from "../dto/post-create-dto";
import { Filter, ObjectId } from "mongodb";
import { PaginationAndSortingReq } from "../../core/types/pagination-and-sorting-req";
import { client } from "../../db/mongo.db";
import { Post } from "../types/posts";
import { mapperPost } from "../mappers/mapper-post";
import { mapperOutput } from "../../core/mappers/mapper-output";
import { PostOutputDto } from "../types/post -output-dto";
const postsCollection = client.db("blogger").collection<PostCreateDto>("posts");

export const postsQueryRepositories = {
  async findAll(query: PaginationAndSortingReq): Promise<PostOutputDto> {
    const { pageNumber, pageSize, sortBy, sortDirection } = query;
    const skip: number = (pageNumber - 1) * pageSize;
    const posts = await postsCollection
      .find({})
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const totalCount = await postsCollection.countDocuments({});

    const mappedPosts: Post[] = posts.map((post) => mapperPost(post));

    return mapperOutput(mappedPosts, {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
    });
  },

  async findByObjectId(id: string): Promise<Post | null> {
    const Post = await postsCollection.findOne({ _id: new ObjectId(id) });
    if (!Post) {
      return null;
    }
    return mapperPost(Post);
  },

  async findAllPostsByBlogId(
    blogId: string,
    queryInput: PaginationAndSortingReq,
  ): Promise<PostOutputDto> {
    const { pageNumber, pageSize, sortBy, sortDirection } = queryInput;
    const skip: number = (pageNumber - 1) * pageSize;

    const filter: Filter<PostCreateDto> = { blogId: blogId };

    const posts = await postsCollection
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const totalCount = await postsCollection.countDocuments(filter);

    const mappedPosts: Post[] = posts.map((post) => mapperPost(post));

    return mapperOutput(mappedPosts, {
      pagesCount: Math.ceil(totalCount / queryInput.pageSize),
      page: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount: totalCount,
    });
  },
};
