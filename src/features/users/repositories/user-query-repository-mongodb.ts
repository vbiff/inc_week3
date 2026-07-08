import { UserView } from "../application/queries/dto/output-dto/user-view";
import { QueryFilter } from "mongoose";
import { mapperUserMongoId } from "../mappers/mapper-user-mongoId";
import { PaginationAndSortingReq } from "../../../core/types/pagination-and-sorting-req";
import { ResultUsersOutputDto } from "../application/queries/dto/output-dto/result-users-output-dto";
import { mapperOutput } from "../../../core/mappers/mapper-output";
import { mapperToAuthMeDto } from "../../auth/mappers/mapper-to-auth-me-dto";
import { AuthMeDto } from "../../auth/application/queries/dto/auth-output-dto/auth-me-dto";
import { injectable } from "inversify";
import { UserEntity, UserModel } from "../domain/user_entity";

@injectable()
export class UserQueryRepository {
  async findUserById(id: string): Promise<UserView | null> {
    const rawUser = await UserModel.findById(id);
    if (!rawUser) {
      return null;
    }
    return mapperUserMongoId(rawUser);
  }

  async findUserByIdForMe(id: string): Promise<AuthMeDto | null> {
    const rawUser = await UserModel.findById(id);
    if (!rawUser) {
      return null;
    }
    return mapperToAuthMeDto(rawUser);
  }

  async getAllUsers(
    query: PaginationAndSortingReq,
  ): Promise<ResultUsersOutputDto> {
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      searchLoginTerm,
      searchEmailTerm,
    } = query;
    const skip: number = (pageNumber - 1) * pageSize;

    const filter: QueryFilter<UserEntity> = {};

    if (searchLoginTerm || searchEmailTerm) {
      filter.$or = [];
      if (searchLoginTerm) {
        filter.$or.push({ login: { $regex: searchLoginTerm, $options: "i" } });
      }
      if (searchEmailTerm) {
        filter.$or.push({ email: { $regex: searchEmailTerm, $options: "i" } });
      }
    }

    const users = await UserModel.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize);

    const totalCount = await UserModel.countDocuments(filter);

    const mappedUsers: UserView[] = users.map((user) =>
      mapperUserMongoId(user),
    );
    return mapperOutput(mappedUsers, {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
    });
  }
}
