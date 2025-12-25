import { Request, Response } from "express";
import { HttpStatuses } from "../../../core/types/http-statuses";
import { authService } from "../../domain/auth-service";

export async function loginAuthHandler(req: Request, res: Response) {
  const authResult = await authService.login(req.body);

  if (!authResult) {
    res.sendStatus(HttpStatuses.UNAUTHORIZED_401);
    return;
  }
  res.sendStatus(HttpStatuses.NO_CONTENT_204);
}
