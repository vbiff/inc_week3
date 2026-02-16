import { Request, Response } from "express";
import { HttpStatuses } from "../../../../core/types/http-statuses";
import { userService, userQueryRepository } from "../../../../composition-root";
import { UserView } from "../../application/queries/dto/output-dto/user-view";

export async function createUserHandler(req: Request, res: Response) {
  const newUserId: string | null = await userService.createUser(req.body);

  if (!newUserId) {
    res.sendStatus(HttpStatuses.NOT_FOUND_404);
  }

  const newUser: UserView | null =
    await userQueryRepository.findUserById(newUserId!);

  if (!newUser) {
    res.sendStatus(HttpStatuses.NOT_FOUND_404);
  }

  res.status(HttpStatuses.CREATED_201).send(newUser);
}
