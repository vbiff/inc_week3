import { Request, Response } from "express";
import { HttpStatuses } from "../../../../core/types/http-statuses";
import { ioc } from "../../../../composition-root";
import { UserQueryRepository } from "../../../users/repositories/user-query-repository-mongodb";

const userQueryRepository =
  ioc.getInstance<UserQueryRepository>(UserQueryRepository);

export const meAuthHandler = async (req: Request, res: Response) => {
  const userId = req.user!.id;

  if (!userId) {
    res.sendStatus(HttpStatuses.UNAUTHORIZED_401);
  }
  const me = await userQueryRepository.findUserByIdForMe(userId);

  res.status(HttpStatuses.OK_200).send(me);
};
