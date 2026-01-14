import { UserInputDTO } from "../queries/dto/input-dto/user-input-dto";
import { userRepository } from "../../repositories/user-repository-mongodb";
import { argon2Service } from "../../../auth/adapters/argon2-service";

export const userService = {
  async createUser(dto: UserInputDTO): Promise<string | null> {
    const { password } = dto;
    const passwordHash = await argon2Service.generateHash(password);

    const newUser = {
      ...dto,
      password: passwordHash,
      createdAt: new Date().toISOString(),
      emailConfirmation: {
        confirmationCode: `no code`,
        expirationDate: new Date(),
        isConfirmed: true,
      },
    };

    return await userRepository.createUser(newUser);
  },

  async updateUserHash(userId: string, newHash: string): Promise<void> {
    await userRepository.updateHash(userId, newHash);
  },
};
