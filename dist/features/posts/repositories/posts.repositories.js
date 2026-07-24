"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRepository = void 0;
const in_memory_db_1 = require("../../../db/in-memory.db");
exports.postsRepository = {
    findAll() {
        return in_memory_db_1.db.posts;
    },
    findById(id) {
        var _a;
        return (_a = in_memory_db_1.db.posts.find((post) => post.id === id)) !== null && _a !== void 0 ? _a : null;
    },
    createPost(inputPost) {
        const blog = in_memory_db_1.db.blogs.find((blog) => blog.id === inputPost.blogId);
        if (!blog) {
            throw new Error("blog not found");
        }
        const newPost = Object.assign(Object.assign({}, inputPost), { id: new Date().toISOString(), blogName: blog.name, createdAt: new Date().toISOString() });
        in_memory_db_1.db.posts.push(newPost);
        return newPost;
    },
    updatePost(dto, id) {
        const post = in_memory_db_1.db.posts.find((post) => post.id === id);
        if (!post) {
            throw new Error("blog does not exist");
        }
        const blog = in_memory_db_1.db.blogs.find((blog) => blog.id === dto.blogId);
        if (!blog) {
            throw new Error("blog not found");
        }
        post.title = dto.title;
        post.shortDescription = dto.shortDescription;
        post.content = dto.content;
        post.blogId = dto.blogId;
        post.blogName = blog.name;
        return;
    },
    deletePost(id) {
        const postIndex = in_memory_db_1.db.posts.findIndex((m) => m.id === id);
        if (postIndex === -1) {
            throw new Error("blog not found");
        }
        in_memory_db_1.db.posts.splice(postIndex, 1);
        return;
    },
};
