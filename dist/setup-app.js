"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupApp = void 0;
const express_1 = __importDefault(require("express"));
const testing_router_1 = require("./testing/routers/testing.router");
const blogs_router_1 = require("./features/blogs/routers/blogs.router");
const posts_router_1 = require("./features/posts/routers/posts.router");
const paths_1 = require("./core/paths/paths");
const users_router_1 = require("./features/users/routers/users.router");
const auth_router_1 = require("./features/auth/routers/auth.router");
const comment_router_1 = require("./features/comments/routers/comment-router");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const security_router_1 = require("./features/security/routers/security.router");
const setupApp = (app) => {
    app.set("trust proxy", true);
    app.use(express_1.default.json());
    app.use((0, cookie_parser_1.default)());
    app.get("/", (req, res) => {
        res.status(200).send("Welcome!!!");
    });
    app.use(paths_1.TESTING_PATH, testing_router_1.testingRouter);
    app.use(paths_1.BLOGS_PATH, blogs_router_1.blogRouter);
    app.use(paths_1.POSTS_PATH, posts_router_1.postRouter);
    app.use(paths_1.USERS_PATH, users_router_1.userRouter);
    app.use(paths_1.AUTH_PATH, auth_router_1.authRouter);
    app.use(paths_1.COMMENT_PATH, comment_router_1.commentsRouter);
    app.use("/security/devices", security_router_1.securityRouter);
};
exports.setupApp = setupApp;
