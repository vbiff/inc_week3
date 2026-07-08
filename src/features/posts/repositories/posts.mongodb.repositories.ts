import { PostInputDTO } from "../application/queries/dto/input-dto/post-input-dto";
import { PostCreateDto } from "../application/command-services/dto/post-create-dto";
import { PostEntity, PostModel } from "../domain/post_entity";
import { BlogModel } from "../../blogs/domain/blog_entity";
import { ObjectId } from "mongodb";
import { injectable } from "inversify";

@injectable()
export class PostsRepository {
  async createPost(inputPost: PostCreateDto): Promise<ObjectId> {
    const post = new PostEntity(inputPost);
    const created = await PostModel.create(post);
    // mongoose bundles its own mongodb/bson dependency, so its ObjectId is
    // nominally distinct from the one used everywhere else in this codebase.
    return new ObjectId(created._id.toString());
  }

  async updatePost(dto: PostInputDTO, id: string): Promise<void | null> {
    const blog = await BlogModel.findById(dto.blogId);
    if (!blog) {
      throw new Error("blog not found");
    }
    const post = await PostModel.findById(id);
    if (!post) {
      return null;
    }
    post.updatePost(dto, blog.name);
    await post.save();
    return;
  }

  async deletePost(id: string): Promise<boolean> {
    const result = await PostModel.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }
}
