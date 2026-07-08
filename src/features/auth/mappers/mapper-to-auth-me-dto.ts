import { UserDocument } from "../../users/domain/user_entity";
import { AuthMeDto } from "../application/queries/dto/auth-output-dto/auth-me-dto";

export const mapperToAuthMeDto = (rawUser: UserDocument): AuthMeDto => {
  return {
    email: rawUser.email,
    login: rawUser.login,
    userId: rawUser._id.toString(),
  };
};
