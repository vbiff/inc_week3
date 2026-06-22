import { Request, Response, NextFunction } from "express";
import { HttpStatuses } from "../../types/http-statuses";
import { jwtService } from "../../../composition-root";

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
