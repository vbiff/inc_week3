import { LikeStatuses } from "../../../domain/comment_like_entity";

export type CommentCreateDto = {
  content: string;
  postId: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: string;
  likesInfo: { lcount: number; dcount: number; myStatus: LikeStatuses };
};
