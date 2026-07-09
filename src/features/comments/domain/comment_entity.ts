import { HydratedDocument, Model, model, Schema } from "mongoose";
import { CommentCreateDto } from "../application/command-service/dto/comment-create-dto";

export class CommentEntity {
  private constructor(
    public content: string,
    public postId: string,
    public commentatorInfo: {
      userId: string;
      userLogin: string;
    },
    public createdAt: string,
  ) {}

  static createComment(dto: CommentCreateDto): CommentEntity {
    return new CommentEntity(
      dto.content,
      dto.postId,
      dto.commentatorInfo,
      dto.createdAt,
    );
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
