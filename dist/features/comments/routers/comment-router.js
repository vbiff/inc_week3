"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsRouter = void 0;
const express_1 = require("express");
const get_comment_by_id_handler_1 = require("./handlers/get-comment-by-id-handler");
const access_token_guard_1 = require("../../../core/middlewares/auth/access-token-guard");
const delete_comment_by_id_handler_1 = require("./handlers/delete-comment-by-id-handler");
const validation_result_middleware_1 = require("../../../core/middlewares/validation/validation-result-middleware");
const mongo_comment_id_param_validation_1 = require("../validation/mongo-comment-id-param-validation");
const comment_inputDto_validation_1 = require("../validation/comment-inputDto-validation");
const update_comment_by_id_handler_1 = require("./handlers/update-comment-by-id-handler");
const composition_root_1 = require("../../../composition-root");
const set_like_for_comment_handler_1 = require("./handlers/set-like-for-comment-handler");
const getCommentByIdHandler = composition_root_1.container.get(get_comment_by_id_handler_1.GetCommentByIdHandler);
const deleteCommentByIdHandler = composition_root_1.container.get(delete_comment_by_id_handler_1.DeleteCommentByIdHandler);
const updateCommentByIdHandler = composition_root_1.container.get(update_comment_by_id_handler_1.UpdateCommentByIdHandler);
const setCommentLike = composition_root_1.container.get(set_like_for_comment_handler_1.SetLikeForCommentHandler);
exports.commentsRouter = (0, express_1.Router)();
exports.commentsRouter.get("/:id", getCommentByIdHandler.getCommentByIdHandler);
exports.commentsRouter.delete("/:commentId", access_token_guard_1.accessTokenGuardMiddleware, mongo_comment_id_param_validation_1.mongoCommentIdValidation, validation_result_middleware_1.validationResultMiddleware, deleteCommentByIdHandler.deleteCommentByIdHandler);
exports.commentsRouter.put("/:commentId", access_token_guard_1.accessTokenGuardMiddleware, mongo_comment_id_param_validation_1.mongoCommentIdValidation, comment_inputDto_validation_1.commentInputDtoValidation, validation_result_middleware_1.validationResultMiddleware, updateCommentByIdHandler.updateCommentByIdHandler);
exports.commentsRouter.put("/:commentId/like-status", access_token_guard_1.accessTokenGuardMiddleware, 
// mongoCommentIdValidation,
// commentInputDtoValidation,
// validationResultMiddleware,
setCommentLike.setLikeForCommentByIdHandler);
