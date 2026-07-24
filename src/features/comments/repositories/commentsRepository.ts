import { CommentCreateDto } from "../application/command-service/dto/comment-create-dto";
import {
  CommentDocument,
  CommentEntity,
  CommentModel,
} from "../domain/comment_entity";
import { Result } from "../../../core/result/resultType";
import { ResultStatus } from "../../../core/result/resultCode";
import { injectable } from "inversify";
import { LikeStatuses } from "../domain/comment_like_entity";

@injectable()
export class CommentsRepository {
  async createComment(newComment: CommentCreateDto): Promise<string> {
    const comment = CommentEntity.createComment(newComment);
    const created = await CommentModel.create(comment);
    return created._id.toString();
  }

  async deleteCommentById(commentId: string, userId: string): Promise<Result> {
    const comment = await CommentModel.findById(commentId);
    if (!comment) {
      return {
        status: ResultStatus.NotFound,
        errorMessage: "Comment not found",
        extensions: [],
        data: null,
      };
    }
    if (userId !== comment.commentatorInfo.userId) {
      return {
        status: ResultStatus.Forbidden,
        errorMessage: "The comment is not belongs to current user",
        extensions: [],
        data: null,
      };
    }
    await CommentModel.deleteOne({ _id: comment._id });
    return {
      status: ResultStatus.Success,
      errorMessage: "",
      extensions: [],
      data: null,
    };
  }

  async findCommentById(commentId: string): Promise<CommentDocument | null> {
    return CommentModel.findById(commentId);
  }

  async updateCommentById(
    commentId: string,
    userId: string,
    fields: {
      content?: string;
      lcount?: number;
      dcount?: number;
      myStatus?: LikeStatuses;
    },
  ): Promise<Result> {
    const comment = await CommentModel.findById(commentId);

    if (!comment) {
      return {
        status: ResultStatus.NotFound,
        errorMessage: "Comment not found",
        extensions: [],
        data: null,
      };
    }
    if (userId !== comment.commentatorInfo.userId) {
      return {
        status: ResultStatus.Forbidden,
        errorMessage: "The comment is not belongs to current user",
        extensions: [],
        data: null,
      };
    }

    if (fields.content !== undefined) comment.content = fields.content;
    if (fields.lcount === 1 || fields.lcount === -1) {
      comment.likesInfo.likesCount += fields.lcount;
    }
    if (fields.dcount === 1 || fields.dcount === -1)
      comment.likesInfo.dislikesCount += fields.dcount;
    if (fields.myStatus) comment.likesInfo.myStatus = fields.myStatus;

    await comment.save();

    return {
      status: ResultStatus.Success,
      errorMessage: "",
      extensions: [],
      data: null,
    };
  }
}
