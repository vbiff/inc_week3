import { Router, Request, Response } from "express";
import { db } from "../../db/in-memory.db";
import { HttpStatuses } from "../../core/types/http-statuses";

export const testingRouter: Router = Router({});

testingRouter.delete("/all-data", (req: Request, res: Response) => {
  db.videos = [];
  db.blogs = [];
  res.sendStatus(HttpStatuses.NO_CONTENT_204);
});
