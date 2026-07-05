import { UserInputDTO } from "../queries/dto/input-dto/user-input-dto";
import { UserRepository } from "../../repositories/user-repository-mongodb";
import { Argon2Service } from "../../../auth/adapters/argon2-service";
import { inject, injectable } from "inversify";

@injectable()
export class UserService {
  constructor(
    @inject(UserRepository) private userRepository: UserRepository,
    @inject(Argon2Service) private argon2Service: Argon2Service,
  ) {}

  async createUser(dto: UserInputDTO): Promise<string | null> {
    const { password } = dto;
    const passwordHash = await this.argon2Service.generateHash(password);

    const newUser = {
      ...dto,
      password: passwordHash,
      createdAt: new Date().toISOString(),
      emailConfirmation: {
        confirmationCode: `no code`,
        expirationDate: new Date(),
        isConfirmed: true,
      },
      passwordRecovery: {
        recoveryCode: null,
        expirationDate: null,
      },
    };

    return await this.userRepository.createUser(newUser);
  }

  async updateUserHash(userId: string, newHash: string): Promise<void> {
    await this.userRepository.updateHash(userId, newHash);
  }
}
