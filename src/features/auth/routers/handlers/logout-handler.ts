import { Request, Response } from "express";
import { AuthService } from "../../application/command-services/auth-service";
import { HttpStatuses } from "../../../../core/types/http-statuses";
import { inject, injectable } from "inversify";

@injectable()
export class LogoutHandler {
  constructor(@inject(AuthService) private authService: AuthService) {}
  logoutHandler = async (req: Request, res: Response): Promise<void> => {
    const result = await this.authService.logout(req.user!.deviceId);

    if (!result) {
      res.sendStatus(HttpStatuses.UNAUTHORIZED_401);
    }
    res.sendStatus(HttpStatuses.NO_CONTENT_204);
  };
}
