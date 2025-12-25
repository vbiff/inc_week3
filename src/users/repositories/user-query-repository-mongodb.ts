import { UserCreateDto } from "../dto/input-dto/user-create-dto";
import { UserView } from "../dto/output-dto/user-view";
import { Filter, ObjectId, WithId } from "mongodb";
import { mapperUserMongoId } from "../mappers/mapper-user-mongoId";
import { PaginationAndSortingReq } from "../../core/types/pagination-and-sorting-req";
import { ResultUsersOutputDto } from "../dto/output-dto/result-users-output-dto";
import { mapperOutput } from "../../core/mappers/mapper-output";
import { usersCollection } from "../../db/mongo.db";

export const userQueryRepositoryMongodb = {
  async findUserById(id: string): Promise<UserView | null> {
    const rawUser: WithId<UserCreateDto> | null = await usersCollection.findOne(
      {
        _id: new ObjectId(id),
      },
    );
    if (!rawUser) {
      return null;
    }
    return mapperUserMongoId(rawUser);
  },

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

    const filter: Filter<UserCreateDto> = {};

    if (searchLoginTerm || searchEmailTerm) {
      filter.$or = [];
      if (searchLoginTerm) {
        filter.$or.push({ login: { $regex: searchLoginTerm, $options: "i" } });
      } else if (searchEmailTerm) {
        filter.$or.push({ email: { $regex: searchEmailTerm, $options: "i" } });
      }
    }

    const users = await usersCollection
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const totalCount = await usersCollection.countDocuments(filter);

    const mappedUsers: UserView[] = users.map((user) =>
      mapperUserMongoId(user),
    );
    return mapperOutput(mappedUsers, {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
    });
  },
};
