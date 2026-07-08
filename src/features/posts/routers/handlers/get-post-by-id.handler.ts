import { HttpStatuses } from "../../../../core/types/http-statuses";
import { Request, Response } from "express";
import { PostView } from "../../application/queries/dto/output-dto/posts-view";
import { PostsQueryRepository } from "../../repositories/posts.mongodb-query-repository";
import { inject, injectable } from "inversify";

@injectable()
export class GetPostByIdHandler {
  constructor(
    @inject(PostsQueryRepository) private postsQueryRepository: PostsQueryRepository,
  ) {}

  getPostById = async (req: Request, res: Response) => {
    const post: PostView | null = await this.postsQueryRepository.findByObjectId(
      req.params.id,
    );

    if (!post) {
      res.sendStatus(HttpStatuses.NOT_FOUND_404);
      return;
    }

    res.status(HttpStatuses.OK_200).send(post);
  };
}
