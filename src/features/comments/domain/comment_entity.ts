import { HydratedDocument, Model, model, Schema } from "mongoose";
import { CommentCreateDto } from "../application/command-service/dto/comment-create-dto";

export class CommentEntity {
  content: string;
  postId: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: string;

  constructor(dto: CommentCreateDto) {
    this.content = dto.content;
    this.postId = dto.postId;
    this.commentatorInfo = dto.commentatorInfo;
    this.createdAt = dto.createdAt;
  }

  updateContent(content: string): void {
    this.content = content;
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
});

CommentSchema.loadClass(CommentEntity);

export type CommentDocument = HydratedDocument<CommentEntity>;

export const CommentModel: Model<CommentEntity> = model<CommentEntity>(
  "Comment",
  CommentSchema,
);
