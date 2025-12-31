import { CommentInputDto } from "../dto/input-dto/comment-input-dto";
import { commentsRepository } from "../repositories/commentsRepository";

export const commentService = {
  async createComment(
    inputDto: CommentInputDto,
    postId: string,
  ): Promise<string> {
    const newComment = {
      ...inputDto,
      postId: postId,
    };

    return await commentsRepository.createComment(newComment);
  },
};
