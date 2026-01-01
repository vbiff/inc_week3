import { Router } from "express";
import { getCommentByIdHandler } from "./handlers/get-comment-by-id-handler";
import { accessTokenGuardMiddleware } from "../../../core/middlewares/auth/access-token-guard";

export const commentsRouter = Router();

commentsRouter.get("/:id", accessTokenGuardMiddleware, getCommentByIdHandler);
