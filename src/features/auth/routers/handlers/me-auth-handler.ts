import { Request, Response } from "express";
import { HttpStatuses } from "../../../../core/types/http-statuses";
import { UserQueryRepository } from "../../../users/repositories/user-query-repository-mongodb";
import { inject, injectable } from "inversify";

@injectable()
export class MeAuthHandler {
  constructor(
    @inject(UserQueryRepository) private userQueryRepository: UserQueryRepository,
  ) {}
  meAuthHandler = async (req: Request, res: Response) => {
    const userId = req.user!.id;

    if (!userId) {
      res.sendStatus(HttpStatuses.UNAUTHORIZED_401);
    }
    const me = await this.userQueryRepository.findUserByIdForMe(userId);

    res.status(HttpStatuses.OK_200).send(me);
  };
}
