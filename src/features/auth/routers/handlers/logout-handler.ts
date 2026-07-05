import { Request, Response } from "express";
import { container } from "../../../../composition-root";
import { AuthService } from "../../application/command-services/auth-service";

const authService = container.get(AuthService);
import { HttpStatuses } from "../../../../core/types/http-statuses";

export async function logoutHandler(
  req: Request,
  res: Response,
): Promise<void> {
  const result = await authService.logout(req.user!.deviceId);

  if (!result) {
    res.sendStatus(HttpStatuses.UNAUTHORIZED_401);
  }
  res.sendStatus(HttpStatuses.NO_CONTENT_204);
}
