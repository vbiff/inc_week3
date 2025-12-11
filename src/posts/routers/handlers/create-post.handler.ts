
import { HttpStatuses } from "../../../core/types/http-statuses";
import { Request, Response } from "express";
import {postsRepository} from "../../repositories/posts.repositories";

export function createPostHandler(req: Request, res: Response) {
    const newBlog = postsRepository.createPost(req.body);
    res.status(HttpStatuses.CREATED_201).send(newBlog);
}
