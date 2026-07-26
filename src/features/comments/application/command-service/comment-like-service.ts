import { inject, injectable } from "inversify";
import { CommentsRepository } from "../../repositories/commentsRepository";
import { CommentsLikesRepository } from "../../repositories/commentsLikesRepository";
import {
  CommentLikeEntity,
  LikeStatuses,
} from "../../domain/comment_like_entity";
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
    const comment = await this.commentsRepository.findCommentById(commentId);
    if (!comment) {
      return {
        status: ResultStatus.NotFound,
        errorMessage: "Something went wrong",
        extensions: [],
        data: null,
      };
    }
    const newLike = CommentLikeEntity.createCommentLike({
      status: likeStatus,
      userId,
      commentId,
      createdAt: new Date().toISOString(),
      lastModifiedAt: new Date().toISOString(),
    });
    const likeExisted = await this.commentsLikesRepository.findLikeById(
      userId,
      commentId,
    );
    if (!likeExisted) {
      const setLike = await this.commentsLikesRepository.createLike(newLike);
      // add lcounts .... d counts
      if (newLike.status === LikeStatuses.Like) {
        await this.commentsRepository.updateCommentById(
          newLike.commentId,
          userId,
          { lcount: 1, myStatus: newLike.status },
        );
      }
      if (newLike.status === LikeStatuses.Dislike) {
        await this.commentsRepository.updateCommentById(
          newLike.commentId,
          userId,
          { dcount: 1, myStatus: newLike.status },
        );
      }
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
    if (likeExisted.status === newLike.status) {
      return {
        status: ResultStatus.Success,
        errorMessage: "",
        extensions: [],
        data: null,
      };
    }
    if (likeExisted.status !== newLike.status) {
      if (newLike.status === LikeStatuses.Like) {
        // add lcount
        await this.commentsLikesRepository.updateLike(
          likeExisted._id.toString(),
          newLike,
        );
        if (likeExisted.status === LikeStatuses.Dislike) {
          await this.commentsRepository.updateCommentById(
            newLike.commentId,
            userId,
            { lcount: 1, dcount: -1, myStatus: newLike.status },
          );
          return {
            status: ResultStatus.Success,
            errorMessage: "",
            extensions: [],
            data: null,
          };
        }
        await this.commentsRepository.updateCommentById(
          newLike.commentId,
          userId,
          { lcount: 1, myStatus: newLike.status },
        );
        return {
          status: ResultStatus.Success,
          errorMessage: "",
          extensions: [],
          data: null,
        };
      }
      if (newLike.status === LikeStatuses.Dislike) {
        // add dcount
        await this.commentsLikesRepository.updateLike(
          likeExisted._id.toString(),
          newLike,
        );
        if (likeExisted.status === LikeStatuses.Like) {
          await this.commentsRepository.updateCommentById(
            newLike.commentId,
            userId,
            { lcount: -1, dcount: 1, myStatus: newLike.status },
          );
          return {
            status: ResultStatus.Success,
            errorMessage: "",
            extensions: [],
            data: null,
          };
        }
      }
      if (newLike.status === LikeStatuses.None) {
        await this.commentsLikesRepository.deleteLike(likeExisted.id);
        if (likeExisted.status === LikeStatuses.Dislike) {
          await this.commentsRepository.updateCommentById(
            newLike.commentId,
            userId,
            { dcount: -1, myStatus: newLike.status },
          );
        }
        if (likeExisted.status === LikeStatuses.Like) {
          await this.commentsRepository.updateCommentById(
            newLike.commentId,
            userId,
            { lcount: -1, myStatus: newLike.status },
          );
        }
        return {
          status: ResultStatus.Success,
          errorMessage: "",
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
    return {
      status: ResultStatus.BadRequest,
      errorMessage: "Something went wrong",
      extensions: [],
      data: null,
    };
  }
}
