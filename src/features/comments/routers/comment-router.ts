import { Router } from "express";
import { getCommentByIdHandler } from "./handlers/get-comment-by-id-handler";
import { accessTokenGuardMiddleware } from "../../../core/middlewares/auth/access-token-guard";
import { deleteCommentByIdHandler } from "./handlers/delete-comment-by-id-handler";
import { validationResultMiddleware } from "../../../core/middlewares/validation/input-validation-result-middleware";
import { mongoCommentIdValidation } from "../validation/mongo-comment-id-param-validation";

export const commentsRouter = Router();

commentsRouter.get("/:id", getCommentByIdHandler);

commentsRouter.delete(
  "/:commentId",
  accessTokenGuardMiddleware,
  mongoCommentIdValidation,
  validationResultMiddleware,
  deleteCommentByIdHandler,
);
