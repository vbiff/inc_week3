import { WithId } from "mongodb";
import { UserCreateDto } from "../application/queries/dto/input-dto/user-create-dto";
import { UserView } from "../application/queries/dto/output-dto/user-view";

export function mapperUserMongoId(dto: WithId<UserCreateDto>): UserView {
  return {
    id: dto._id.toString(),
    login: dto.login,
    email: dto.email,
    createdAt: dto.createdAt,
  };
}
