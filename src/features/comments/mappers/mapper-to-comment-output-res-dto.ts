import { CommentCreateDto } from "../application/command-service/dto/comment-create-dto";
import { WithId } from "mongodb";
import { CommentOutputResultDto } from "../application/queries/dto/output-dto/output-result-dto";

export const mapperToCommentOutputResDto = (
  rawComment: WithId<CommentCreateDto>,
): CommentOutputResultDto => {
  return {
    id: rawComment._id.toString(),
    content: rawComment.content,
    commentatorInfo: {
      userId: rawComment.commentatorInfo.userId,
      userLogin: rawComment.commentatorInfo.userLogin,
    },
    createdAt: rawComment.createdAt,
  };
};
