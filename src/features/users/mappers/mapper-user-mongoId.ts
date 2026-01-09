import { WithId } from "mongodb";
import { UserCreateByAdminDto } from "../application/command-services/dto/user-create-by-admin-dto";
import { UserView } from "../application/queries/dto/output-dto/user-view";

export function mapperUserMongoId(dto: WithId<UserCreateByAdminDto>): UserView {
  return {
    id: dto._id.toString(),
    login: dto.login,
    email: dto.email,
    createdAt: dto.createdAt,
  };
}
