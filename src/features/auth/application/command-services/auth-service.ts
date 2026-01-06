import { AuthInputDTO } from "../queries/dto/auth-input-dto/auth-input-dto";
import { userRepository } from "../../../users/repositories/user-repository-mongodb";
import { Result } from "../../../../core/result/resultType";
import { ResultStatus } from "../../../../core/result/resultCode";
import { UserCreateDto } from "../../../users/application/queries/dto/input-dto/user-create-dto";
import { WithId } from "mongodb";
import { jwtService } from "../../helpers/jwt-service";
import { argon2Service } from "../../helpers/argon2-service";
import { userService } from "../../../users/application/command-services/user-service";

export const authService = {
  async login(
    input: AuthInputDTO,
  ): Promise<Result<{ accessToken: string } | null>> {
    const result = await this.checkUserCredentials(input);
    if (result.status !== ResultStatus.Success)
      return {
        status: result.status,
        errorMessage: result.errorMessage,
        extensions: result.extensions,
        data: null,
      };
    const accessToken = await jwtService.createToken(
      result.data!._id.toString(),
    );

    return {
      status: ResultStatus.Success,
      data: { accessToken },
      extensions: [],
    };
  },

  async checkUserCredentials(
    input: AuthInputDTO,
  ): Promise<Result<WithId<UserCreateDto> | null>> {
    const { password, loginOrEmail } = input;

    const user: WithId<UserCreateDto> | null =
      await userRepository.findUserByLoginOrEmail(loginOrEmail);

    if (!user) {
      return {
        status: ResultStatus.Unauthorized,
        data: null,
        errorMessage: "Not Authorized",
        extensions: [{ field: "loginOrEmail", message: "Not Found" }],
      };
    }

    const isPassCorrect = await argon2Service.comparePassword(
      password,
      user.password,
    );
    if (!isPassCorrect) {
      return {
        status: ResultStatus.Unauthorized,
        data: null,
        errorMessage: "Not Authorized",
        extensions: [{ field: "password", message: "Not correct" }],
      };
    }
    const newHash = await argon2Service.reHash(password, user.password);
    if (newHash) {
      await userService.updateUserHash(user._id.toString(), newHash);
    }

    return {
      status: ResultStatus.Success,
      data: user,
      extensions: [],
    };
  },
};
