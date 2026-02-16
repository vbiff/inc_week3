import { commentsCollection } from "../../../db/mongo.db";
import { CommentCreateDto } from "../application/command-service/dto/comment-create-dto";
import { Result } from "../../../core/result/resultType";
import { ObjectId } from "mongodb";
import { ResultStatus } from "../../../core/result/resultCode";

export class CommentsRepository {
  async createComment(newComment: CommentCreateDto): Promise<string> {
    const commentId = await commentsCollection.insertOne(newComment);
    return commentId.insertedId.toString();
  }

  async deleteCommentById(commentId: string, userId: string): Promise<Result> {
    const comment = await commentsCollection.findOne({
      _id: new ObjectId(commentId),
    });
    if (!comment) {
      return {
        status: ResultStatus.NotFound,
        errorMessage: "Comment not found",
        extensions: [],
        data: null,
      };
    }
    if (userId !== comment!.commentatorInfo.userId) {
      return {
        status: ResultStatus.Forbidden,
        errorMessage: "The comment is not belongs to current user",
        extensions: [],
        data: null,
      };
    }
    await commentsCollection.deleteOne({
      _id: new ObjectId(commentId),
    });
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
    const comment = await commentsCollection.findOne({
      _id: new ObjectId(commentId),
    });
    if (!comment) {
      return {
        status: ResultStatus.NotFound,
        errorMessage: "Comment not found",
        extensions: [],
        data: null,
      };
    }
    if (userId !== comment!.commentatorInfo.userId) {
      return {
        status: ResultStatus.Forbidden,
        errorMessage: "The comment is not belongs to current user",
        extensions: [],
        data: null,
      };
    }
    await commentsCollection.updateOne(
      {
        _id: new ObjectId(commentId),
      },
      { $set: { content: content } },
    );
    return {
      status: ResultStatus.Success,
      errorMessage: "",
      extensions: [],
      data: null,
    };
  }
}
