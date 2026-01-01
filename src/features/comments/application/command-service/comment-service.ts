import { CommentInputDto } from "../queries/dto/input-dto/comment-input-dto";
import { commentsRepository } from "../../repositories/commentsRepository";
import { AuthMeDto } from "../../../auth/application/queries/dto/auth-output-dto/auth-me-dto";

export const commentService = {
  async createComment(
    inputDto: CommentInputDto,
    postId: string,
    userInfo: AuthMeDto,
  ): Promise<string> {
    const newComment = {
      ...inputDto,
      postId: postId,
      commentatorInfo: {
        userId: userInfo.userId,
        userLogin: userInfo.login,
      },
      createdAt: new Date().toISOString(),
    };

    return await commentsRepository.createComment(newComment);
  },
};
