import { Request, Response } from "express";
import { ioc } from "../../../../composition-root";
import { AuthService } from "../../application/command-services/auth-service";

const authService = ioc.getInstance<AuthService>(AuthService);
import { HttpStatuses } from "../../../../core/types/http-statuses";
import { ResultStatus } from "../../../../core/result/resultCode";
import { resultCodeToHttpException } from "../../../../core/result/resultCodeToHttpException";

export async function registrationEmailResendingHandler(
  req: Request,
  res: Response,
): Promise<void> {
  const email = req.body.email;
  const result = await authService.resendRegistrationEmail(email);

  if (result.status !== ResultStatus.Success) {
    res
      .status(resultCodeToHttpException(result.status))
      .send({ errorsMessages: result.extensions });
    return;
  }

  res.sendStatus(HttpStatuses.NO_CONTENT_204);
}
