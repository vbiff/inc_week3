import express, { Express } from "express";
import { testingRouter } from "./testing/routers/testing.router";
import { videosRouter } from "./videos/routers/videos.router";
import { blogRouter } from "./blogs/routers/blogs.router";

export const setupApp = (app: Express): void => {
  app.use(express.json());

  app.get("/", (req, res) => {
    res.status(200).send("Welcome!!!");
  });

  app.use("/testing", testingRouter);
  app.use("/videos", videosRouter);
  app.use("/blogs", blogRouter);
};
