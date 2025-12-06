import {Router} from "express";
import {Video} from "../types/video";
import {HttpStatuses} from "../../core/types/http-statuses";
import {db} from "../../db/in-memory.db";

export const videosRouter = Router();

//videos
videosRouter.get("/", (req, res) => {
    res.status(HttpStatuses.OK_200).send(db.videos);
});

videosRouter.get("/:id", (req, res) => {
    const movie = db.videos.find((m) => m.id === +req.params.id);
    if (movie) {
        res.status(HttpStatuses.OK_200).send(movie);
        return;
    }
    res.sendStatus(404);
});

videosRouter.post("/", (req, res) => {
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

