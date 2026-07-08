import { Request, Response } from "express";
import { AuthService } from "../../application/command-services/auth-service";
import { HttpStatuses } from "../../../../core/types/http-statuses";
import { inject, injectable } from "inversify";

@injectable()
export class PasswordRecoveryHandler {
  constructor(@inject(AuthService) private authService: AuthService) {}
  passwordRecoveryHandler = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    await this.authService.passwordRecovery(req.body.email);

    res.sendStatus(HttpStatuses.NO_CONTENT_204);
  };
}
