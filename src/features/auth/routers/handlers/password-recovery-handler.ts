import { Request, Response } from "express";
import { container } from "../../../../composition-root";
import { AuthService } from "../../application/command-services/auth-service";

const authService = container.get(AuthService);
import { HttpStatuses } from "../../../../core/types/http-statuses";

export async function passwordRecoveryHandler(
  req: Request,
  res: Response,
): Promise<void> {
  await authService.passwordRecovery(req.body.email);

  res.sendStatus(HttpStatuses.NO_CONTENT_204);
}
