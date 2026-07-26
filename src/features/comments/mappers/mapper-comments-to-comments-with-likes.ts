import { CommentLikeEntity, LikeStatuses } from "../domain/comment_like_entity";
import { CommentDocument } from "../domain/comment_entity";

export const MapperCommentsToCommentsWithLikes = (
  comments: CommentDocument[],
  likesArray: CommentLikeEntity[],
) => {
  const likesByCommentIds = new Map<string, CommentLikeEntity>();

  likesArray.forEach((like) => {
    likesByCommentIds.set(like.commentId, like);
  });

  return comments.map((comment) => {
    const likeInfo = likesByCommentIds.get(comment.id);

    return {
      ...comment,
      likesInfo: {
        ...comment.likesInfo,
        myStatus: likeInfo?.status ?? LikeStatuses.None,
      },
    };
  });
};
