import { commentsRepository } from "../../repositories/commentsRepository";
import { Request, Response } from "express";
import { Result } from "../../../../core/result/resultType";
import { resultCodeToHttpException } from "../../../../core/result/resultCodeToHttpException";
import { ResultStatus } from "../../../../core/result/resultCode";
import { HttpStatuses } from "../../../../core/types/http-statuses";

export async function deleteCommentByIdHandler(req: Request, res: Response) {
  const result: Result = await commentsRepository.deleteCommentById(
    req.params.id,
    req.user!.id,
  );
  if (result.status === ResultStatus.Success) {
    res.sendStatus(HttpStatuses.NO_CONTENT_204);
  }

  res.sendStatus(resultCodeToHttpException(result.status));
}
