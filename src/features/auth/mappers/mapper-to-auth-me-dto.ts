import { WithId } from "mongodb";
import { UserCreateByAdminDto } from "../../users/application/command-services/dto/user-create-by-admin-dto";
import { AuthMeDto } from "../application/queries/dto/auth-output-dto/auth-me-dto";

export const mapperToAuthMeDto = (
  rawUser: WithId<UserCreateByAdminDto>,
): AuthMeDto => {
  return {
    email: rawUser.email,
    login: rawUser.login,
    userId: rawUser._id.toString(),
  };
};
