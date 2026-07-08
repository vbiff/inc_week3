import { PostView } from "../application/queries/dto/output-dto/posts-view";
import { PostDocument } from "../domain/post_entity";

export function mapperPost(post: PostDocument): PostView {
  return {
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt,
  };
}
