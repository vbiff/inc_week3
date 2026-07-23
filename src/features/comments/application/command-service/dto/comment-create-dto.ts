export type CommentCreateDto = {
  content: string;
  postId: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: string;
  lcount: number;
  dcount: number;
};
