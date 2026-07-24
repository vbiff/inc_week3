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
exports.CommentLikeService = void 0;
const inversify_1 = require("inversify");
const commentsRepository_1 = require("../../repositories/commentsRepository");
const commentsLikesRepository_1 = require("../../repositories/commentsLikesRepository");
const comment_like_entity_1 = require("../../domain/comment_like_entity");
const resultCode_1 = require("../../../../core/result/resultCode");
let CommentLikeService = class CommentLikeService {
    constructor(commentsRepository, commentsLikesRepository) {
        this.commentsRepository = commentsRepository;
        this.commentsLikesRepository = commentsLikesRepository;
    }
    setLike(commentId, likeStatus, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const newLike = comment_like_entity_1.CommentLikeEntity.createCommentLike({
                status: likeStatus,
                userId,
                commentId,
                createdAt: new Date().toISOString(),
                lastModifiedAt: new Date().toISOString(),
            });
            const likeExisted = yield this.commentsLikesRepository.findLikeById(newLike.userId, newLike.commentId);
            if (!likeExisted) {
                const setLike = yield this.commentsLikesRepository.createLike(newLike);
                // add lcounts .... d counts
                if (newLike.status === comment_like_entity_1.LikeStatuses.Like) {
                    yield this.commentsRepository.updateCommentById(newLike.commentId, userId, { lcount: 1, myStatus: newLike.status });
                }
                if (newLike.status === comment_like_entity_1.LikeStatuses.Dislike) {
                    yield this.commentsRepository.updateCommentById(newLike.commentId, userId, { dcount: 1, myStatus: newLike.status });
                }
                if (!setLike) {
                    return {
                        status: resultCode_1.ResultStatus.BadRequest,
                        errorMessage: "Something went wrong",
                        extensions: [],
                        data: null,
                    };
                }
                return {
                    status: resultCode_1.ResultStatus.Success,
                    errorMessage: "",
                    extensions: [],
                    data: null,
                };
            }
            if (likeExisted.status === newLike.status) {
                return {
                    status: resultCode_1.ResultStatus.Success,
                    errorMessage: "",
                    extensions: [],
                    data: null,
                };
            }
            if (likeExisted.status !== newLike.status) {
                if (newLike.status === comment_like_entity_1.LikeStatuses.Like) {
                    // add lcount
                    yield this.commentsLikesRepository.updateLike(likeExisted._id.toString(), newLike);
                    if (likeExisted.status === comment_like_entity_1.LikeStatuses.Dislike) {
                        yield this.commentsRepository.updateCommentById(newLike.commentId, userId, { lcount: 1, dcount: -1, myStatus: newLike.status });
                        return {
                            status: resultCode_1.ResultStatus.Success,
                            errorMessage: "",
                            extensions: [],
                            data: null,
                        };
                    }
                    yield this.commentsRepository.updateCommentById(newLike.commentId, userId, { lcount: 1, myStatus: newLike.status });
                    return {
                        status: resultCode_1.ResultStatus.Success,
                        errorMessage: "",
                        extensions: [],
                        data: null,
                    };
                }
                if (newLike.status === comment_like_entity_1.LikeStatuses.Dislike) {
                    // add dcount
                    yield this.commentsLikesRepository.updateLike(likeExisted._id.toString(), newLike);
                    if (likeExisted.status === comment_like_entity_1.LikeStatuses.Like) {
                        yield this.commentsRepository.updateCommentById(newLike.commentId, userId, { lcount: -1, dcount: 1, myStatus: newLike.status });
                        return {
                            status: resultCode_1.ResultStatus.Success,
                            errorMessage: "",
                            extensions: [],
                            data: null,
                        };
                    }
                }
                if (newLike.status === comment_like_entity_1.LikeStatuses.None) {
                    yield this.commentsLikesRepository.deleteLike(likeExisted.id);
                    if (likeExisted.status === comment_like_entity_1.LikeStatuses.Dislike) {
                        yield this.commentsRepository.updateCommentById(newLike.commentId, userId, { dcount: -1, myStatus: newLike.status });
                    }
                    if (likeExisted.status === comment_like_entity_1.LikeStatuses.Like) {
                        yield this.commentsRepository.updateCommentById(newLike.commentId, userId, { lcount: -1, myStatus: newLike.status });
                    }
                    return {
                        status: resultCode_1.ResultStatus.Success,
                        errorMessage: "",
                        extensions: [],
                        data: null,
                    };
                }
                return {
                    status: resultCode_1.ResultStatus.Success,
                    errorMessage: "",
                    extensions: [],
                    data: null,
                };
            }
            return {
                status: resultCode_1.ResultStatus.BadRequest,
                errorMessage: "Something went wrong",
                extensions: [],
                data: null,
            };
        });
    }
};
exports.CommentLikeService = CommentLikeService;
exports.CommentLikeService = CommentLikeService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(commentsRepository_1.CommentsRepository)),
    __param(1, (0, inversify_1.inject)(commentsLikesRepository_1.CommentsLikesRepository)),
    __metadata("design:paramtypes", [commentsRepository_1.CommentsRepository,
        commentsLikesRepository_1.CommentsLikesRepository])
], CommentLikeService);
