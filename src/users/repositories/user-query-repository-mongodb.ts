import { client } from "../../db/mongo.db";
import { UserCreateDto } from "../dto/input-dto/user-create-dto";
import { UserView } from "../dto/output-dto/user-view";
import { ObjectId, WithId } from "mongodb";
import { mapperUserMongoId } from "../mappers/mapper-user-mongoId";
import { PaginationAndSortingReq } from "../../core/types/pagination-and-sorting-req";
import { ResultUsersOutputDto } from "../dto/output-dto/result-users-output-dto";
import { mapperOutput } from "../../core/mappers/mapper-output";

const usersCollection = client.db("blogger").collection<UserCreateDto>("users");

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
    const { pageNumber, pageSize, sortBy, sortDirection } = query;
    const skip: number = (pageNumber - 1) * pageSize;
    const users = await usersCollection
      .find({})
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const totalCount = await usersCollection.countDocuments({});

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
