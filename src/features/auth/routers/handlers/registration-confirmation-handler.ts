import { Request, Response } from "express";
import { authService } from "../../../../composition-root";
import { ResultStatus } from "../../../../core/result/resultCode";
import { resultCodeToHttpException } from "../../../../core/result/resultCodeToHttpException";
import { HttpStatuses } from "../../../../core/types/http-statuses";

export async function registrationConfirmationHandler(
  req: Request,
  res: Response,
) {
  const code = req.body.code;
  const result = await authService.confirmRegistration(code);

  if (result.status !== ResultStatus.Success) {
    res
      .status(resultCodeToHttpException(result.status))
      .send({ errorsMessages: result.extensions });
    return;
  }

  res.sendStatus(HttpStatuses.NO_CONTENT_204);
}
