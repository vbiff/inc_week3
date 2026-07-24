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
exports.GetAllPostsForSpecificBlogIdHandler = void 0;
const posts_mongodb_query_repository_1 = require("../../../posts/repositories/posts.mongodb-query-repository");
const blogs_query_mongodb_repositories_1 = require("../../repositories/blogs.query-mongodb.repositories");
const http_statuses_1 = require("../../../../core/types/http-statuses");
const query_input_dto_helper_1 = require("../../../../core/helpers/query.input.dto.helper");
const inversify_1 = require("inversify");
let GetAllPostsForSpecificBlogIdHandler = class GetAllPostsForSpecificBlogIdHandler {
    constructor(postsQueryRepository, blogsQueryRepository) {
        this.postsQueryRepository = postsQueryRepository;
        this.blogsQueryRepository = blogsQueryRepository;
        this.getAllPostsForSpecificBlogIdHandler = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const queryInput = (0, query_input_dto_helper_1.queryInputDtoHelper)(req);
            const blog = yield this.blogsQueryRepository.findByObjectId(req.params.blogId);
            if (!blog) {
                res.sendStatus(http_statuses_1.HttpStatuses.NOT_FOUND_404);
                return;
            }
            const resultPosts = yield this.postsQueryRepository.findAllPostsByBlogId(req.params.blogId, queryInput);
            res.status(http_statuses_1.HttpStatuses.OK_200).send(resultPosts);
        });
    }
};
exports.GetAllPostsForSpecificBlogIdHandler = GetAllPostsForSpecificBlogIdHandler;
exports.GetAllPostsForSpecificBlogIdHandler = GetAllPostsForSpecificBlogIdHandler = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(posts_mongodb_query_repository_1.PostsQueryRepository)),
    __param(1, (0, inversify_1.inject)(blogs_query_mongodb_repositories_1.BlogsQueryRepository)),
    __metadata("design:paramtypes", [posts_mongodb_query_repository_1.PostsQueryRepository,
        blogs_query_mongodb_repositories_1.BlogsQueryRepository])
], GetAllPostsForSpecificBlogIdHandler);
