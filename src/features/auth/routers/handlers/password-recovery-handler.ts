import { Request, Response } from "express";
import { authService } from "../../../../composition-root";
import { HttpStatuses } from "../../../../core/types/http-statuses";

export async function passwordRecoveryHandler(
  req: Request,
  res: Response,
): Promise<void> {
  await authService.passwordRecovery(req.body.email);

  res.sendStatus(HttpStatuses.NO_CONTENT_204);
}
