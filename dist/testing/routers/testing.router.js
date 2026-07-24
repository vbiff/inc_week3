"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testingRouter = void 0;
const express_1 = require("express");
const http_statuses_1 = require("../../core/types/http-statuses");
const blog_entity_1 = require("../../features/blogs/domain/blog_entity");
const post_entity_1 = require("../../features/posts/domain/post_entity");
const comment_entity_1 = require("../../features/comments/domain/comment_entity");
const user_entity_1 = require("../../features/users/domain/user_entity");
const device_entity_1 = require("../../features/security/domain/device_entity");
const rate_limit_model_1 = require("../../core/middlewares/rate-limit/rate-limit.model");
const comment_like_entity_1 = require("../../features/comments/domain/comment_like_entity");
exports.testingRouter = (0, express_1.Router)({});
exports.testingRouter.delete("/all-data", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield blog_entity_1.BlogModel.deleteMany();
    yield post_entity_1.PostModel.deleteMany();
    yield comment_entity_1.CommentModel.deleteMany();
    yield user_entity_1.UserModel.deleteMany();
    yield device_entity_1.DeviceModel.deleteMany();
    yield rate_limit_model_1.RateLimitModel.deleteMany();
    yield comment_like_entity_1.CommentLikeModel.deleteMany();
    res.sendStatus(http_statuses_1.HttpStatuses.NO_CONTENT_204);
}));
