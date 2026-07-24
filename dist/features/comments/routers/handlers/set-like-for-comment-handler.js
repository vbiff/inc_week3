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
exports.SetLikeForCommentHandler = void 0;
const inversify_1 = require("inversify");
const resultCode_1 = require("../../../../core/result/resultCode");
const http_statuses_1 = require("../../../../core/types/http-statuses");
const resultCodeToHttpException_1 = require("../../../../core/result/resultCodeToHttpException");
const comment_like_service_1 = require("../../application/command-service/comment-like-service");
let SetLikeForCommentHandler = class SetLikeForCommentHandler {
    constructor(commentLikeService) {
        this.commentLikeService = commentLikeService;
        this.setLikeForCommentByIdHandler = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.commentLikeService.setLike(req.params.commentId, req.body.likeStatus, req.user.id);
            if (result.status === resultCode_1.ResultStatus.Success) {
                res.sendStatus(http_statuses_1.HttpStatuses.NO_CONTENT_204);
                return;
            }
            res.sendStatus((0, resultCodeToHttpException_1.resultCodeToHttpException)(result.status));
        });
    }
};
exports.SetLikeForCommentHandler = SetLikeForCommentHandler;
exports.SetLikeForCommentHandler = SetLikeForCommentHandler = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(comment_like_service_1.CommentLikeService)),
    __metadata("design:paramtypes", [comment_like_service_1.CommentLikeService])
], SetLikeForCommentHandler);
