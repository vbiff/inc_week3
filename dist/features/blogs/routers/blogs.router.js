"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogRouter = void 0;
const express_1 = require("express");
const get_all_blogs_handler_1 = require("./handlers/get-all-blogs.handler");
const get_by_id_handler_1 = require("./handlers/get-by-id.handler");
const create_blog_handler_1 = require("./handlers/create-blog.handler");
const update_blog_handler_1 = require("./handlers/update-blog.handler");
const delete_blog_handler_1 = require("./handlers/delete-blog.handler");
const validation_result_middleware_1 = require("../../../core/middlewares/validation/validation-result-middleware");
const input_dto_validation_middleware_1 = require("../validation/input-dto.validation-middleware");
const admin_guard_middleware_1 = require("../../../core/middlewares/auth/admin.guard-middleware");
const create_post_for_specific_id_1 = require("./handlers/create-post-for-specific-id");
const get_all_posts_for_specific_blog_id_1 = require("./handlers/get-all-posts-for-specific-blog-id");
const query_pagination_sorting_validation_1 = require("../../../core/middlewares/validation/query-pagination-sorting.validation");
const input_dto_validation_middleware_posts_by_id_1 = require("../../posts/validation/input-dto.validation-middleware-posts-by-id");
const blog_id_params_validation_1 = require("../validation/blog-id-params-validation");
const composition_root_1 = require("../../../composition-root");
const getAllBlogsHandler = composition_root_1.container.get(get_all_blogs_handler_1.GetAllBlogsHandler);
const getBlogByIdHandler = composition_root_1.container.get(get_by_id_handler_1.GetBlogByIdHandler);
const createBlogHandler = composition_root_1.container.get(create_blog_handler_1.CreateBlogHandler);
const updateBlogHandler = composition_root_1.container.get(update_blog_handler_1.UpdateBlogHandler);
const createPostForSpecificBlogIdHandler = composition_root_1.container.get(create_post_for_specific_id_1.CreatePostForSpecificId);
const getAllPostsForSpecificBlogIdHandler = composition_root_1.container.get(get_all_posts_for_specific_blog_id_1.GetAllPostsForSpecificBlogIdHandler);
const deleteBlogHandler = composition_root_1.container.get(delete_blog_handler_1.DeleteBlogHandler);
exports.blogRouter = (0, express_1.Router)();
//get all
exports.blogRouter.get("/", query_pagination_sorting_validation_1.queryValidation, validation_result_middleware_1.validationResultMiddleware, getAllBlogsHandler.getAllBlogsHandler);
// create
exports.blogRouter.post("/", admin_guard_middleware_1.adminGuardMiddleware, input_dto_validation_middleware_1.blogInputDtoValidation, validation_result_middleware_1.validationResultMiddleware, createBlogHandler.createBlogHandler);
//create a post for a specific blog
exports.blogRouter.post("/:blogId/posts", admin_guard_middleware_1.adminGuardMiddleware, blog_id_params_validation_1.blogMongoIdValidation, input_dto_validation_middleware_posts_by_id_1.postInputDtoValidationForPostsByBlogId, validation_result_middleware_1.validationResultMiddleware, createPostForSpecificBlogIdHandler.createPostForSpecificBlogIdHandler);
//get all posts for a specific blog
exports.blogRouter.get("/:blogId/posts", query_pagination_sorting_validation_1.queryValidation, blog_id_params_validation_1.blogMongoIdValidation, validation_result_middleware_1.validationResultMiddleware, getAllPostsForSpecificBlogIdHandler.getAllPostsForSpecificBlogIdHandler);
// get by id
exports.blogRouter.get("/:id", getBlogByIdHandler.getBlogById);
// update
exports.blogRouter.put("/:id", admin_guard_middleware_1.adminGuardMiddleware, input_dto_validation_middleware_1.blogInputDtoValidation, validation_result_middleware_1.validationResultMiddleware, updateBlogHandler.updateBlogHandler);
//delete
exports.blogRouter.delete("/:id", admin_guard_middleware_1.adminGuardMiddleware, deleteBlogHandler.deleteBlogHandler);
