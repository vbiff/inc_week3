import { HttpStatuses } from "../../../../core/types/http-statuses";
import { Request, Response } from "express";
import { CommentsQueryRepository } from "../../repositories/commentsQueryRepository";
import { inject, injectable } from "inversify";

@injectable()
export class GetCommentByIdHandler {
  constructor(
    @inject(CommentsQueryRepository)
    private commentsQueryRepository: CommentsQueryRepository,
  ) {}
  getCommentByIdHandler = async (req: Request, res: Response) => {
    const comment = await this.commentsQueryRepository.getCommentById(
      req.params.id,
      req.user?.id,
    );
    if (!comment) {
      res.sendStatus(HttpStatuses.NOT_FOUND_404);
      return;
    }
    res.status(HttpStatuses.OK_200).send(comment);
  };
}
