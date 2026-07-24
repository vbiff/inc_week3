"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapBlogs = mapBlogs;
function mapBlogs(blogs) {
    return {
        id: blogs._id.toString(),
        name: blogs.name,
        description: blogs.description,
        websiteUrl: blogs.websiteUrl,
        createdAt: blogs.createdAt,
        isMembership: blogs.isMembership,
    };
}
