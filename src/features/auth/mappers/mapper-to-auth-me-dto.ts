import { WithId } from "mongodb";
import { UserCreateDto } from "../../users/application/queries/dto/input-dto/user-create-dto";
import { AuthMeDto } from "../application/queries/dto/auth-output-dto/auth-me-dto";

export const mapperToAuthMeDto = (
  rawUser: WithId<UserCreateDto>,
): AuthMeDto => {
  return {
    email: rawUser.email,
    login: rawUser.login,
    userId: rawUser._id.toString(),
  };
};
