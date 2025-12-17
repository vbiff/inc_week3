import { Router } from "express";
import { createPostHandler } from "./handlers/create-post.handler";
import { getPostById } from "./handlers/get-post-by-id.handler";
import { updatePostHandler } from "./handlers/update-post.handler";
import { deletePostHandler } from "./handlers/delete-post.handler";
import { validationResultMiddleware } from "../../core/middlewares/validation/input-validation-result-middleware";
import { getAllPostsHandler } from "./handlers/get-all-posts.handler";
import { postInputDtoValidation } from "../validation/input-dto.validation-middleware";
import { adminGuardMiddleware } from "../../core/middlewares/auth/admin.guard-middleware";
import { queryValidation } from "../../core/middlewares/validation/query-pagination-sorting.validation";

export const postRouter = Router();

//get all
postRouter.get(
  "/",
  queryValidation,
  validationResultMiddleware,
  getAllPostsHandler,
);

// create
postRouter.post(
  "/",
  adminGuardMiddleware,
  postInputDtoValidation,
  validationResultMiddleware,
  createPostHandler,
);

// get by id
postRouter.get("/:id", getPostById);

// update
postRouter.put(
  "/:id",
  adminGuardMiddleware,
  postInputDtoValidation,
  validationResultMiddleware,

  updatePostHandler,
);

//delete
postRouter.delete(
  "/:id",
  adminGuardMiddleware,

  deletePostHandler,
);
