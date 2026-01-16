import { Request, Response } from "express";
import { authService } from "../../application/command-services/auth-service";
import { HttpStatuses } from "../../../../core/types/http-statuses";

export async function logoutHandler(
  req: Request,
  res: Response,
): Promise<void> {
  const refreshToken = req.cookies.refreshToken;

  const result = await authService.logout(refreshToken);

  if (!result) {
    res.sendStatus(HttpStatuses.UNAUTHORIZED_401);
  }
  res.sendStatus(HttpStatuses.NO_CONTENT_204);
}
