import { Request, Response } from "express";
import { userQueryRepository } from "../../../../composition-root";
import { PaginationAndSortingReq } from "../../../../core/types/pagination-and-sorting-req";
import { queryInputDtoHelper } from "../../../../core/helpers/query.input.dto.helper";
import { ResultUsersOutputDto } from "../../application/queries/dto/output-dto/result-users-output-dto";

export async function getAllUsersHandler(req: Request, res: Response) {
  const queryInput: PaginationAndSortingReq = queryInputDtoHelper(req);

  const Users: ResultUsersOutputDto =
    await userQueryRepository.getAllUsers(queryInput);

  res.send(Users);
}
