import { Request, Response } from "express";
import { ioc } from "../../../../composition-root";
import { UserQueryRepository } from "../../repositories/user-query-repository-mongodb";

const userQueryRepository =
  ioc.getInstance<UserQueryRepository>(UserQueryRepository);
import { HttpStatuses } from "../../../../core/types/http-statuses";

export async function getUserHandler(req: Request, res: Response) {
  const user = await userQueryRepository.findUserById(req.params.id);

  if (!user) {
    res.sendStatus(HttpStatuses.NOT_FOUND_404);
  }
  res.status(HttpStatuses.OK_200).send(user);
}
