import { Request, Response } from "express";
import { ResultCommentsOutputDto } from "../../application/queries/dto/output-dto/result-comments-output-dto";
import { CommentsQueryRepository } from "../../../comments/repositories/commentsQueryRepository";
import { HttpStatuses } from "../../../../core/types/http-statuses";
import { PaginationAndSortingReq } from "../../../../core/types/pagination-and-sorting-req";
import { queryInputDtoHelper } from "../../../../core/helpers/query.input.dto.helper";
import { inject, injectable } from "inversify";

@injectable()
export class GetCommentsForPostIdHandler {
  constructor(
    @inject(CommentsQueryRepository)
    private commentsQueryRepository: CommentsQueryRepository,
  ) {}

  getCommentsForPostIdHandler = async (req: Request, res: Response) => {
    const queryInput: PaginationAndSortingReq = queryInputDtoHelper(req);

    //1 request to Query repo
    const result: ResultCommentsOutputDto | null =
      await this.commentsQueryRepository.getCommentsForPostId(
        req.params.postId,
        queryInput,
      );

    if (!result) {
      res.sendStatus(HttpStatuses.NOT_FOUND_404);
    }
    res.status(HttpStatuses.OK_200).send(result);
  };
}
