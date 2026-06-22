import { Request, Response } from "express";
import { authService } from "../../application/command-services/auth-service";
import { HttpStatuses } from "../../../../core/types/http-statuses";
import { ResultStatus } from "../../../../core/result/resultCode";
import { resultCodeToHttpException } from "../../../../core/result/resultCodeToHttpException";

export async function registrationAuthHandler(
  req: Request,
  res: Response,
): Promise<void> {
  const result = await authService.registerUser(req.body);

  if (result.status !== ResultStatus.Success) {
    res
      .status(resultCodeToHttpException(result.status))
      .send({ errorsMessages: result.extensions });
    return;
  }

  res.sendStatus(HttpStatuses.NO_CONTENT_204);
}
