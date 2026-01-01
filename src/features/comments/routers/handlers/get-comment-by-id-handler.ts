import { commentsQueryRepository } from "../../repositories/commentsQueryRepository";
import { HttpStatuses } from "../../../../core/types/http-statuses";
import { Request, Response } from "express";
import { userQueryRepositoryMongodb } from "../../../users/repositories/user-query-repository-mongodb";

export async function getCommentByIdHandler(req: Request, res: Response) {
  //get user info
  const userInfo = await userQueryRepositoryMongodb.findUserByIdForMe(
    req.user!.id,
  );
  const comment = await commentsQueryRepository.getCommentById(
    req.params.id,
    userInfo!,
  );
  if (!comment) {
    res.sendStatus(HttpStatuses.NOT_FOUND_404);
    return;
  }
  res.status(HttpStatuses.OK_200).send(comment);
}
