import { Request, Response } from "express";
import { container } from "../../../../composition-root";
import { AuthService } from "../../application/command-services/auth-service";

const authService = container.get(AuthService);
import { HttpStatuses } from "../../../../core/types/http-statuses";
import { ResultStatus } from "../../../../core/result/resultCode";

export async function refreshTokenHandler(req: Request, res: Response) {
  try {
    const currentRefreshToken: string = req.cookies.refreshToken;
    const userId = req.user!.id;

    const refreshTokensResult = await authService.refreshTokens(
      currentRefreshToken,
      userId,
      req.user!.deviceId,
    );

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
  } catch (error) {
    console.error(error);
    res.sendStatus(HttpStatuses.SERVERERROR_500);
  }
}
