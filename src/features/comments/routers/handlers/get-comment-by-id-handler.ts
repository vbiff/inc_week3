import { container } from "../../../../composition-root";
import { HttpStatuses } from "../../../../core/types/http-statuses";
import { Request, Response } from "express";
import { CommentsQueryRepository } from "../../repositories/commentsQueryRepository";

const commentsQueryRepository = container.get(CommentsQueryRepository);

export async function getCommentByIdHandler(req: Request, res: Response) {
  const comment = await commentsQueryRepository.getCommentById(req.params.id);
  if (!comment) {
    res.sendStatus(HttpStatuses.NOT_FOUND_404);
    return;
  }
  res.status(HttpStatuses.OK_200).send(comment);
}
