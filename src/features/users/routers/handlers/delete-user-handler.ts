import { Request, Response } from "express";
import { UserRepository } from "../../repositories/user-repository-mongodb";
import { HttpStatuses } from "../../../../core/types/http-statuses";
import { inject, injectable } from "inversify";

@injectable()
export class DeleteUserHandler {
  constructor(@inject(UserRepository) private userRepository: UserRepository) {}

  deleteUserHandler = async (req: Request, res: Response) => {
    const isDeleted = await this.userRepository.deleteUser(req.params.id);

    if (!isDeleted) {
      res.sendStatus(HttpStatuses.NOT_FOUND_404);
    }
    res.sendStatus(HttpStatuses.NO_CONTENT_204);
  };
}
