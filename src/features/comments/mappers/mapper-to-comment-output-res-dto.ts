import { CommentOutputResultDto } from "../application/queries/dto/output-dto/output-result-dto";
import { CommentDocument } from "../domain/comment_entity";

export const mapperToCommentOutputResDto = (
  rawComment: CommentDocument,
): CommentOutputResultDto => {
  return {
    id: rawComment._id.toString(),
    content: rawComment.content,
    commentatorInfo: {
      userId: rawComment.commentatorInfo.userId,
      userLogin: rawComment.commentatorInfo.userLogin,
    },
    createdAt: rawComment.createdAt,
    likesInfo: rawComment.likesInfo,
  };
};
