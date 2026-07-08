import { CommentCreateDto } from "../application/command-service/dto/comment-create-dto";
import { CommentEntity, CommentModel } from "../domain/comment_entity";
import { Result } from "../../../core/result/resultType";
import { ResultStatus } from "../../../core/result/resultCode";
import { injectable } from "inversify";

@injectable()
export class CommentsRepository {
  async createComment(newComment: CommentCreateDto): Promise<string> {
    const comment = new CommentEntity(newComment);
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

  async updateCommentById(
    commentId: string,
    content: string,
    userId: string,
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
    comment.updateContent(content);
    await comment.save();
    return {
      status: ResultStatus.Success,
      errorMessage: "",
      extensions: [],
      data: null,
    };
  }
}
