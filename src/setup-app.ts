import express, { Express } from "express";
import { testingRouter } from "./testing/routers/testing.router";
import { blogRouter } from "./features/blogs/routers/blogs.router";
import { postRouter } from "./features/posts/routers/posts.router";
import {
  AUTH_PATH,
  BLOGS_PATH,
  COMMENT_PATH,
  POSTS_PATH,
  TESTING_PATH,
  USERS_PATH,
} from "./core/paths/paths";
import { userRouter } from "./features/users/routers/users.router";
import { authRouter } from "./features/auth/routers/auth.router";
import { commentsRouter } from "./features/comments/routers/comment-router";
import cookieParser from "cookie-parser";
import { securityRouter } from "./features/security/routers/security.router";

export const setupApp = (app: Express): void => {
  app.set("trust proxy", true);
  app.use(express.json());

  app.use(cookieParser());

  app.get("/", (req, res) => {
    res.status(200).send("Welcome!!!");
  });

  app.use(TESTING_PATH, testingRouter);
  app.use(BLOGS_PATH, blogRouter);
  app.use(POSTS_PATH, postRouter);
  app.use(USERS_PATH, userRouter);
  app.use(AUTH_PATH, authRouter);
  app.use(COMMENT_PATH, commentsRouter);
  app.use(" /security/devices", securityRouter);
};
