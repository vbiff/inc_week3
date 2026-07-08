import { Request, Response } from "express";
import { AuthService } from "../../application/command-services/auth-service";
import { HttpStatuses } from "../../../../core/types/http-statuses";
import { ResultStatus } from "../../../../core/result/resultCode";
import { resultCodeToHttpException } from "../../../../core/result/resultCodeToHttpException";
import { inject, injectable } from "inversify";

@injectable()
export class RegistrationAuthHandler {
  constructor(@inject(AuthService) private authService: AuthService) {}
  registrationAuthHandler = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const result = await this.authService.registerUser(req.body);

    if (result.status !== ResultStatus.Success) {
      res
        .status(resultCodeToHttpException(result.status))
        .send({ errorsMessages: result.extensions });
      return;
    }

    res.sendStatus(HttpStatuses.NO_CONTENT_204);
  };
}
