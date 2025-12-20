import { PostInputDTO } from "../dto/post-input-dto";
import { postsRepository } from "../repositories/posts.mongodb.repositories";
import { PostInputWithBlogIdDTO } from "../dto/post-input-with_blog-id-dto";
import { PostCreateDto } from "../dto/post-create-dto";
import { WithId } from "mongodb";
import { postsQueryRepositories } from "../repositories/posts.mongodb-query-repository";
import { blogsQueryRepository } from "../../blogs/repositories/blogs.query-mongodb.repositories";

export const postsServices = {
  async createPost(
    inputPost: PostInputDTO,
  ): Promise<WithId<PostCreateDto> | null> {
    console.log(inputPost);
    const blog = await blogsQueryRepository.findByObjectId(inputPost.blogId);
    if (!blog) {
      throw new Error("Blog not found");
    }

    const newPost = {
      ...inputPost,
      blogName: blog.name,
      createdAt: new Date().toISOString(),
    };

    const postId = await postsRepository.createPost(newPost);
    return postsQueryRepositories.findByObjectId(postId.toString());
  },

  async createPostForSpecificBlogId(
    inputPost: PostInputWithBlogIdDTO,
    blogId: string,
  ): Promise<WithId<PostCreateDto> | null> {
    const blog = await blogsQueryRepository.findByObjectId(blogId);
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
    return await postsQueryRepositories.findByObjectId(postId.toString());
  },

  async updatePost(dto: PostInputDTO, id: string): Promise<void | null> {
    return await postsRepository.updatePost(dto, id);
  },

  async deletePost(id: string): Promise<boolean> {
    return await postsRepository.deletePost(id);
  },
};
