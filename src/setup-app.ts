import express, { Express } from "express";
import { HttpStatuses } from "./core/types/http-statuses";
import { db } from "./db/in-memory.db";
import { Video } from "./videos/types/video";

export const setupApp = (app: Express): void => {
  app.use(express.json());

  app.get("/", (req, res) => {
    res.status(200).send("Welcome!!!");
  });

  //videos
  app.get("/videos", (req, res) => {
    res.status(HttpStatuses.OK_200).send(db.videos);
  });

  app.get("/videos/:id", (req, res) => {
    const movie = db.videos.find((m) => m.id === +req.params.id);
    if (movie) {
      res.status(HttpStatuses.OK_200).send(movie);
      return;
    }
    res.sendStatus(404);
  });

  app.post("/videos", (req, res) => {
    console.log(req.body);
    if (!req.body.title) {
      res.sendStatus(HttpStatuses.NOT_FOUND_404);
      return;
    }

    const newVideo: Video = {
      availableResolutions: req.body.availableResolutions,
      canBeDownloaded: false,
      createdAt: new Date(),
      minAgeRestriction: null,
      publicationDate: new Date(),
      id: +new Date(),
      title: req.body.title,
      author: req.body.author,
    };

    db.videos.push(newVideo);
    res.status(HttpStatuses.CREATED_201).send(newVideo);
  });

  app.delete("/testing/all-data", (req, res) => {
    db.videos = [];
    res.sendStatus(HttpStatuses.NO_CONTENT_204);
  });
};
