import { commentsQueryRepository } from "../../repositories/commentsQueryRepository";
import { HttpStatuses } from "../../../../core/types/http-statuses";
import { Request, Response } from "express";

export async function getCommentByIdHandler(req: Request, res: Response) {
  const comment = await commentsQueryRepository.getCommentById(req.params.id);
  if (!comment) {
    res.sendStatus(HttpStatuses.NOT_FOUND_404);
    return;
  }
  res.status(HttpStatuses.OK_200).send(comment);
}
