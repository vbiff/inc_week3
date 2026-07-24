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
exports.CommentsRepository = void 0;
const comment_entity_1 = require("../domain/comment_entity");
const resultCode_1 = require("../../../core/result/resultCode");
const inversify_1 = require("inversify");
let CommentsRepository = class CommentsRepository {
    createComment(newComment) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = comment_entity_1.CommentEntity.createComment(newComment);
            const created = yield comment_entity_1.CommentModel.create(comment);
            return created._id.toString();
        });
    }
    deleteCommentById(commentId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield comment_entity_1.CommentModel.findById(commentId);
            if (!comment) {
                return {
                    status: resultCode_1.ResultStatus.NotFound,
                    errorMessage: "Comment not found",
                    extensions: [],
                    data: null,
                };
            }
            if (userId !== comment.commentatorInfo.userId) {
                return {
                    status: resultCode_1.ResultStatus.Forbidden,
                    errorMessage: "The comment is not belongs to current user",
                    extensions: [],
                    data: null,
                };
            }
            yield comment_entity_1.CommentModel.deleteOne({ _id: comment._id });
            return {
                status: resultCode_1.ResultStatus.Success,
                errorMessage: "",
                extensions: [],
                data: null,
            };
        });
    }
    updateCommentById(commentId, userId, fields) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield comment_entity_1.CommentModel.findById(commentId);
            if (!comment) {
                return {
                    status: resultCode_1.ResultStatus.NotFound,
                    errorMessage: "Comment not found",
                    extensions: [],
                    data: null,
                };
            }
            if (userId !== comment.commentatorInfo.userId) {
                return {
                    status: resultCode_1.ResultStatus.Forbidden,
                    errorMessage: "The comment is not belongs to current user",
                    extensions: [],
                    data: null,
                };
            }
            if (fields.content !== undefined)
                comment.content = fields.content;
            if (fields.lcount === 1 || fields.lcount === -1) {
                comment.likesInfo.likesCount += fields.lcount;
            }
            if (fields.dcount === 1 || fields.dcount === -1)
                comment.likesInfo.dislikesCount += fields.dcount;
            if (fields.myStatus)
                comment.likesInfo.myStatus = fields.myStatus;
            yield comment.save();
            return {
                status: resultCode_1.ResultStatus.Success,
                errorMessage: "",
                extensions: [],
                data: null,
            };
        });
    }
};
exports.CommentsRepository = CommentsRepository;
exports.CommentsRepository = CommentsRepository = __decorate([
    (0, inversify_1.injectable)()
], CommentsRepository);
