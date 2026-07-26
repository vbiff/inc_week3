import { Request, Response } from "express";
import { PostView } from "../../application/queries/dto/output-dto/posts-view";
import { HttpStatuses } from "../../../../core/types/http-statuses";
import { PostsQueryRepository } from "../../repositories/posts.mongodb-query-repository";
import { CommentService } from "../../../comments/application/command-service/comment-service";
import { CommentsQueryRepository } from "../../../comments/repositories/commentsQueryRepository";
import { UserQueryRepository } from "../../../users/repositories/user-query-repository-mongodb";
import { inject, injectable } from "inversify";

@injectable()
export class CreateCommentHandler {
  constructor(
    @inject(PostsQueryRepository)
    private postsQueryRepository: PostsQueryRepository,
    @inject(CommentService) private commentService: CommentService,
    @inject(CommentsQueryRepository)
    private commentsQueryRepository: CommentsQueryRepository,
    @inject(UserQueryRepository)
    private userQueryRepository: UserQueryRepository,
  ) {}

  createCommentHandler = async (req: Request, res: Response) => {
    // 1 check if post exists with postId by query repo
    const post: PostView | null =
      await this.postsQueryRepository.findByObjectId(req.params.postId);

    if (!post) {
      res.sendStatus(HttpStatuses.NOT_FOUND_404);
      return;
    }
    //get user info
    const userInfo = await this.userQueryRepository.findUserByIdForMe(
      req.user!.id,
    );

    // 2 create new comment
    const commentId: string = await this.commentService.createComment(
      req.body,
      post.id,
      userInfo!,
    );

    // 3 get new comment from query repo
    const newComment = await this.commentsQueryRepository.getCommentById(
      commentId,
      req.user!.id,
    );

    if (!newComment) {
      res.sendStatus(HttpStatuses.NOT_FOUND_404);
      return;
    }
    return res.status(HttpStatuses.CREATED_201).send(newComment);
  };
}
