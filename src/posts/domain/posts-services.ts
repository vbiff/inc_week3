import { Post } from "../types/posts";
import { PostInputDTO } from "../dto/post-input-dto";
import { postsRepository } from "../repositories/posts.mongodb.repositories";
import { blogsRepository } from "../../blogs/repositories/blogs.mongodb.repositories";
import { PostInputWithBlogIdDTO } from "../dto/post-input-with_blog-id-dto";

export const postsServices = {
  async findAll(): Promise<Post[]> {
    return postsRepository.findAll();
  },

  async findById(id: string): Promise<Post | null> {
    return await postsRepository.findById(id);
  },

  async findAllPostsByBlogId(blogId: string): Promise<Post[] | null> {
    return await postsRepository.findAllPostsByBlogId(blogId);
  },

  async createPost(inputPost: PostInputDTO): Promise<Post> {
    const blog = await blogsRepository.findById(inputPost.blogId);
    if (!blog) {
      throw new Error("Blog not found");
    }
    const newPost = {
      ...inputPost,
      id: new Date().toISOString(),
      blogName: blog.name,
      createdAt: new Date().toISOString(),
    };
    const noMongoId = { ...newPost };
    await postsRepository.createPost(newPost);
    return noMongoId;
  },

  async createPostForSpecificBlogId(
    inputPost: PostInputWithBlogIdDTO,
    blogId: string,
  ): Promise<Post> {
    const blog = await blogsRepository.findById(blogId);
    if (!blog) {
      throw new Error("Blog not found");
    }
    const newPost = {
      ...inputPost,
      id: new Date().toISOString(),
      blogName: blog.name,
      createdAt: new Date().toISOString(),
      blogId: blogId,
    };
    const noMongoId = { ...newPost };
    await postsRepository.createPost(newPost);
    return noMongoId;
  },

  async updatePost(dto: PostInputDTO, id: string): Promise<void | null> {
    return await postsRepository.updatePost(dto, id);
  },

  async deletePost(id: string): Promise<boolean> {
    return await postsRepository.deletePost(id);
  },
};
