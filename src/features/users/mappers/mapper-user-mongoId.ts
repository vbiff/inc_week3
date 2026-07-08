import { UserView } from "../application/queries/dto/output-dto/user-view";
import { UserDocument } from "../domain/user_entity";

export function mapperUserMongoId(dto: UserDocument): UserView {
  return {
    id: dto._id.toString(),
    login: dto.login,
    email: dto.email,
    createdAt: dto.createdAt,
  };
}
