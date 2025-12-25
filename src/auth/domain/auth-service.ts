import { AuthInputDTO } from "../dto/auth-input-dto/auth-input-dto";
import { userRepository } from "../../users/repositories/user-repository-mongodb";
import { bcryptService } from "../helpers/bcrypt-service";

export const authService = {
  async login(input: AuthInputDTO): Promise<boolean> {
    const { password, loginOrEmail } = input;

    const user = await userRepository.findUserByLoginOrEmail(loginOrEmail);

    if (!user) {
      return false;
    }

    return await bcryptService.comparePassword(password, user.password);
  },
};
