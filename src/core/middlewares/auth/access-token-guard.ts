import { Request, Response, NextFunction } from "express";
import { HttpStatuses } from "../../types/http-statuses";
import { ioc } from "../../../composition-root";
import { JwtService } from "../../../features/auth/adapters/jwt-service";

const jwtService = ioc.getInstance<JwtService>(JwtService);

export const accessTokenGuardMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const auth = req.headers["authorization"] as string;
  if (!auth) {
    res.sendStatus(HttpStatuses.UNAUTHORIZED_401);
  }

  const [authType, token] = auth.split(" ");

  if (authType !== "Bearer") {
    res.sendStatus(HttpStatuses.UNAUTHORIZED_401);
  }

  const payload = await jwtService.verifyAccessToken(token);

  if (!payload) {
    res.sendStatus(HttpStatuses.UNAUTHORIZED_401);
  }
  const { id } = payload!;

  req.user = { id: id, deviceId: "" };

  next();
};
