"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.CreateCommentHandler = void 0;
const http_statuses_1 = require("../../../../core/types/http-statuses");
const posts_mongodb_query_repository_1 = require("../../repositories/posts.mongodb-query-repository");
const comment_service_1 = require("../../../comments/application/command-service/comment-service");
const commentsQueryRepository_1 = require("../../../comments/repositories/commentsQueryRepository");
const user_query_repository_mongodb_1 = require("../../../users/repositories/user-query-repository-mongodb");
const inversify_1 = require("inversify");
let CreateCommentHandler = class CreateCommentHandler {
    constructor(postsQueryRepository, commentService, commentsQueryRepository, userQueryRepository) {
        this.postsQueryRepository = postsQueryRepository;
        this.commentService = commentService;
        this.commentsQueryRepository = commentsQueryRepository;
        this.userQueryRepository = userQueryRepository;
        this.createCommentHandler = (req, res) => __awaiter(this, void 0, void 0, function* () {
            // 1 check if post exists with postId by query repo
            const post = yield this.postsQueryRepository.findByObjectId(req.params.postId);
            if (!post) {
                res.sendStatus(http_statuses_1.HttpStatuses.NOT_FOUND_404);
                return;
            }
            //get user info
            const userInfo = yield this.userQueryRepository.findUserByIdForMe(req.user.id);
            // 2 create new comment
            const commentId = yield this.commentService.createComment(req.body, post.id, userInfo);
            // 3 get new comment from query repo
            const newComment = yield this.commentsQueryRepository.getCommentById(commentId);
            if (!newComment) {
                res.sendStatus(http_statuses_1.HttpStatuses.NOT_FOUND_404);
                return;
            }
            return res.status(http_statuses_1.HttpStatuses.CREATED_201).send(newComment);
        });
    }
};
exports.CreateCommentHandler = CreateCommentHandler;
exports.CreateCommentHandler = CreateCommentHandler = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(posts_mongodb_query_repository_1.PostsQueryRepository)),
    __param(1, (0, inversify_1.inject)(comment_service_1.CommentService)),
    __param(2, (0, inversify_1.inject)(commentsQueryRepository_1.CommentsQueryRepository)),
    __param(3, (0, inversify_1.inject)(user_query_repository_mongodb_1.UserQueryRepository)),
    __metadata("design:paramtypes", [posts_mongodb_query_repository_1.PostsQueryRepository,
        comment_service_1.CommentService,
        commentsQueryRepository_1.CommentsQueryRepository,
        user_query_repository_mongodb_1.UserQueryRepository])
], CreateCommentHandler);
