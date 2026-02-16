import { Request, Response } from "express";
import { commentsQueryRepository } from "../../../../composition-root";
import { ResultCommentsOutputDto } from "../../application/queries/dto/output-dto/result-comments-output-dto";
import { HttpStatuses } from "../../../../core/types/http-statuses";
import { PaginationAndSortingReq } from "../../../../core/types/pagination-and-sorting-req";
import { queryInputDtoHelper } from "../../../../core/helpers/query.input.dto.helper";

export async function getCommentsForPostIdHandler(req: Request, res: Response) {
  const queryInput: PaginationAndSortingReq = queryInputDtoHelper(req);

  //1 request to Query repo
  const result: ResultCommentsOutputDto | null =
    await commentsQueryRepository.getCommentsForPostId(
      req.params.postId,
      queryInput,
    );

  if (!result) {
    res.sendStatus(HttpStatuses.NOT_FOUND_404);
  }
  res.status(HttpStatuses.OK_200).send(result);
}
