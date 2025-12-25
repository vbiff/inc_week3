import { ObjectId } from "mongodb";
import { UserInputDTO } from "../dto/input-dto/user-input-dto";
import { userRepository } from "../repositories/user-repository-mongodb";
import { bcryptService } from "../../auth/helpers/bcrypt-service";

export const userService = {
  async createUser(dto: UserInputDTO): Promise<ObjectId | null> {
    const { password } = dto;
    const passwordHash = await bcryptService.generateHash(password);

    const newUser = {
      ...dto,
      password: passwordHash,
      createdAt: new Date().toISOString(),
    };

    return await userRepository.createUser(newUser);
  },
};
