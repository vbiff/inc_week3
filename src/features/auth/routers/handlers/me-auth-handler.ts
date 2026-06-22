import { Request, Response } from "express";
import { HttpStatuses } from "../../../../core/types/http-statuses";
import { userQueryRepository } from "../../../../composition-root";

export const meAuthHandler = async (req: Request, res: Response) => {
  const userId = req.user!.id;

  if (!userId) {
    res.sendStatus(HttpStatuses.UNAUTHORIZED_401);
  }
  const me = await userQueryRepository.findUserByIdForMe(userId);

  res.status(HttpStatuses.OK_200).send(me);
};
