import { PostCreateDto } from "../dto/post-create-dto";
import { Filter, ObjectId, WithId } from "mongodb";
import { PaginationAndSortingReq } from "../../core/types/pagination-and-sorting-req";
import { client } from "../../db/mongo.db";
const postsCollection = client.db("blogger").collection<PostCreateDto>("posts");

export const postsQueryRepositories = {
  async findAll(
    query: PaginationAndSortingReq,
  ): Promise<{ posts: WithId<PostCreateDto>[]; totalCount: number }> {
    const { pageNumber, pageSize, sortBy, sortDirection } = query;
    const skip: number = (pageNumber - 1) * pageSize;
    const posts = await postsCollection
      .find({})
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const totalCount = await postsCollection.countDocuments({});

    return { posts, totalCount };
  },

  async findByObjectId(id: string): Promise<WithId<PostCreateDto> | null> {
    return await postsCollection.findOne({ _id: new ObjectId(id) });
  },

  async findAllPostsByBlogId(
    blogId: string,
    queryInput: PaginationAndSortingReq,
  ): Promise<{ posts: WithId<PostCreateDto>[] | null; totalCount: number }> {
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

    return { posts, totalCount };
  },
};
