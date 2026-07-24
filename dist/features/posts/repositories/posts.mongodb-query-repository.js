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
exports.PostsQueryRepository = void 0;
const mapper_post_1 = require("../mappers/mapper-post");
const mapper_output_1 = require("../../../core/mappers/mapper-output");
const skip_1 = require("../../../core/utils/skip");
const inversify_1 = require("inversify");
const post_entity_1 = require("../domain/post_entity");
let PostsQueryRepository = class PostsQueryRepository {
    findAll(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pageNumber, pageSize, sortBy, sortDirection } = query;
            const skip = (0, skip_1.getSkipNumber)(pageNumber, pageSize);
            const posts = yield post_entity_1.PostModel.find({})
                .sort({ [sortBy]: sortDirection })
                .skip(skip)
                .limit(pageSize);
            const totalCount = yield post_entity_1.PostModel.countDocuments({});
            const mappedPosts = posts.map((post) => (0, mapper_post_1.mapperPost)(post));
            return (0, mapper_output_1.mapperOutput)(mappedPosts, {
                pagesCount: Math.ceil(totalCount / pageSize),
                page: pageNumber,
                pageSize: pageSize,
                totalCount: totalCount,
            });
        });
    }
    findByObjectId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield post_entity_1.PostModel.findById(id);
            if (!post) {
                return null;
            }
            return (0, mapper_post_1.mapperPost)(post);
        });
    }
    findAllPostsByBlogId(blogId, queryInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pageNumber, pageSize, sortBy, sortDirection } = queryInput;
            const skip = (0, skip_1.getSkipNumber)(pageNumber, pageSize);
            const filter = { blogId: blogId };
            const posts = yield post_entity_1.PostModel.find(filter)
                .skip(skip)
                .limit(pageSize)
                .sort({ [sortBy]: sortDirection });
            const totalCount = yield post_entity_1.PostModel.countDocuments(filter);
            const mappedPosts = posts.map((post) => (0, mapper_post_1.mapperPost)(post));
            return (0, mapper_output_1.mapperOutput)(mappedPosts, {
                pagesCount: Math.ceil(totalCount / queryInput.pageSize),
                page: queryInput.pageNumber,
                pageSize: queryInput.pageSize,
                totalCount: totalCount,
            });
        });
    }
};
exports.PostsQueryRepository = PostsQueryRepository;
exports.PostsQueryRepository = PostsQueryRepository = __decorate([
    (0, inversify_1.injectable)()
], PostsQueryRepository);
