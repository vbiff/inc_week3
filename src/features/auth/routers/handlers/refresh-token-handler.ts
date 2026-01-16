import { Request, Response } from "express";
import { authService } from "../../application/command-services/auth-service";
import { HttpStatuses } from "../../../../core/types/http-statuses";

export async function refreshTokenHandler(req: Request, res: Response) {
  const currentRefreshToken: string = req.cookies.refreshToken;

  if (!currentRefreshToken) {
    res.sendStatus(HttpStatuses.UNAUTHORIZED_401);
  }

  const refreshTokenResult =
    await authService.refreshToken(currentRefreshToken);

  if (!refreshTokenResult.data) {
    res.sendStatus(HttpStatuses.UNAUTHORIZED_401);
  }

  res
    .cookie("refreshToken", refreshTokenResult.data?.refreshToken, {
      httpOnly: true,
      secure: true,
    })
    .status(HttpStatuses.OK_200)
    .send(refreshTokenResult.data?.accessToken);
}
