import { Request, Response } from "express";
import { Result } from "../../../../core/result/resultType";
import { resultCodeToHttpException } from "../../../../core/result/resultCodeToHttpException";
import { ResultStatus } from "../../../../core/result/resultCode";
import { HttpStatuses } from "../../../../core/types/http-statuses";
import { ioc } from "../../../../composition-root";
import { CommentService } from "../../application/command-service/comment-service";

const commentService = ioc.getInstance<CommentService>(CommentService);

export async function deleteCommentByIdHandler(req: Request, res: Response) {
  const result: Result = await commentService.deleteComment(
    req.params.commentId,
    req.user!.id,
  );
  if (result.status === ResultStatus.Success) {
    res.sendStatus(HttpStatuses.NO_CONTENT_204);
    return;
  }

  res.sendStatus(resultCodeToHttpException(result.status));
}
