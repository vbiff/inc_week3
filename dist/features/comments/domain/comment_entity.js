"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentModel = exports.CommentSchema = exports.CommentEntity = void 0;
const mongoose_1 = require("mongoose");
class CommentEntity {
    constructor(content, postId, commentatorInfo, createdAt, likesInfo) {
        this.content = content;
        this.postId = postId;
        this.commentatorInfo = commentatorInfo;
        this.createdAt = createdAt;
        this.likesInfo = likesInfo;
    }
    static createComment(dto) {
        return new CommentEntity(dto.content, dto.postId, dto.commentatorInfo, dto.createdAt, dto.likesInfo);
    }
}
exports.CommentEntity = CommentEntity;
exports.CommentSchema = new mongoose_1.Schema({
    content: { type: String, required: true },
    postId: { type: String, required: true },
    commentatorInfo: {
        userId: { type: String, required: true },
        userLogin: { type: String, required: true },
    },
    createdAt: { type: String, required: true },
    likesInfo: {
        likesCount: { type: Number },
        dislikesCount: { type: Number },
        myStatus: { type: String },
    },
});
exports.CommentSchema.loadClass(CommentEntity);
exports.CommentModel = (0, mongoose_1.model)("Comment", exports.CommentSchema);
