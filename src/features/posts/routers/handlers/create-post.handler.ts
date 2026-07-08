import { HttpStatuses } from "../../../../core/types/http-statuses";
import { Request, Response } from "express";
import { BlogView } from "../../../blogs/application/queries/dto/output-dto/blog-view";
import { PostsService } from "../../application/command-services/posts-services";
import { BlogsQueryRepository } from "../../../blogs/repositories/blogs.query-mongodb.repositories";
import { PostsQueryRepository } from "../../repositories/posts.mongodb-query-repository";
import { inject, injectable } from "inversify";

@injectable()
export class CreatePostHandler {
  constructor(
    @inject(PostsService) private postsService: PostsService,
    @inject(BlogsQueryRepository) private blogsQueryRepository: BlogsQueryRepository,
    @inject(PostsQueryRepository) private postsQueryRepository: PostsQueryRepository,
  ) {}

  createPostHandler = async (req: Request, res: Response) => {
    const blog: BlogView | null = await this.blogsQueryRepository.findByObjectId(
      req.body.blogId,
    );
    if (!blog) {
      res.sendStatus(HttpStatuses.NOT_FOUND_404);
    }

    const newPostId = await this.postsService.createPost(req.body, blog!.name);

    if (!newPostId) {
      return;
    }

    const mappedPost = await this.postsQueryRepository.findByObjectId(
      newPostId.toString(),
    );

    res.status(HttpStatuses.CREATED_201).send(mappedPost);
  };
}
