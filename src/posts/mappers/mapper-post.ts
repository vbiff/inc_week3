import { PostCreateDto } from "../dto/post-create-dto";
import { WithId } from "mongodb";
import { Post } from "../types/posts";

export function mapperPost(postWithObjectId: WithId<PostCreateDto>): Post {
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
