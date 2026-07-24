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
exports.DeleteCommentByIdHandler = void 0;
const resultCodeToHttpException_1 = require("../../../../core/result/resultCodeToHttpException");
const resultCode_1 = require("../../../../core/result/resultCode");
const http_statuses_1 = require("../../../../core/types/http-statuses");
const comment_service_1 = require("../../application/command-service/comment-service");
const inversify_1 = require("inversify");
let DeleteCommentByIdHandler = class DeleteCommentByIdHandler {
    constructor(commentService) {
        this.commentService = commentService;
        this.deleteCommentByIdHandler = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.commentService.deleteComment(req.params.commentId, req.user.id);
            if (result.status === resultCode_1.ResultStatus.Success) {
                res.sendStatus(http_statuses_1.HttpStatuses.NO_CONTENT_204);
                return;
            }
            res.sendStatus((0, resultCodeToHttpException_1.resultCodeToHttpException)(result.status));
        });
    }
};
exports.DeleteCommentByIdHandler = DeleteCommentByIdHandler;
exports.DeleteCommentByIdHandler = DeleteCommentByIdHandler = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(comment_service_1.CommentService)),
    __metadata("design:paramtypes", [comment_service_1.CommentService])
], DeleteCommentByIdHandler);
