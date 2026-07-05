import { PostInputDTO } from "../queries/dto/input-dto/post-input-dto";
import { PostsRepository } from "../../repositories/posts.mongodb.repositories";
import { PostInputWithBlogIdDTO } from "../queries/dto/input-dto/post-input-with_blog-id-dto";
import { ObjectId } from "mongodb";
import { inject, injectable } from "inversify";

@injectable()
export class PostsService {
  constructor(
    @inject(PostsRepository) private postsRepository: PostsRepository,
  ) {}

  async createPost(
    inputPost: PostInputDTO,
    blogName: string,
  ): Promise<ObjectId | null> {
    const newPost = {
      ...inputPost,
      blogName: blogName,
      createdAt: new Date().toISOString(),
    };

    return await this.postsRepository.createPost(newPost);
  }

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

    return await this.postsRepository.createPost(newPost);
  }

  async updatePost(dto: PostInputDTO, id: string): Promise<void | null> {
    return await this.postsRepository.updatePost(dto, id);
  }

  async deletePost(id: string): Promise<boolean> {
    return await this.postsRepository.deletePost(id);
  }
}
