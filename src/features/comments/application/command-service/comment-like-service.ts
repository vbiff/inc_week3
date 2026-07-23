import { inject, injectable } from "inversify";
import { CommentsRepository } from "../../repositories/commentsRepository";
import { CommentsLikesRepository } from "../../repositories/commentsLikesRepository";
import { LikeStatuses } from "../../domain/comment_like_entity";
import { Result } from "../../../../core/result/resultType";
import { ResultStatus } from "../../../../core/result/resultCode";

@injectable()
export class CommentLikeService {
  constructor(
    @inject(CommentsRepository) private commentsRepository: CommentsRepository,
    @inject(CommentsLikesRepository)
    private commentsLikesRepository: CommentsLikesRepository,
  ) {}

  async setLike(
    commentId: string,
    likeStatus: LikeStatuses,
    userId: string,
  ): Promise<Result> {
    const newLike = {
      status: likeStatus,
      userId,
      commentId,
      createdAt: new Date().toISOString(),
      lastModifiedAt: new Date().toISOString(),
    };
    const setLike = await this.commentsLikesRepository.setLike(newLike);

    if (!setLike) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: "Something went wrong",
        extensions: [],
        data: null,
      };
    }
    return {
      status: ResultStatus.Success,
      errorMessage: "",
      extensions: [],
      data: null,
    };
  }
}
