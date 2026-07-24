import { CommentInputDto } from "../queries/dto/input-dto/comment-input-dto";
import { CommentsRepository } from "../../repositories/commentsRepository";
import { AuthMeDto } from "../../../auth/application/queries/dto/auth-output-dto/auth-me-dto";
import { Result } from "../../../../core/result/resultType";
import { inject, injectable } from "inversify";
import { LikeStatuses } from "../../domain/comment_like_entity";

@injectable()
export class CommentService {
  constructor(
    @inject(CommentsRepository) private commentsRepository: CommentsRepository,
  ) {}

  async createComment(
    inputDto: CommentInputDto,
    postId: string,
    userInfo: AuthMeDto,
  ): Promise<string> {
    const newComment = {
      ...inputDto,
      postId: postId,
      commentatorInfo: {
        userId: userInfo.userId,
        userLogin: userInfo.login,
      },
      createdAt: new Date().toISOString(),
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: LikeStatuses.None,
      },
    };

    return await this.commentsRepository.createComment(newComment);
  }

  async deleteComment(commentId: string, userId: string): Promise<Result> {
    return await this.commentsRepository.deleteCommentById(commentId, userId);
  }

  async updateComment(
    commentId: string,
    content: string,
    userId: string,
  ): Promise<Result> {
    return await this.commentsRepository.updateCommentById(commentId, userId, {
      content: content,
    });
  }
}
