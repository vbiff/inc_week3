import { client } from "../../db/mongo.db";
import { UserCreateDto } from "../dto/input-dto/user-create-dto";
import { UserView } from "../dto/output-dto/user-view";
import { ObjectId, WithId } from "mongodb";
import { mapperUserMongoId } from "../mappers/mapper-user-mongoId";

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
};
