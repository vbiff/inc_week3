import { Request, Response } from "express";
import { UserQueryRepository } from "../../repositories/user-query-repository-mongodb";
import { HttpStatuses } from "../../../../core/types/http-statuses";
import { inject, injectable } from "inversify";

@injectable()
export class GetUserHandler {
  constructor(
    @inject(UserQueryRepository)
    private userQueryRepository: UserQueryRepository,
  ) {}

  getUserHandler = async (req: Request, res: Response) => {
    const user = await this.userQueryRepository.findUserById(req.params.id);

    if (!user) {
      res.sendStatus(HttpStatuses.NOT_FOUND_404);
    }
    res.status(HttpStatuses.OK_200).send(user);
  };
}
