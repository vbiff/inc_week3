"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostModel = exports.PostSchema = exports.PostEntity = void 0;
const mongoose_1 = require("mongoose");
class PostEntity {
    constructor(title, shortDescription, content, blogId, blogName, createdAt) {
        this.title = title;
        this.shortDescription = shortDescription;
        this.content = content;
        this.blogId = blogId;
        this.blogName = blogName;
        this.createdAt = createdAt;
    }
    static createPost(dto) {
        return new PostEntity(dto.title, dto.shortDescription, dto.content, dto.blogId, dto.blogName, dto.createdAt);
    }
    updatePost(dto, blogName) {
        this.title = dto.title;
        this.shortDescription = dto.shortDescription;
        this.content = dto.content;
        this.blogId = dto.blogId;
        this.blogName = blogName;
    }
}
exports.PostEntity = PostEntity;
exports.PostSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    content: { type: String, required: true },
    blogId: { type: String, required: true },
    blogName: { type: String, required: true },
    createdAt: { type: String, required: true },
});
exports.PostSchema.loadClass(PostEntity);
exports.PostModel = (0, mongoose_1.model)("Post", exports.PostSchema);
