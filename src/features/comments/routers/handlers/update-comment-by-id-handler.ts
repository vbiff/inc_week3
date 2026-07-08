import { ResultStatus } from "../../../../core/result/resultCode";
import { HttpStatuses } from "../../../../core/types/http-statuses";
import { resultCodeToHttpException } from "../../../../core/result/resultCodeToHttpException";
import { Request, Response } from "express";
import { Result } from "../../../../core/result/resultType";
import { CommentService } from "../../application/command-service/comment-service";
import { inject, injectable } from "inversify";

@injectable()
export class UpdateCommentByIdHandler {
  constructor(@inject(CommentService) private commentService: CommentService) {}
  updateCommentByIdHandler = async (req: Request, res: Response) => {
    const result: Result = await this.commentService.updateComment(
      req.params.commentId,
      req.body.content,
      req.user!.id,
    );
    if (result.status === ResultStatus.Success) {
      res.sendStatus(HttpStatuses.NO_CONTENT_204);
      return;
    }

    res.sendStatus(resultCodeToHttpException(result.status));
  };
}
