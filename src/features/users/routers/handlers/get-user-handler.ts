import { Request, Response } from "express";
import { userQueryRepository } from "../../../../composition-root";
import { HttpStatuses } from "../../../../core/types/http-statuses";

export async function getUserHandler(req: Request, res: Response) {
  const user = await userQueryRepository.findUserById(req.params.id);

  if (!user) {
    res.sendStatus(HttpStatuses.NOT_FOUND_404);
  }
  res.status(HttpStatuses.OK_200).send(user);
}
