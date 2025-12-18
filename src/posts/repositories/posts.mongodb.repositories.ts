import { PostInputDTO } from "../dto/post-input-dto";
import { client } from "../../db/mongo.db";
import { blogCollection } from "../../blogs/repositories/blogs.mongodb.repositories";
import { Filter, ObjectId, WithId } from "mongodb";
import { PaginationAndSortingReq } from "../../core/types/pagination-and-sorting-req";
import { PostCreateDto } from "../dto/post-create-dto";

const postsCollection = client.db("blogger").collection<PostCreateDto>("posts");

export const postsRepository = {
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

  async createPost(inputPost: PostCreateDto): Promise<ObjectId> {
    const postId = await postsCollection.insertOne(inputPost);
    return postId.insertedId;
  },

  async updatePost(dto: PostInputDTO, id: string): Promise<void | null> {
    console.log(dto.blogId);
    const blog = await blogCollection.findOne({
      _id: new ObjectId(dto.blogId),
    });
    if (!blog) {
      throw new Error("blog not found");
    }
    const result = await postsCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          title: dto.title,
          shortDescription: dto.shortDescription,
          content: dto.content,
          blogId: dto.blogId,
          blogName: blog.name,
        },
      },
    );

    if (result.matchedCount > 0) {
      return;
    }
    return null;
  },

  async deletePost(id: string): Promise<boolean> {
    const result = await postsCollection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  },
};
