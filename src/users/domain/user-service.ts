import { ObjectId } from "mongodb";
import { UserInputDTO } from "../dto/input-dto/user-input-dto";
import { userRepository } from "../repositories/user-repository-mongodb";

export const userService = {
  async createUser(dto: UserInputDTO): Promise<ObjectId | null> {
    const newUser = {
      ...dto,
      createdAt: new Date().toISOString(),
    };

    return await userRepository.createUser(newUser);
  },
};
