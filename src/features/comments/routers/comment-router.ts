import { Router } from "express";
import { GetCommentByIdHandler } from "./handlers/get-comment-by-id-handler";
import { accessTokenGuardMiddleware } from "../../../core/middlewares/auth/access-token-guard";
import { DeleteCommentByIdHandler } from "./handlers/delete-comment-by-id-handler";
import { validationResultMiddleware } from "../../../core/middlewares/validation/validation-result-middleware";
import { mongoCommentIdValidation } from "../validation/mongo-comment-id-param-validation";
import { commentInputDtoValidation } from "../validation/comment-inputDto-validation";
import { UpdateCommentByIdHandler } from "./handlers/update-comment-by-id-handler";
import { container } from "../../../composition-root";

const getCommentByIdHandler = container.get(GetCommentByIdHandler);
const deleteCommentByIdHandler = container.get(DeleteCommentByIdHandler);
const updateCommentByIdHandler = container.get(UpdateCommentByIdHandler);

export const commentsRouter = Router();

commentsRouter.get("/:id", getCommentByIdHandler.getCommentByIdHandler);

commentsRouter.delete(
  "/:commentId",
  accessTokenGuardMiddleware,
  mongoCommentIdValidation,
  validationResultMiddleware,
  deleteCommentByIdHandler.deleteCommentByIdHandler,
);

commentsRouter.put(
  "/:commentId",
  accessTokenGuardMiddleware,
  mongoCommentIdValidation,
  commentInputDtoValidation,
  validationResultMiddleware,
  updateCommentByIdHandler.updateCommentByIdHandler,
);
