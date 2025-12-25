import { ObjectId, WithId } from "mongodb";
import { usersCollection } from "../../db/mongo.db";
import { UserCreateDto } from "../dto/input-dto/user-create-dto";

export const userRepository = {
  async createUser(dto: UserCreateDto): Promise<ObjectId | null> {
    const userId = await usersCollection.insertOne(dto);
    return userId.insertedId;
  },

  async deleteUser(id: string): Promise<boolean> {
    const deleteResult = await usersCollection.deleteOne({
      _id: new ObjectId(id),
    });
    return deleteResult.deletedCount === 1;
  },

  async findUserByLoginOrEmail(
    loginOrEmail: string,
  ): Promise<WithId<UserCreateDto> | null> {
    return await usersCollection.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });
  },
};
