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
exports.PostsRepository = void 0;
const post_entity_1 = require("../domain/post_entity");
const blog_entity_1 = require("../../blogs/domain/blog_entity");
const mongodb_1 = require("mongodb");
const inversify_1 = require("inversify");
let PostsRepository = class PostsRepository {
    createPost(inputPost) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = post_entity_1.PostEntity.createPost(inputPost);
            const created = yield post_entity_1.PostModel.create(post);
            // mongoose bundles its own mongodb/bson dependency, so its ObjectId is
            // nominally distinct from the one used everywhere else in this codebase.
            return new mongodb_1.ObjectId(created._id.toString());
        });
    }
    updatePost(dto, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield blog_entity_1.BlogModel.findById(dto.blogId);
            if (!blog) {
                throw new Error("blog not found");
            }
            const post = yield post_entity_1.PostModel.findById(id);
            if (!post) {
                return null;
            }
            post.updatePost(dto, blog.name);
            yield post.save();
            return;
        });
    }
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield post_entity_1.PostModel.deleteOne({ _id: id });
            return result.deletedCount === 1;
        });
    }
};
exports.PostsRepository = PostsRepository;
exports.PostsRepository = PostsRepository = __decorate([
    (0, inversify_1.injectable)()
], PostsRepository);
