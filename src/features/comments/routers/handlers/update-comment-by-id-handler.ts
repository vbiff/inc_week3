import { commentsRepository } from "../../repositories/commentsRepository";
import { ResultStatus } from "../../../../core/result/resultCode";
import { HttpStatuses } from "../../../../core/types/http-statuses";
import { resultCodeToHttpException } from "../../../../core/result/resultCodeToHttpException";
import { Request, Response } from "express";
import { Result } from "../../../../core/result/resultType";

export async function updateCommentByIdHandler(req: Request, res: Response) {
  const result: Result = await commentsRepository.updateCommentById(
    req.params.commentId,
    req.body.content,
    req.user!.id,
  );
  if (result.status === ResultStatus.Success) {
    res.sendStatus(HttpStatuses.NO_CONTENT_204);
    return;
  }

  res.sendStatus(resultCodeToHttpException(result.status));
}
