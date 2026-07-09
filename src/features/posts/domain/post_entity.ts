import { HydratedDocument, Model, model, Schema } from "mongoose";
import { PostCreateDto } from "../application/command-services/dto/post-create-dto";
import { PostInputDTO } from "../application/queries/dto/input-dto/post-input-dto";

export class PostEntity {
  private constructor(
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: string,
    public blogName: string,
    public createdAt: string,
  ) {}

  static createPost(dto: PostCreateDto): PostEntity {
    return new PostEntity(
      dto.title,
      dto.shortDescription,
      dto.content,
      dto.blogId,
      dto.blogName,
      dto.createdAt,
    );
  }

  updatePost(dto: PostInputDTO, blogName: string): void {
    this.title = dto.title;
    this.shortDescription = dto.shortDescription;
    this.content = dto.content;
    this.blogId = dto.blogId;
    this.blogName = blogName;
  }
}

export const PostSchema = new Schema<PostEntity>({
  title: { type: String, required: true },
  shortDescription: { type: String, required: true },
  content: { type: String, required: true },
  blogId: { type: String, required: true },
  blogName: { type: String, required: true },
  createdAt: { type: String, required: true },
});

PostSchema.loadClass(PostEntity);

export type PostDocument = HydratedDocument<PostEntity>;

export const PostModel: Model<PostEntity> = model<PostEntity>(
  "Post",
  PostSchema,
);
