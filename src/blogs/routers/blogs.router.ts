import { Router } from "express";

import { getAllBlogsHandler } from "./handlers/get-all-blogs.handler";
import { getBlogById } from "./handlers/get-by-id.handler";
import { createBlogHandler } from "./handlers/create-blog.handler";
import { updateBlogHandler } from "./handlers/update-blog.handler";
import { deleteBlogHandler } from "./handlers/delete-blog.handler";
import { validationResultMiddleware } from "../../core/middlewares/validation/input-validation-result-middleware";
import { blogInputDtoValidation } from "../validation/input-dto.validation-middleware";
import { adminGuardMiddleware } from "../../core/middlewares/auth/admin.guard-middleware";
import { createPostForSpecificBlogIdHandler } from "./handlers/create-post-for-specific-id";
import { getAllPostsForSpecificBlogIdHandler } from "./handlers/get-all-posts-for-specific-blog-id";
import { queryValidation } from "../../core/middlewares/validation/query-pagination-sorting.validation";

export const blogRouter = Router();
//get all
blogRouter.get(
  "/",
  queryValidation,
  validationResultMiddleware,
  getAllBlogsHandler,
);

// create
blogRouter.post(
  "/",
  adminGuardMiddleware,
  blogInputDtoValidation,
  validationResultMiddleware,
  createBlogHandler,
);

//create a post for a specific blog
blogRouter.post(
  "/:blogId/posts",
  adminGuardMiddleware,
  validationResultMiddleware,
  createPostForSpecificBlogIdHandler,
);

//get all posts for a specific blog
blogRouter.get(
  "/:blogId/posts",
  queryValidation,
  validationResultMiddleware,
  getAllPostsForSpecificBlogIdHandler,
);

// get by id
blogRouter.get("/:id", getBlogById);

// update
blogRouter.put(
  "/:id",
  adminGuardMiddleware,
  blogInputDtoValidation,
  validationResultMiddleware,

  updateBlogHandler,
);

//delete
blogRouter.delete(
  "/:id",
  adminGuardMiddleware,

  deleteBlogHandler,
);
