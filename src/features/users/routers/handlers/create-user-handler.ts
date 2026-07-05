import { Request, Response } from "express";
import { HttpStatuses } from "../../../../core/types/http-statuses";
import { ioc } from "../../../../composition-root";
import { UserView } from "../../application/queries/dto/output-dto/user-view";
import { UserService } from "../../application/command-services/user-service";
import { UserQueryRepository } from "../../repositories/user-query-repository-mongodb";

const userService = ioc.getInstance<UserService>(UserService);
const userQueryRepository =
  ioc.getInstance<UserQueryRepository>(UserQueryRepository);

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
