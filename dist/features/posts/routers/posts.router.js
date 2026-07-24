"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRouter = void 0;
const express_1 = require("express");
const create_post_handler_1 = require("./handlers/create-post.handler");
const get_post_by_id_handler_1 = require("./handlers/get-post-by-id.handler");
const update_post_handler_1 = require("./handlers/update-post.handler");
const delete_post_handler_1 = require("./handlers/delete-post.handler");
const validation_result_middleware_1 = require("../../../core/middlewares/validation/validation-result-middleware");
const get_all_posts_handler_1 = require("./handlers/get-all-posts.handler");
const input_dto_validation_middleware_1 = require("../validation/input-dto.validation-middleware");
const admin_guard_middleware_1 = require("../../../core/middlewares/auth/admin.guard-middleware");
const query_pagination_sorting_validation_1 = require("../../../core/middlewares/validation/query-pagination-sorting.validation");
const create_comment_by_postId_1 = require("./handlers/create-comment-by-postId");
const comment_inputDto_validation_1 = require("../../comments/validation/comment-inputDto-validation");
const access_token_guard_1 = require("../../../core/middlewares/auth/access-token-guard");
const get_comments_for_post_id_handler_1 = require("./handlers/get-comments-for-post-id-handler");
const composition_root_1 = require("../../../composition-root");
const createPostHandler = composition_root_1.container.get(create_post_handler_1.CreatePostHandler);
const getPostByIdHandler = composition_root_1.container.get(get_post_by_id_handler_1.GetPostByIdHandler);
const updatePostHandler = composition_root_1.container.get(update_post_handler_1.UpdatePostHandler);
const deletePostHandler = composition_root_1.container.get(delete_post_handler_1.DeletePostHandler);
const getAllPostsHandler = composition_root_1.container.get(get_all_posts_handler_1.GetAllPostsHandler);
const createCommentHandler = composition_root_1.container.get(create_comment_by_postId_1.CreateCommentHandler);
const getCommentsForPostIdHandler = composition_root_1.container.get(get_comments_for_post_id_handler_1.GetCommentsForPostIdHandler);
exports.postRouter = (0, express_1.Router)();
// create comment with postId
exports.postRouter.post("/:postId/comments", access_token_guard_1.accessTokenGuardMiddleware, comment_inputDto_validation_1.commentInputDtoValidation, validation_result_middleware_1.validationResultMiddleware, createCommentHandler.createCommentHandler);
// get comment for postId
exports.postRouter.get("/:postId/comments/", query_pagination_sorting_validation_1.queryValidation, validation_result_middleware_1.validationResultMiddleware, getCommentsForPostIdHandler.getCommentsForPostIdHandler);
//get all posts
exports.postRouter.get("/", query_pagination_sorting_validation_1.queryValidation, validation_result_middleware_1.validationResultMiddleware, getAllPostsHandler.getAllPostsHandler);
// create post
exports.postRouter.post("/", admin_guard_middleware_1.adminGuardMiddleware, input_dto_validation_middleware_1.postInputDtoValidation, validation_result_middleware_1.validationResultMiddleware, createPostHandler.createPostHandler);
// get post by id
exports.postRouter.get("/:id", getPostByIdHandler.getPostById);
// update post
exports.postRouter.put("/:id", admin_guard_middleware_1.adminGuardMiddleware, input_dto_validation_middleware_1.postInputDtoValidation, validation_result_middleware_1.validationResultMiddleware, updatePostHandler.updatePostHandler);
//delete
exports.postRouter.delete("/:id", admin_guard_middleware_1.adminGuardMiddleware, deletePostHandler.deletePostHandler);
