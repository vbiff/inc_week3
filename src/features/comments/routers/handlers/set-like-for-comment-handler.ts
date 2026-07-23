import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { Result } from "../../../../core/result/resultType";
import { ResultStatus } from "../../../../core/result/resultCode";
import { HttpStatuses } from "../../../../core/types/http-statuses";
import { resultCodeToHttpException } from "../../../../core/result/resultCodeToHttpException";
import { CommentLikeService } from "../../application/command-service/comment-like-service";

@injectable()
export class SetLikeForCommentHandler {
  constructor(
    @inject(CommentLikeService) private commentLikeService: CommentLikeService,
  ) {}
  setLikeForCommentByIdHandler = async (req: Request, res: Response) => {
    const result: Result = await this.commentLikeService.setLike(
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
