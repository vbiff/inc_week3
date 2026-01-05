import { ObjectId } from "mongodb";
import { UserInputDTO } from "../queries/dto/input-dto/user-input-dto";
import { userRepository } from "../../repositories/user-repository-mongodb";
import { argon2Service } from "../../../auth/helpers/argon2-service";

export const userService = {
  async createUser(dto: UserInputDTO): Promise<ObjectId | null> {
    const { password } = dto;
    const passwordHash = await argon2Service.generateHash(password);

    const newUser = {
      ...dto,
      password: passwordHash,
      createdAt: new Date().toISOString(),
    };

    return await userRepository.createUser(newUser);
  },

  async updateUserHash(userId: string, newHash: string): Promise<void> {
    await userRepository.updateHash(userId, newHash);
  },
};
