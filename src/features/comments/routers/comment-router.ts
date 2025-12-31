import { Router } from "express";
import { getCommentByIdHandler } from "./handlers/get-comment-by-id-handler";

export const commentsRouter = Router();

commentsRouter.get("/:id", getCommentByIdHandler);
