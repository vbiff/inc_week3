import { CommentOutputResultDto } from "../application/queries/dto/output-dto/output-result-dto";
import { CommentDocument } from "../domain/comment_entity";
import { LikeStatuses } from "../domain/comment_like_entity";

export const mapperToCommentOutputResDto = (
  rawComment: CommentDocument,
  userId: string | undefined,
  myLikeStatus: LikeStatuses,
): CommentOutputResultDto => {
  if (userId === undefined) {
    return {
      id: rawComment._id.toString(),
      content: rawComment.content,
      commentatorInfo: {
        userId: rawComment.commentatorInfo.userId,
        userLogin: rawComment.commentatorInfo.userLogin,
      },
      createdAt: rawComment.createdAt,
      likesInfo: {
        likesCount: rawComment.likesInfo.likesCount,
        dislikesCount: rawComment.likesInfo.dislikesCount,
        myStatus: LikeStatuses.None,
      },
    };
  }
  return {
    id: rawComment._id.toString(),
    content: rawComment.content,
    commentatorInfo: {
      userId: rawComment.commentatorInfo.userId,
      userLogin: rawComment.commentatorInfo.userLogin,
    },
    createdAt: rawComment.createdAt,
    likesInfo: {
      likesCount: rawComment.likesInfo.likesCount,
      dislikesCount: rawComment.likesInfo.dislikesCount,
      myStatus: myLikeStatus,
    },
  };
};
