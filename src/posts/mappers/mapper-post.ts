import { PostCreateDto } from "../dto/input-dto/post-create-dto";
import { WithId } from "mongodb";
import { PostView } from "../dto/output-dto/posts-view";

export function mapperPost(postWithObjectId: WithId<PostCreateDto>): PostView {
  return {
    id: postWithObjectId._id.toString(),
    title: postWithObjectId.title,
    shortDescription: postWithObjectId.shortDescription,
    content: postWithObjectId.content,
    blogId: postWithObjectId.blogId,
    blogName: postWithObjectId.blogName,
    createdAt: postWithObjectId.createdAt,
  };
}
