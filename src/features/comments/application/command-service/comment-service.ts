import { CommentInputDto } from "../queries/dto/input-dto/comment-input-dto";
import { commentsRepository } from "../../repositories/commentsRepository";

export const commentService = {
  async createComment(
    inputDto: CommentInputDto,
    postId: string,
  ): Promise<string> {
    const newComment = {
      ...inputDto,
      postId: postId,
      createdAt: new Date().toISOString(),
    };

    return await commentsRepository.createComment(newComment);
  },
};
