import { Router } from "express";

import { GetAllBlogsHandler } from "./handlers/get-all-blogs.handler";
import { GetBlogByIdHandler } from "./handlers/get-by-id.handler";
import { CreateBlogHandler } from "./handlers/create-blog.handler";
import { UpdateBlogHandler } from "./handlers/update-blog.handler";
import { DeleteBlogHandler } from "./handlers/delete-blog.handler";
import { validationResultMiddleware } from "../../../core/middlewares/validation/validation-result-middleware";
import { blogInputDtoValidation } from "../validation/input-dto.validation-middleware";
import { adminGuardMiddleware } from "../../../core/middlewares/auth/admin.guard-middleware";
import { CreatePostForSpecificId } from "./handlers/create-post-for-specific-id";
import { GetAllPostsForSpecificBlogIdHandler } from "./handlers/get-all-posts-for-specific-blog-id";
import { queryValidation } from "../../../core/middlewares/validation/query-pagination-sorting.validation";
import { postInputDtoValidationForPostsByBlogId } from "../../posts/validation/input-dto.validation-middleware-posts-by-id";
import { blogMongoIdValidation } from "../validation/blog-id-params-validation";
import { container } from "../../../composition-root";

const getAllBlogsHandler = container.get(GetAllBlogsHandler);
const getBlogByIdHandler = container.get(GetBlogByIdHandler);
const createBlogHandler = container.get(CreateBlogHandler);
const updateBlogHandler = container.get(UpdateBlogHandler);
const createPostForSpecificBlogIdHandler = container.get(
  CreatePostForSpecificId,
);
const getAllPostsForSpecificBlogIdHandler = container.get(
  GetAllPostsForSpecificBlogIdHandler,
);
const deleteBlogHandler = container.get(DeleteBlogHandler);

export const blogRouter = Router();
//get all
blogRouter.get(
  "/",
  queryValidation,
  validationResultMiddleware,
  getAllBlogsHandler.getAllBlogsHandler,
);

// create
blogRouter.post(
  "/",
  adminGuardMiddleware,
  blogInputDtoValidation,
  validationResultMiddleware,
  createBlogHandler.createBlogHandler,
);

//create a post for a specific blog
blogRouter.post(
  "/:blogId/posts",
  adminGuardMiddleware,
  blogMongoIdValidation,
  postInputDtoValidationForPostsByBlogId,
  validationResultMiddleware,
  createPostForSpecificBlogIdHandler.createPostForSpecificBlogIdHandler,
);

//get all posts for a specific blog
blogRouter.get(
  "/:blogId/posts",
  queryValidation,
  blogMongoIdValidation,
  validationResultMiddleware,
  getAllPostsForSpecificBlogIdHandler.getAllPostsForSpecificBlogIdHandler,
);

// get by id
blogRouter.get("/:id", getBlogByIdHandler.getBlogById);

// update
blogRouter.put(
  "/:id",
  adminGuardMiddleware,
  blogInputDtoValidation,
  validationResultMiddleware,

  updateBlogHandler.updateBlogHandler,
);

//delete
blogRouter.delete(
  "/:id",
  adminGuardMiddleware,

  deleteBlogHandler.deleteBlogHandler,
);
