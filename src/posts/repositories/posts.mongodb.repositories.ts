import { PostInputDTO } from "../dto/input-dto/post-input-dto";
import { blogCollection, postsCollection } from "../../db/mongo.db";

import { ObjectId } from "mongodb";

import { PostCreateDto } from "../dto/input-dto/post-create-dto";

export const postsRepository = {
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
