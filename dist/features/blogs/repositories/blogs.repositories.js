"use strict";
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
exports.blogsRepository = void 0;
const in_memory_db_1 = require("../../../db/in-memory.db");
exports.blogsRepository = {
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return in_memory_db_1.db.blogs;
        });
    },
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            return (_a = in_memory_db_1.db.blogs.find((blog) => blog.id === id)) !== null && _a !== void 0 ? _a : null;
        });
    },
    createBlog(inputBlog) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBlog = Object.assign(Object.assign({}, inputBlog), { id: new Date().toISOString(), createdAt: new Date().toISOString(), isMembership: false });
            in_memory_db_1.db.blogs.push(newBlog);
            return newBlog;
        });
    },
    updateBlog(dto, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = in_memory_db_1.db.blogs.find((blog) => blog.id === id);
            if (!blog) {
                throw new Error("blog does not exist");
            }
            blog.name = dto.name;
            blog.description = dto.description;
            blog.websiteUrl = dto.websiteUrl;
            return;
        });
    },
    deleteBlog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogIndex = in_memory_db_1.db.blogs.findIndex((m) => m.id === id);
            if (blogIndex === -1) {
                throw new Error("blog not found");
            }
            in_memory_db_1.db.blogs.splice(blogIndex, 1);
            return;
        });
    },
};
