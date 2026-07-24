"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapperPost = mapperPost;
function mapperPost(post) {
    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
    };
}
