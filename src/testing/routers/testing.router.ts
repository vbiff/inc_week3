import {Router} from "express";
import {db} from "../../db/in-memory.db";
import {HttpStatuses} from "../../core/types/http-statuses";

export const testingRouter = Router({});

testingRouter.delete("/all-data", (req, res) => {
    db.videos = [];
    res.sendStatus(HttpStatuses.NO_CONTENT_204);
});