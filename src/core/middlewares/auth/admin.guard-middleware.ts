import { Request, Response, NextFunction } from "express";
import { HttpStatuses } from "../../types/http-statuses";

export const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "qwerty";

export const adminGuardMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const auth = req.headers["authorization"] as string;
  if (!auth) {
    res.sendStatus(HttpStatuses.UNAUTHORIZED_401);
  }

  const [authType, token] = auth.split(" ");

  if (authType !== "Basic") {
    res.sendStatus(HttpStatuses.UNAUTHORIZED_401);
  }

  const credentials = Buffer.from(token, "base64").toString("utf-8");

  const [username, password] = credentials.split(":");

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    res.sendStatus(HttpStatuses.UNAUTHORIZED_401);
  }
  next();
};
