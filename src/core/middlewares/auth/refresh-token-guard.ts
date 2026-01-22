import { Request, Response, NextFunction } from "express";
import { HttpStatuses } from "../../types/http-statuses";
import { jwtService } from "../../../features/auth/adapters/jwt-service";
import { authRepository } from "../../../features/auth/repositories/auth-repository";

export const refreshTokenGuardMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const currentRefreshToken: string = req.cookies.refreshToken;
  if (!currentRefreshToken) {
    res.sendStatus(HttpStatuses.UNAUTHORIZED_401);
  }

  //2 check black list
  const isTokenInBlackList =
    await authRepository.isTokenInBlackList(currentRefreshToken);
  if (isTokenInBlackList) {
    res.sendStatus(HttpStatuses.UNAUTHORIZED_401);
  }
  // 1 verify the token
  const verifyTokenResult =
    await jwtService.verifyRefreshToken(currentRefreshToken);
  if (!verifyTokenResult) {
    res.sendStatus(HttpStatuses.UNAUTHORIZED_401);
  }

  const { id } = verifyTokenResult!;

  req.user = { id: id };

  next();
};
