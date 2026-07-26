"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapperToCommentOutputResDto = void 0;
const comment_like_entity_1 = require("../domain/comment_like_entity");
const mapperToCommentOutputResDto = (rawComment, userId, myLikeStatus) => {
    if (userId === undefined) {
        return {
            id: rawComment._id.toString(),
            content: rawComment.content,
            commentatorInfo: {
                userId: rawComment.commentatorInfo.userId,
                userLogin: rawComment.commentatorInfo.userLogin,
            },
            createdAt: rawComment.createdAt,
            likesInfo: {
                likesCount: rawComment.likesInfo.likesCount,
                dislikesCount: rawComment.likesInfo.dislikesCount,
                myStatus: comment_like_entity_1.LikeStatuses.None,
            },
        };
    }
    return {
        id: rawComment._id.toString(),
        content: rawComment.content,
        commentatorInfo: {
            userId: rawComment.commentatorInfo.userId,
            userLogin: rawComment.commentatorInfo.userLogin,
        },
        createdAt: rawComment.createdAt,
        likesInfo: {
            likesCount: rawComment.likesInfo.likesCount,
            dislikesCount: rawComment.likesInfo.dislikesCount,
            myStatus: myLikeStatus,
        },
    };
};
exports.mapperToCommentOutputResDto = mapperToCommentOutputResDto;
