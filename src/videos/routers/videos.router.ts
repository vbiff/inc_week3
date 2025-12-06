import { Router, Request, Response } from "express";
import { Video } from "../types/video";
import { HttpStatuses } from "../../core/types/http-statuses";
import { db } from "../../db/in-memory.db";
import { videoInputDto } from "../dto/video.input-dto";
import {videoInputDtoValidation} from "../validation/videoInputDtoValidation";
import {ValidationError} from "../types/validationError";
import {createErrorMessage} from "../../core/utils/error.utils";
import {videoUpdateDtoValidation} from "../validation/videoUpdateDtoValidation";

export const videosRouter = Router();

//all videos
videosRouter.get("/", (req: Request, res: Response) => {
  res.status(HttpStatuses.OK_200).send(db.videos);
});

// get by id
videosRouter.get("/:id", (req: Request, res: Response) => {
  const movie = db.videos.find((m) => m.id === +req.params.id);
  if (!movie) {
    res.status(HttpStatuses.NOT_FOUND_404);
    return;
  }

  res.status(HttpStatuses.OK_200).send(movie);
});

// create video

const addOneDayToDate = (date : Date) => {
    date.setDate(date.getDate() + 1)
    return date
}
videosRouter.post("/", (req: Request<videoInputDto>, res: Response) => {
    const errors: ValidationError[] = videoInputDtoValidation(req.body)
  if (errors.length > 0) {
    res.status(HttpStatuses.BAD_REQUEST_400)
        .send(createErrorMessage(errors));
    return;
  }
      const creationDate: Date= new Date();
  const newVideo: Video = {
    availableResolutions: req.body.availableResolutions,
    canBeDownloaded: true,
    createdAt: creationDate.toISOString(),
    minAgeRestriction: null,
    publicationDate: addOneDayToDate(creationDate).toISOString(),
    id: +new Date(),
    title: req.body.title,
    author: req.body.author,
  };

  db.videos.push(newVideo);
  res.status(HttpStatuses.CREATED_201).send(newVideo);
});

// update video
videosRouter.put("/:id", (req: Request, res: Response) => {
    const errors: ValidationError[] = videoUpdateDtoValidation(req.body)
    if (errors.length > 0) {
        res.status(HttpStatuses.BAD_REQUEST_400)
            .send(createErrorMessage(errors));
        return;
    }
  const movieIndex = db.videos.findIndex((m) => m.id === +req.params.id);
  if (!movieIndex) {
    res.status(HttpStatuses.NOT_FOUND_404);
    return;
  }

  if (req.body.author) {
    db.videos[movieIndex].author = req.body.author;
  }
  if (req.body.title) {
    db.videos[movieIndex].title = req.body.title;
  }
  if (req.body.availableResolutions) {
    db.videos[movieIndex].availableResolutions = req.body.availableResolutions;
  }
  if (req.body.canBeDownloaded) {
    db.videos[movieIndex].canBeDownloaded = req.body.canBeDownloaded;
  }
  if (req.body.minAgeRestriction) {
    db.videos[movieIndex].minAgeRestriction = req.body.minAgeRestriction;
  }
  if (req.body.publicationDate) {
    db.videos[movieIndex].publicationDate = req.body.publicationDate;
  }

  res.sendStatus(HttpStatuses.NO_CONTENT_204);
});

// delete video by id
videosRouter.delete("/:id", (req: Request, res: Response) => {
  const movieIndex = db.videos.findIndex((m) => m.id === +req.params.id);
  if (!movieIndex) {
    res.status(HttpStatuses.NOT_FOUND_404);
    return;
  }
  db.videos.splice(movieIndex, 1);
  res.sendStatus(HttpStatuses.NO_CONTENT_204);
});
