import { Router } from "express";
import { GetCommentByIdHandler } from "./handlers/get-comment-by-id-handler";
import { accessTokenGuardMiddleware } from "../../../core/middlewares/auth/access-token-guard";
import { DeleteCommentByIdHandler } from "./handlers/delete-comment-by-id-handler";
import { validationResultMiddleware } from "../../../core/middlewares/validation/validation-result-middleware";
import { mongoCommentIdValidation } from "../validation/mongo-comment-id-param-validation";
import { commentInputDtoValidation } from "../validation/comment-inputDto-validation";
import { UpdateCommentByIdHandler } from "./handlers/update-comment-by-id-handler";
import { container } from "../../../composition-root";
import { SetLikeForCommentHandler } from "./handlers/set-like-for-comment-handler";
import { optionalAccessTokenGuardMiddleware } from "../../../core/middlewares/auth/optional-access-token-guard";
import { commentLikeStatusValidation } from "../validation/comment-like-status-validation";

const getCommentByIdHandler = container.get(GetCommentByIdHandler);
const deleteCommentByIdHandler = container.get(DeleteCommentByIdHandler);
const updateCommentByIdHandler = container.get(UpdateCommentByIdHandler);
const setCommentLike = container.get(SetLikeForCommentHandler);

export const commentsRouter = Router();

commentsRouter.get(
  "/:id",
  optionalAccessTokenGuardMiddleware,
  getCommentByIdHandler.getCommentByIdHandler,
);

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

commentsRouter.put(
  "/:commentId/like-status",
  accessTokenGuardMiddleware,
  commentLikeStatusValidation,
  // mongoCommentIdValidation,
  // commentInputDtoValidation,
  validationResultMiddleware,
  setCommentLike.setLikeForCommentByIdHandler,
);
