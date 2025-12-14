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
    return await postsCollection.findOne({ id: id }, { projection: { _id: 0 } });
  },

  async createPost(inputPost: PostInputDTO): Promise<Post> {
    const blog = await blogCollection.findOne({ id: inputPost.blogId });
    if (!blog) {
      throw new Error("blog not found");
    }
    const newPost = {
      ...inputPost,
      id: new Date().toISOString(),
      blogName: blog.name,
      createdAt: new Date().toISOString(),
    };
    const noMongoId = {...newPost}
    await postsCollection.insertOne(newPost);
    return noMongoId;
  },

  async updatePost(dto: PostInputDTO, id: string): Promise<void> {
    const post = await this.findById(id);
    if (!post) {
      throw new Error("blog does not exist");
    }
    const blog = await blogCollection.findOne({ id: dto.blogId });
    if (!blog) {
      throw new Error("blog not found");
    }
    await postsCollection.updateOne(
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

    return;
  },

  async deletePost(id: string): Promise<void> {
    await postsCollection.deleteOne({ id: id });
    return;
  },
};
