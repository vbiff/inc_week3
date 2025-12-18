import { PostInputDTO } from "../dto/post-input-dto";
import { postsRepository } from "../repositories/posts.mongodb.repositories";
import { blogsRepository } from "../../blogs/repositories/blogs.mongodb.repositories";
import { PostInputWithBlogIdDTO } from "../dto/post-input-with_blog-id-dto";
import { PaginationAndSortingReq } from "../../core/types/pagination-and-sorting-req";
import { PostCreateDto } from "../dto/post-create-dto";
import { WithId } from "mongodb";

export const postsServices = {
  async findAll(
    queryInput: PaginationAndSortingReq,
  ): Promise<{ posts: WithId<PostCreateDto>[]; totalCount: number }> {
    return postsRepository.findAll(queryInput);
  },

  async findById(id: string): Promise<WithId<PostCreateDto> | null> {
    return await postsRepository.findByObjectId(id);
  },

  async findAllPostsByBlogId(
    blogId: string,
    queryInput: PaginationAndSortingReq,
  ): Promise<{ posts: WithId<PostCreateDto>[] | null; totalCount: number }> {
    return await postsRepository.findAllPostsByBlogId(blogId, queryInput);
  },

  async createPost(
    inputPost: PostInputDTO,
  ): Promise<WithId<PostCreateDto> | null> {
    const blog = await blogsRepository.findByObjectId(inputPost.blogId);
    if (!blog) {
      throw new Error("Blog not found");
    }
    const newPost = {
      ...inputPost,
      blogName: blog.name,
      createdAt: new Date().toISOString(),
    };

    const postId = await postsRepository.createPost(newPost);
    return postsRepository.findByObjectId(postId.toString());
  },

  async createPostForSpecificBlogId(
    inputPost: PostInputWithBlogIdDTO,
    blogId: string,
  ): Promise<WithId<PostCreateDto> | null> {
    const blog = await blogsRepository.findByObjectId(blogId);
    if (!blog) {
      throw new Error("Blog not found");
    }
    const newPost = {
      ...inputPost,
      blogName: blog.name,
      createdAt: new Date().toISOString(),
      blogId: blogId,
    };

    const postId = await postsRepository.createPost(newPost);
    return await postsRepository.findByObjectId(postId.toString());
  },

  async updatePost(dto: PostInputDTO, id: string): Promise<void | null> {
    return await postsRepository.updatePost(dto, id);
  },

  async deletePost(id: string): Promise<boolean> {
    return await postsRepository.deletePost(id);
  },
};
