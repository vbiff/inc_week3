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
exports.CommentsQueryRepository = void 0;
const post_entity_1 = require("../../posts/domain/post_entity");
const mapper_to_comment_output_res_dto_1 = require("../mappers/mapper-to-comment-output-res-dto");
const skip_1 = require("../../../core/utils/skip");
const mapper_output_1 = require("../../../core/mappers/mapper-output");
const inversify_1 = require("inversify");
const comment_entity_1 = require("../domain/comment_entity");
const comment_like_entity_1 = require("../domain/comment_like_entity");
let CommentsQueryRepository = class CommentsQueryRepository {
    getCommentById(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield comment_entity_1.CommentModel.findById(id);
            if (!comment) {
                return null;
            }
            if (userId === undefined) {
                return (0, mapper_to_comment_output_res_dto_1.mapperToCommentOutputResDto)(comment, userId, comment_like_entity_1.LikeStatuses.None);
            }
            const userLike = yield comment_like_entity_1.CommentLikeModel.findOne({
                userId: userId,
                commentId: id,
            });
            if (!userLike) {
                return (0, mapper_to_comment_output_res_dto_1.mapperToCommentOutputResDto)(comment, userId, comment_like_entity_1.LikeStatuses.None);
            }
            return (0, mapper_to_comment_output_res_dto_1.mapperToCommentOutputResDto)(comment, userId, userLike.status);
        });
    }
    getCommentsForPostId(postId, queryInput, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield post_entity_1.PostModel.findById(postId);
            if (!post) {
                return null;
            }
            const { pageNumber, pageSize, sortBy, sortDirection } = queryInput;
            const skip = (0, skip_1.getSkipNumber)(pageNumber, pageSize);
            const filter = { postId: postId };
            const [comments, totalCount] = yield Promise.all([
                comment_entity_1.CommentModel.find(filter)
                    .skip(skip)
                    .limit(pageSize)
                    .sort({ [sortBy]: sortDirection }),
                comment_entity_1.CommentModel.countDocuments(filter),
            ]);
            let mappedComments = [];
            if (userId === undefined) {
                mappedComments = comments.map((comment) => (0, mapper_to_comment_output_res_dto_1.mapperToCommentOutputResDto)(comment, // живой документ, геттеры работают
                userId, comment_like_entity_1.LikeStatuses.None));
            }
            else {
                const likesArray = yield comment_like_entity_1.CommentLikeModel.find({
                    userId,
                    commentId: { $in: comments.map((c) => c._id.toString()) },
                });
                const likesByCommentId = new Map(likesArray.map((like) => [like.commentId, like.status]));
                mappedComments = comments.map((comment) => {
                    var _a;
                    return (0, mapper_to_comment_output_res_dto_1.mapperToCommentOutputResDto)(comment, // живой документ, геттеры работают
                    userId, (_a = likesByCommentId.get(comment.id)) !== null && _a !== void 0 ? _a : comment_like_entity_1.LikeStatuses.None);
                });
            }
            // const mappedComments = [];
            // for (const comment of comments) {
            //   const like = await CommentLikeModel.findOne({
            //     commentId: comment.id,
            //     userId: userId,
            //   });
            //   const likeStatus = like ? like.status : LikeStatuses.None;
            //   const trueComment = mapperToCommentOutputResDto(
            //     comment,
            //     userId,
            //     likeStatus,
            //   );
            //   mappedComments.push(trueComment);
            // }
            return (0, mapper_output_1.mapperOutput)(mappedComments, {
                pagesCount: Math.ceil(totalCount / queryInput.pageSize),
                page: queryInput.pageNumber,
                pageSize: queryInput.pageSize,
                totalCount: totalCount,
            });
        });
    }
};
exports.CommentsQueryRepository = CommentsQueryRepository;
exports.CommentsQueryRepository = CommentsQueryRepository = __decorate([
    (0, inversify_1.injectable)()
], CommentsQueryRepository);
