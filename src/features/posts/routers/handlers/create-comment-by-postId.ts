import { Request, Response } from "express";
import { PostView } from "../../application/queries/dto/output-dto/posts-view";
import { postsQueryRepository, commentService, commentsQueryRepository, userQueryRepository } from "../../../../composition-root";
import { HttpStatuses } from "../../../../core/types/http-statuses";

export async function createCommentHandler(req: Request, res: Response) {
  // 1 check if post exists with postId by query repo
  const post: PostView | null = await postsQueryRepository.findByObjectId(
    req.params.postId,
  );

  if (!post) {
    res.sendStatus(HttpStatuses.NOT_FOUND_404);
    return;
  }
  //get user info
  const userInfo = await userQueryRepository.findUserByIdForMe(
    req.user!.id,
  );

  // 2 create new comment
  const commentId: string = await commentService.createComment(
    req.body,
    post.id,
    userInfo!,
  );

  // 3 get new comment from query repo
  const newComment = await commentsQueryRepository.getCommentById(commentId);

  if (!newComment) {
    res.sendStatus(HttpStatuses.NOT_FOUND_404);
    return;
  }
  return res.status(HttpStatuses.CREATED_201).send(newComment);
}
