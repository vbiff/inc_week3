import { ObjectId } from "mongodb";
import { client } from "../../db/mongo.db";
import { UserCreateDto } from "../dto/input-dto/user-create-dto";

const usersCollection = client.db("blogger").collection<UserCreateDto>("users");

export const userRepository = {
  async createUser(dto: UserCreateDto): Promise<ObjectId | null> {
    const userId = await usersCollection.insertOne(dto);
    return userId.insertedId;
  },
};
