import { Request, Response } from "express";
import { HttpStatuses } from "../../../../core/types/http-statuses";
import { userService } from "../../application/command-services/user-service";
import { userQueryRepositoryMongodb } from "../../repositories/user-query-repository-mongodb";
import { UserView } from "../../application/queries/dto/output-dto/user-view";

export async function createUserHandler(req: Request, res: Response) {
  const newUserId: string | null = await userService.createUser(req.body);

  if (!newUserId) {
    res.sendStatus(HttpStatuses.NOT_FOUND_404);
  }

  const newUser: UserView | null =
    await userQueryRepositoryMongodb.findUserById(newUserId!);

  if (!newUser) {
    res.sendStatus(HttpStatuses.NOT_FOUND_404);
  }

  res.status(HttpStatuses.CREATED_201).send(newUser);
}
