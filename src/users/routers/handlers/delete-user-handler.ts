import { Request, Response } from "express";
import { userRepository } from "../../repositories/user-repository-mongodb";
import { HttpStatuses } from "../../../core/types/http-statuses";

export async function deleteUserHandler(req: Request, res: Response) {
  const isDeleted = await userRepository.deleteUser(req.params.id);

  if (!isDeleted) {
    res.sendStatus(HttpStatuses.NOT_FOUND_404);
  }
  res.sendStatus(HttpStatuses.NO_CONTENT_204);
}
