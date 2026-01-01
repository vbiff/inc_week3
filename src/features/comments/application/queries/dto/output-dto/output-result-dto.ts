export type CommentOutputResultDto = {
  id: string;
  content: string;
  commentatorInfo: CommentatorInfo;
  createdAt: string;
};

type CommentatorInfo = {
  userId: string;
  userLogin: string;
};
