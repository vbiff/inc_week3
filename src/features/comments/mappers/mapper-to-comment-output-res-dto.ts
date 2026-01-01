import { CommentCreateDto } from "../application/command-service/dto/comment-create-dto";
import { WithId } from "mongodb";
import { CommentOutputResultDto } from "../application/queries/dto/output-dto/output-result-dto";
import { AuthMeDto } from "../../auth/application/queries/dto/auth-output-dto/auth-me-dto";

export const mapperToCommentOutputResDto = (
  rawComment: WithId<CommentCreateDto>,
  userInfo: AuthMeDto,
): CommentOutputResultDto => {
  return {
    id: rawComment._id.toString(),
    content: rawComment.content,
    commentatorInfo: {
      userId: userInfo.userId,
      userLogin: userInfo.login,
    },
    createdAt: rawComment.createdAt,
  };
};
