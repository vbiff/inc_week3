"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.CommentsLikesRepository = void 0;
const comment_like_entity_1 = require("../domain/comment_like_entity");
const resultCode_1 = require("../../../core/result/resultCode");
const inversify_1 = require("inversify");
let CommentsLikesRepository = class CommentsLikesRepository {
    createLike(newLike) {
        return __awaiter(this, void 0, void 0, function* () {
            const like = comment_like_entity_1.CommentLikeEntity.createCommentLike(newLike);
            const created = yield comment_like_entity_1.CommentLikeModel.create(like);
            return created._id.toString();
        });
    }
    updateLike(likeId, newLike) {
        return __awaiter(this, void 0, void 0, function* () {
            const like = yield comment_like_entity_1.CommentLikeModel.findById(likeId);
            if (!like) {
                return {
                    status: resultCode_1.ResultStatus.NotFound,
                    errorMessage: "Like not found",
                    extensions: [],
                    data: null,
                };
            }
            like.status = newLike.status;
            like.lastModifiedAt = Date.now().toString();
            yield like.save();
            return {
                status: resultCode_1.ResultStatus.Success,
                errorMessage: "",
                extensions: [],
                data: null,
            };
        });
    }
    findLikeById(userId, commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return comment_like_entity_1.CommentLikeModel.findOne({ commentId, userId });
        });
    }
    deleteLike(likeId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield comment_like_entity_1.CommentLikeModel.findByIdAndDelete(likeId);
        });
    }
};
exports.CommentsLikesRepository = CommentsLikesRepository;
exports.CommentsLikesRepository = CommentsLikesRepository = __decorate([
    (0, inversify_1.injectable)()
], CommentsLikesRepository);
