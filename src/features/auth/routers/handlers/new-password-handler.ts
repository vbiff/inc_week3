import { Request, Response } from "express";
import { authService } from "../../../../composition-root";
import { HttpStatuses } from "../../../../core/types/http-statuses";
import { ResultStatus } from "../../../../core/result/resultCode";
import { resultCodeToHttpException } from "../../../../core/result/resultCodeToHttpException";

export async function newPasswordHandler(
  req: Request,
  res: Response,
): Promise<void> {
  const result = await authService.newPassword(
    req.body.recoveryCode,
    req.body.newPassword,
  );

  if (result.status !== ResultStatus.Success) {
    res
      .status(resultCodeToHttpException(result.status))
      .send({ errorsMessages: result.extensions });
    return;
  }

  res.sendStatus(HttpStatuses.NO_CONTENT_204);
}
