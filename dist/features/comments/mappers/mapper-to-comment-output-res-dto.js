"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapperToCommentOutputResDto = void 0;
const mapperToCommentOutputResDto = (rawComment) => {
    return {
        id: rawComment._id.toString(),
        content: rawComment.content,
        commentatorInfo: {
            userId: rawComment.commentatorInfo.userId,
            userLogin: rawComment.commentatorInfo.userLogin,
        },
        createdAt: rawComment.createdAt,
        likesInfo: rawComment.likesInfo,
    };
};
exports.mapperToCommentOutputResDto = mapperToCommentOutputResDto;
