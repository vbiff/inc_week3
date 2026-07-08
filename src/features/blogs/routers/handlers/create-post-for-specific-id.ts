import { HttpStatuses } from "../../../../core/types/http-statuses";
import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { PostsService } from "../../../posts/application/command-services/posts-services";
import { BlogsQueryRepository } from "../../repositories/blogs.query-mongodb.repositories";
import { PostsQueryRepository } from "../../../posts/repositories/posts.mongodb-query-repository";
import { inject, injectable } from "inversify";

@injectable()
export class CreatePostForSpecificId {
  constructor(
    @inject(PostsService) private postsService: PostsService,
    @inject(BlogsQueryRepository)
    private blogsQueryRepository: BlogsQueryRepository,
    @inject(PostsQueryRepository)
    private postsQueryRepository: PostsQueryRepository,
  ) {}
  createPostForSpecificBlogIdHandler = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const blog = await this.blogsQueryRepository.findByObjectId(
      req.params.blogId,
    );

    if (!blog) {
      res.sendStatus(HttpStatuses.NOT_FOUND_404);
      return;
    }

    const newPostId: ObjectId | null =
      await this.postsService.createPostForSpecificBlogId(
        req.body,
        req.params.blogId,
        blog.name,
      );

    const newPost = await this.postsQueryRepository.findByObjectId(
      newPostId!.toString(),
    );

    if (!newPost) {
      res.sendStatus(HttpStatuses.NOT_FOUND_404);
      return;
    }

    res.status(HttpStatuses.CREATED_201).send(newPost);
  };
}
