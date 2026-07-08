import { Request, Response } from "express";
import { AuthService } from "../../application/command-services/auth-service";
import { ResultStatus } from "../../../../core/result/resultCode";
import { resultCodeToHttpException } from "../../../../core/result/resultCodeToHttpException";
import { HttpStatuses } from "../../../../core/types/http-statuses";
import { inject, injectable } from "inversify";

@injectable()
export class RegistrationConfirmationHandler {
  constructor(@inject(AuthService) private authService: AuthService) {}
  registrationConfirmationHandler = async (req: Request, res: Response) => {
    const code = req.body.code;
    const result = await this.authService.confirmRegistration(code);

    if (result.status !== ResultStatus.Success) {
      res
        .status(resultCodeToHttpException(result.status))
        .send({ errorsMessages: result.extensions });
      return;
    }

    res.sendStatus(HttpStatuses.NO_CONTENT_204);
  };
}
