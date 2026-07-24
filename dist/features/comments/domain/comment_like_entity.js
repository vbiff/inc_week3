"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentLikeModel = exports.CommentLikeEntitySchema = exports.CommentLikeEntity = exports.LikeStatuses = void 0;
const mongoose_1 = require("mongoose");
var LikeStatuses;
(function (LikeStatuses) {
    LikeStatuses["Like"] = "Like";
    LikeStatuses["Dislike"] = "Dislike";
    LikeStatuses["None"] = "None";
})(LikeStatuses || (exports.LikeStatuses = LikeStatuses = {}));
class CommentLikeEntity {
    constructor(status, userId, commentId, createdAt, lastModifiedAt) {
        this.status = status;
        this.userId = userId;
        this.commentId = commentId;
        this.createdAt = createdAt;
        this.lastModifiedAt = lastModifiedAt;
    }
    static createCommentLike(dto) {
        return new CommentLikeEntity(dto.status, dto.userId, dto.commentId, dto.createdAt, dto.lastModifiedAt);
    }
}
exports.CommentLikeEntity = CommentLikeEntity;
exports.CommentLikeEntitySchema = new mongoose_1.Schema({
    status: { type: String, required: true },
    userId: { type: String, required: true },
    commentId: { type: String, required: true },
    createdAt: { type: String, required: true },
    lastModifiedAt: { type: String, required: true },
});
exports.CommentLikeEntitySchema.loadClass(CommentLikeEntity);
exports.CommentLikeModel = (0, mongoose_1.model)("CommentLike", exports.CommentLikeEntitySchema);
