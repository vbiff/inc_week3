import { HydratedDocument, model, Model, Schema } from "mongoose";

export enum LikeStatuses {
  Like = "like",
  Dislike = "dislike",
  None = "none",
}

import { CommentLikeCreateDTO } from "../application/command-service/dto/comment-like-create-dto";

export class CommentLikeEntity {
  private constructor(
    public status: LikeStatuses,
    public userId: string,
    public commentId: string,
    public createdAt: string,
    public lastModifiedAt: string,
  ) {}

  static createCommentLike(dto: CommentLikeCreateDTO) {
    return new CommentLikeEntity(
      dto.status,
      dto.userId,
      dto.commentId,
      dto.createdAt,
      dto.lastModifiedAt,
    );
  }
}

export const CommentLikeEntitySchema = new Schema<CommentLikeEntity>({
  status: { type: String, required: true },
  userId: { type: String, required: true },
  commentId: { type: String, required: true },
  createdAt: { type: String, required: true },
  lastModifiedAt: { type: String, required: true },
});

CommentLikeEntitySchema.loadClass(CommentLikeEntity);

export type CommentLikeDocument = HydratedDocument<CommentLikeEntity>;

export const CommentLikeModel: Model<CommentLikeEntity> =
  model<CommentLikeEntity>("CommentLike", CommentLikeEntitySchema);
