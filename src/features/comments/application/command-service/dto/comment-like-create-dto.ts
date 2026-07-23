import { LikeStatuses } from "../../../domain/comment_like_entity";

export type CommentLikeCreateDTO = {
  status: LikeStatuses;
  userId: string;
  commentId: string;
  createdAt: string;
  lastModifiedAt: string;
};
