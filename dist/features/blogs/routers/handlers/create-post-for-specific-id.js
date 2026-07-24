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
exports.CreatePostForSpecificId = void 0;
const http_statuses_1 = require("../../../../core/types/http-statuses");
const posts_services_1 = require("../../../posts/application/command-services/posts-services");
const blogs_query_mongodb_repositories_1 = require("../../repositories/blogs.query-mongodb.repositories");
const posts_mongodb_query_repository_1 = require("../../../posts/repositories/posts.mongodb-query-repository");
const inversify_1 = require("inversify");
let CreatePostForSpecificId = class CreatePostForSpecificId {
    constructor(postsService, blogsQueryRepository, postsQueryRepository) {
        this.postsService = postsService;
        this.blogsQueryRepository = blogsQueryRepository;
        this.postsQueryRepository = postsQueryRepository;
        this.createPostForSpecificBlogIdHandler = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const blog = yield this.blogsQueryRepository.findByObjectId(req.params.blogId);
            if (!blog) {
                res.sendStatus(http_statuses_1.HttpStatuses.NOT_FOUND_404);
                return;
            }
            const newPostId = yield this.postsService.createPostForSpecificBlogId(req.body, req.params.blogId, blog.name);
            const newPost = yield this.postsQueryRepository.findByObjectId(newPostId.toString());
            if (!newPost) {
                res.sendStatus(http_statuses_1.HttpStatuses.NOT_FOUND_404);
                return;
            }
            res.status(http_statuses_1.HttpStatuses.CREATED_201).send(newPost);
        });
    }
};
exports.CreatePostForSpecificId = CreatePostForSpecificId;
exports.CreatePostForSpecificId = CreatePostForSpecificId = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(posts_services_1.PostsService)),
    __param(1, (0, inversify_1.inject)(blogs_query_mongodb_repositories_1.BlogsQueryRepository)),
    __param(2, (0, inversify_1.inject)(posts_mongodb_query_repository_1.PostsQueryRepository)),
    __metadata("design:paramtypes", [posts_services_1.PostsService,
        blogs_query_mongodb_repositories_1.BlogsQueryRepository,
        posts_mongodb_query_repository_1.PostsQueryRepository])
], CreatePostForSpecificId);
