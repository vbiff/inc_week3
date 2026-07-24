import { HydratedDocument, Model, model, Schema } from "mongoose";
import { CommentCreateDto } from "../application/command-service/dto/comment-create-dto";
import { LikeStatuses } from "./comment_like_entity";

export class CommentEntity {
  private constructor(
    public content: string,
    public postId: string,
    public commentatorInfo: {
      userId: string;
      userLogin: string;
    },
    public createdAt: string,
    public likesInfo: {
      likesCount: number;
      dislikesCount: number;
      myStatus: LikeStatuses;
    },
  ) {}

  static createComment(dto: CommentCreateDto): CommentEntity {
    return new CommentEntity(
      dto.content,
      dto.postId,
      dto.commentatorInfo,
      dto.createdAt,
      dto.likesInfo,
    );
  }
}

export const CommentSchema = new Schema<CommentEntity>({
  content: { type: String, required: true },
  postId: { type: String, required: true },
  commentatorInfo: {
    userId: { type: String, required: true },
    userLogin: { type: String, required: true },
  },
  createdAt: { type: String, required: true },
  likesInfo: {
    likesCount: { type: Number },
    dislikesCount: { type: Number },
    myStatus: { type: String },
  },
});

CommentSchema.loadClass(CommentEntity);

export type CommentDocument = HydratedDocument<CommentEntity>;

export const CommentModel: Model<CommentEntity> = model<CommentEntity>(
  "Comment",
  CommentSchema,
);
