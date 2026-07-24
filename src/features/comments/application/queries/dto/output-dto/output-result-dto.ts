export type CommentOutputResultDto = {
  id: string;
  content: string;
  commentatorInfo: CommentatorInfo;
  createdAt: string;
  likesInfo: LikesInfo;
};

type CommentatorInfo = {
  userId: string;
  userLogin: string;
};

type LikesInfo = {
  lcount: number;
  dcount: number;
  myStatus: string;
};
