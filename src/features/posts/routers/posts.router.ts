import { Router } from "express";
import { CreatePostHandler } from "./handlers/create-post.handler";
import { GetPostByIdHandler } from "./handlers/get-post-by-id.handler";
import { UpdatePostHandler } from "./handlers/update-post.handler";
import { DeletePostHandler } from "./handlers/delete-post.handler";
import { validationResultMiddleware } from "../../../core/middlewares/validation/validation-result-middleware";
import { GetAllPostsHandler } from "./handlers/get-all-posts.handler";
import { postInputDtoValidation } from "../validation/input-dto.validation-middleware";
import { adminGuardMiddleware } from "../../../core/middlewares/auth/admin.guard-middleware";
import { queryValidation } from "../../../core/middlewares/validation/query-pagination-sorting.validation";
import { CreateCommentHandler } from "./handlers/create-comment-by-postId";
import { commentInputDtoValidation } from "../../comments/validation/comment-inputDto-validation";
import { accessTokenGuardMiddleware } from "../../../core/middlewares/auth/access-token-guard";
import { GetCommentsForPostIdHandler } from "./handlers/get-comments-for-post-id-handler";
import { container } from "../../../composition-root";
import { optionalAccessTokenGuardMiddleware } from "../../../core/middlewares/auth/optional-access-token-guard";

const createPostHandler = container.get(CreatePostHandler);
const getPostByIdHandler = container.get(GetPostByIdHandler);
const updatePostHandler = container.get(UpdatePostHandler);
const deletePostHandler = container.get(DeletePostHandler);
const getAllPostsHandler = container.get(GetAllPostsHandler);
const createCommentHandler = container.get(CreateCommentHandler);
const getCommentsForPostIdHandler = container.get(GetCommentsForPostIdHandler);

export const postRouter = Router();

// create comment with postId
postRouter.post(
  "/:postId/comments",
  accessTokenGuardMiddleware,
  commentInputDtoValidation,
  validationResultMiddleware,
  createCommentHandler.createCommentHandler,
);
// get comment for postId
postRouter.get(
  "/:postId/comments/",
  optionalAccessTokenGuardMiddleware,
  queryValidation,
  validationResultMiddleware,
  getCommentsForPostIdHandler.getCommentsForPostIdHandler,
);

//get all posts
postRouter.get(
  "/",
  queryValidation,
  validationResultMiddleware,
  getAllPostsHandler.getAllPostsHandler,
);

// create post
postRouter.post(
  "/",
  adminGuardMiddleware,
  postInputDtoValidation,
  validationResultMiddleware,
  createPostHandler.createPostHandler,
);

// get post by id
postRouter.get("/:id", getPostByIdHandler.getPostById);

// update post
postRouter.put(
  "/:id",
  adminGuardMiddleware,
  postInputDtoValidation,
  validationResultMiddleware,

  updatePostHandler.updatePostHandler,
);

//delete
postRouter.delete(
  "/:id",
  adminGuardMiddleware,

  deletePostHandler.deletePostHandler,
);
