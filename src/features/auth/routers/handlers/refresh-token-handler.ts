import { Request, Response } from "express";
import { authService } from "../../application/command-services/auth-service";
import { HttpStatuses } from "../../../../core/types/http-statuses";
import { ResultStatus } from "../../../../core/result/resultCode";

export async function refreshTokenHandler(req: Request, res: Response) {
  const currentRefreshToken: string = req.cookies.refreshToken;

  const refreshTokensResult =
    await authService.refreshTokens(currentRefreshToken);

  if (refreshTokensResult.status !== ResultStatus.Success) {
    res.sendStatus(HttpStatuses.UNAUTHORIZED_401);
  }

  res
    .cookie("refreshToken", refreshTokensResult.data!.refreshToken, {
      httpOnly: true,
      secure: true,
      expires: new Date(Date.now() + 900000),
      path: "/auth/refresh-token",
    })
    .status(HttpStatuses.OK_200)
    .send({ accessToken: refreshTokensResult.data!.accessToken });
}
