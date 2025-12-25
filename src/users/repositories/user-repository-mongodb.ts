import { ObjectId } from "mongodb";
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
};
