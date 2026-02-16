import { NextFunction, Request, Response } from "express";
import { HttpStatuses } from "../../types/http-statuses";
import { rateLimitCollection } from "../../../db/mongo.db";

export const rateLimitMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const ip = req.ip || "";
  const url = req.originalUrl;

  await rateLimitCollection.insertOne({ ip: ip, url: url, date: new Date() });

  const counts = await rateLimitCollection.countDocuments({
    ip: ip,
    url: url,
    date: { $gte: new Date(Date.now() - 10000) },
  });

  if (counts > 5) {
    res.sendStatus(HttpStatuses.TOO_MANY_REQUESTS_429);
    return;
  }

  next();
};
