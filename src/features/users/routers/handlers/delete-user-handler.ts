import { Request, Response } from "express";
import { ioc } from "../../../../composition-root";
import { UserRepository } from "../../repositories/user-repository-mongodb";

const userRepository = ioc.getInstance<UserRepository>(UserRepository);
import { HttpStatuses } from "../../../../core/types/http-statuses";

export async function deleteUserHandler(req: Request, res: Response) {
  const isDeleted = await userRepository.deleteUser(req.params.id);

  if (!isDeleted) {
    res.sendStatus(HttpStatuses.NOT_FOUND_404);
  }
  res.sendStatus(HttpStatuses.NO_CONTENT_204);
}
