import { Router } from "express";
import { getCommentByIdHandler } from "./handlers/get-comment-by-id-handler";
import { accessTokenGuardMiddleware } from "../../../core/middlewares/auth/access-token-guard";
import { deleteCommentByIdHandler } from "./handlers/delete-comment-by-id-handler";

export const commentsRouter = Router();

commentsRouter.get("/:id", getCommentByIdHandler);

commentsRouter.delete(
  "/:id",
  accessTokenGuardMiddleware,
  deleteCommentByIdHandler,
);
