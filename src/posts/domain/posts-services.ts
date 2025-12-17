import { Post } from "../types/posts";
import { PostInputDTO } from "../dto/post-input-dto";
import { postsRepository } from "../repositories/posts.mongodb.repositories";
import { blogsRepository } from "../../blogs/repositories/blogs.mongodb.repositories";
import { PostInputWithBlogIdDTO } from "../dto/post-input-with_blog-id-dto";
import { PaginationAndSortingReq } from "../../core/types/pagination-and-sorting-req";

export const postsServices = {
  async findAll(
    queryInput: PaginationAndSortingReq,
  ): Promise<{ posts: Post[]; totalCount: number }> {
    return postsRepository.findAll(queryInput);
  },

  async findById(id: string): Promise<Post | null> {
    return postsRepository.findById(id);
  },

  async findAllPostsByBlogId(
    blogId: string,
    queryInput: PaginationAndSortingReq,
  ): Promise<{ posts: Post[] | null; totalCount: number }> {
    return await postsRepository.findAllPostsByBlogId(blogId, queryInput);
  },

  async createPost(inputPost: PostInputDTO): Promise<Post | null> {
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

    const postId = await postsRepository.createPost(newPost);
    return postsRepository.findByObjectId(postId);
  },

  async createPostForSpecificBlogId(
    inputPost: PostInputWithBlogIdDTO,
    blogId: string,
  ): Promise<Post | null> {
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

    const postId = await postsRepository.createPost(newPost);
    return await postsRepository.findByObjectId(postId);
  },

  async updatePost(dto: PostInputDTO, id: string): Promise<void | null> {
    return await postsRepository.updatePost(dto, id);
  },

  async deletePost(id: string): Promise<boolean> {
    return await postsRepository.deletePost(id);
  },
};
