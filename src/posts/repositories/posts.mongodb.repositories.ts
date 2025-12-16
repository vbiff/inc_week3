import { Post } from "../types/posts";
import { PostInputDTO } from "../dto/post-input-dto";
import { client } from "../../db/mongo.db";
import { blogCollection } from "../../blogs/repositories/blogs.mongodb.repositories";

const postsCollection = client.db("blogger").collection<Post>("posts");

export const postsRepository = {
  async findAll(): Promise<Post[]> {
    return postsCollection.find({}, { projection: { _id: 0 } }).toArray();
  },

  async findById(id: string): Promise<Post | null> {
    return await postsCollection.findOne(
      { id: id },
      { projection: { _id: 0 } },
    );
  },

  async findAllPostsByBlogId(blogId: string): Promise<Post[] | null> {
    return await postsCollection
      .find({ blogId: blogId }, { projection: { _id: 0 } })
      .toArray();
  },

  async createPost(inputPost: Post): Promise<Post> {
    const noMongoId = { ...inputPost };
    await postsCollection.insertOne(inputPost);
    return noMongoId;
  },

  async updatePost(dto: PostInputDTO, id: string): Promise<void | null> {
    const blog = await blogCollection.findOne({ id: dto.blogId });
    if (!blog) {
      throw new Error("blog not found");
    }
    const result = await postsCollection.updateOne(
      {
        id: id,
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
    const result = await postsCollection.deleteOne({ id: id });
    return result.deletedCount === 1;
  },
};
