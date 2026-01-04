import { Router } from "express";
import { getCommentByIdHandler } from "./handlers/get-comment-by-id-handler";
import { accessTokenGuardMiddleware } from "../../../core/middlewares/auth/access-token-guard";
import { deleteCommentByIdHandler } from "./handlers/delete-comment-by-id-handler";
import { validationResultMiddleware } from "../../../core/middlewares/validation/input-validation-result-middleware";
import { mongoCommentIdValidation } from "../validation/mongo-comment-id-param-validation";
import { commentInputDtoValidation } from "../validation/comment-inputDto-validation";
import { updateCommentByIdHandler } from "./handlers/update-comment-by-id-handler";

export const commentsRouter = Router();

commentsRouter.get("/:id", getCommentByIdHandler);

commentsRouter.delete(
  "/:commentId",
  accessTokenGuardMiddleware,
  mongoCommentIdValidation,
  validationResultMiddleware,
  deleteCommentByIdHandler,
);

commentsRouter.put(
  "/:commentId",
  accessTokenGuardMiddleware,
  mongoCommentIdValidation,
  commentInputDtoValidation,
  validationResultMiddleware,
  updateCommentByIdHandler,
);
