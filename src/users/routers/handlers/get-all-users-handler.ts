import { Request, Response } from "express";
import { userQueryRepositoryMongodb } from "../../repositories/user-query-repository-mongodb";
import { PaginationAndSortingReq } from "../../../core/types/pagination-and-sorting-req";
import { queryInputDtoHelper } from "../../../core/helpers/query.input.dto.helper";
import { ResultUsersOutputDto } from "../../dto/output-dto/result-users-output-dto";

export async function getAllUsersHandler(req: Request, res: Response) {
  const queryInput: PaginationAndSortingReq = queryInputDtoHelper(req);
  const Users: ResultUsersOutputDto =
    await userQueryRepositoryMongodb.getAllUsers(queryInput);

  res.send(Users);
}
