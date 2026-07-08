import { Request, Response } from "express";
import { UserQueryRepository } from "../../repositories/user-query-repository-mongodb";
import { PaginationAndSortingReq } from "../../../../core/types/pagination-and-sorting-req";
import { queryInputDtoHelper } from "../../../../core/helpers/query.input.dto.helper";
import { ResultUsersOutputDto } from "../../application/queries/dto/output-dto/result-users-output-dto";
import { inject, injectable } from "inversify";

@injectable()
export class GetAllUsersHandler {
  constructor(
    @inject(UserQueryRepository)
    private userQueryRepository: UserQueryRepository,
  ) {}

  getAllUsersHandler = async (req: Request, res: Response) => {
    const queryInput: PaginationAndSortingReq = queryInputDtoHelper(req);

    const Users: ResultUsersOutputDto =
      await this.userQueryRepository.getAllUsers(queryInput);

    res.send(Users);
  };
}
