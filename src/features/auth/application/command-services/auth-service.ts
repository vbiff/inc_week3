import { AuthInputDTO } from "../queries/dto/auth-input-dto/auth-input-dto";
import { userRepository } from "../../../users/repositories/user-repository-mongodb";
import { bcryptService } from "../../helpers/bcrypt-service";
import { Result } from "../../../../core/result/resultType";
import { ResultStatus } from "../../../../core/result/resultCode";
import { UserCreateDto } from "../../../users/application/queries/dto/input-dto/user-create-dto";
import { WithId } from "mongodb";
import { jwtService } from "../../helpers/jwt-service";

export const authService = {
  async login(
    input: AuthInputDTO,
  ): Promise<Result<{ accessToken: string } | null>> {
    const result = await this.checkUserCredentials(input);
    if (result.status !== ResultStatus.Success)
      return {
        status: ResultStatus.Unauthorized,
        errorMessage: "Unauthorized",
        extensions: [{ field: "loginOrEmail", message: "Wrong credentials" }],
        data: null,
      };
    const accessToken = await jwtService.createToken(
      result.data!._id.toString(),
    );
    console.log(accessToken);
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

    const isPassCorrect = await bcryptService.comparePassword(
      password,
      user.password,
    );
    if (!isPassCorrect) {
      return {
        status: ResultStatus.Unauthorized,
        data: null,
        errorMessage: "Not Authorized",
        extensions: [{ field: "loginOrEmail", message: "Not Found" }],
      };
    }
    return {
      status: ResultStatus.Success,
      data: user,
      extensions: [],
    };
  },
};
