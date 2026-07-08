import { Request, Response } from "express";
import { HttpStatuses } from "../../../../core/types/http-statuses";
import { UserView } from "../../application/queries/dto/output-dto/user-view";
import { UserService } from "../../application/command-services/user-service";
import { UserQueryRepository } from "../../repositories/user-query-repository-mongodb";
import { inject, injectable } from "inversify";

@injectable()
export class CreateUserHandler {
  constructor(
    @inject(UserService) private userService: UserService,
    @inject(UserQueryRepository)
    private userQueryRepository: UserQueryRepository,
  ) {}

  createUserHandler = async (req: Request, res: Response) => {
    const newUserId: string | null = await this.userService.createUser(
      req.body,
    );

    if (!newUserId) {
      res.sendStatus(HttpStatuses.NOT_FOUND_404);
    }

    const newUser: UserView | null =
      await this.userQueryRepository.findUserById(newUserId!);

    if (!newUser) {
      res.sendStatus(HttpStatuses.NOT_FOUND_404);
    }

    res.status(HttpStatuses.CREATED_201).send(newUser);
  };
}
