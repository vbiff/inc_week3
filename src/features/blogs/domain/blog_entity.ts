import { HydratedDocument, Model, model, Schema } from "mongoose";
import { BlogInputDto } from "../application/queries/dto/input-dto/blog_input_dto";

export class BlogEntity {
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;

  // Creation defaults live here, not in the service — the service just
  // forwards the input DTO to the repository.
  constructor(dto: BlogInputDto) {
    this.name = dto.name;
    this.description = dto.description;
    this.websiteUrl = dto.websiteUrl;
    this.createdAt = new Date().toISOString();
    this.isMembership = false;
  }

  updateBlog(dto: BlogInputDto): void {
    this.name = dto.name;
    this.description = dto.description;
    this.websiteUrl = dto.websiteUrl;
  }
}

export const BlogSchema = new Schema<BlogEntity>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  websiteUrl: { type: String, required: true },
  createdAt: { type: String, required: true },
  isMembership: { type: Boolean, required: true },
});

// loadClass binds BlogEntity's prototype methods (updateBlog) onto every
// hydrated document, so `document.updateBlog(dto)` becomes callable
// directly. Statics (createBlog) stay a plain class method for now —
// exposing them as Model statics needs an extra custom Model<> interface,
// which we intentionally skip on this first pass to keep the pattern simple.
BlogSchema.loadClass(BlogEntity);

export type BlogDocument = HydratedDocument<BlogEntity>;

export const BlogModel: Model<BlogEntity> = model<BlogEntity>(
  "Blog",
  BlogSchema,
);
