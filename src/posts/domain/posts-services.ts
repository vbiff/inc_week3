import { PostInputDTO } from "../dto/input-dto/post-input-dto";
import { postsRepository } from "../repositories/posts.mongodb.repositories";
import { PostInputWithBlogIdDTO } from "../dto/input-dto/post-input-with_blog-id-dto";
import { ObjectId } from "mongodb";

export const postsServices = {
  async createPost(
    inputPost: PostInputDTO,
    blogName: string,
  ): Promise<ObjectId | null> {
    const newPost = {
      ...inputPost,
      blogName: blogName,
      createdAt: new Date().toISOString(),
    };

    return await postsRepository.createPost(newPost);
  },

  async createPostForSpecificBlogId(
    inputPost: PostInputWithBlogIdDTO,
    blogId: string,
    blogName: string,
  ): Promise<ObjectId | null> {
    const newPost = {
      ...inputPost,
      blogName: blogName,
      createdAt: new Date().toISOString(),
      blogId: blogId,
    };

    return await postsRepository.createPost(newPost);
  },

  async updatePost(dto: PostInputDTO, id: string): Promise<void | null> {
    return await postsRepository.updatePost(dto, id);
  },

  async deletePost(id: string): Promise<boolean> {
    return await postsRepository.deletePost(id);
  },
};
