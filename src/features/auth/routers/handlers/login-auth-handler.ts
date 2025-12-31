import { Request, Response } from "express";
import { HttpStatuses } from "../../../../core/types/http-statuses";
import { authService } from "../../application/command-services/auth-service";
import { ResultStatus } from "../../../../core/result/resultCode";
import { resultCodeToHttpException } from "../../../../core/result/resultCodeToHttpException";

export async function loginAuthHandler(req: Request, res: Response) {
  const authResult = await authService.login(req.body);

  if (authResult.status !== ResultStatus.Success) {
    res
      .status(resultCodeToHttpException(authResult.status))
      .send(authResult.extensions);
    return;
  }
  res.status(HttpStatuses.OK_200).send(authResult.data?.accessToken);
}
