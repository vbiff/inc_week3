import { NextFunction, Request, Response } from "express";
import { HttpStatuses } from "../../types/http-statuses";
import { RateLimitModel } from "./rate-limit.model";

export const rateLimitMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const ip = req.ip || "";
  const url = req.originalUrl;

  await RateLimitModel.create({ ip, url, date: new Date() });

  const counts = await RateLimitModel.countDocuments({
    ip,
    url,
    date: { $gte: new Date(Date.now() - 10000) },
  });

  if (counts > 5) {
    res.sendStatus(HttpStatuses.TOO_MANY_REQUESTS_429);
    return;
  }

  next();
};
