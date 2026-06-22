import { ObjectId, WithId } from "mongodb";
import { usersCollection } from "../../../db/mongo.db";
import { UserCreateDto } from "../application/command-services/dto/user-create-dto";

export class UserRepository {
  async createUser(dto: UserCreateDto): Promise<string | null> {
    const userId = await usersCollection.insertOne(dto);
    return userId.insertedId.toString();
  }

  async deleteUser(id: string): Promise<boolean> {
    const deleteResult = await usersCollection.deleteOne({
      _id: new ObjectId(id),
    });
    return deleteResult.deletedCount === 1;
  }

  async findUserByLoginOrEmail(
    loginOrEmail: string,
  ): Promise<WithId<UserCreateDto> | null> {
    return await usersCollection.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });
  }

  async updateHash(userId: string, newHash: string): Promise<void> {
    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { password: newHash } },
    );
  }

  async findUserByConfirmationCode(
    code: string,
  ): Promise<WithId<UserCreateDto> | null> {
    return await usersCollection.findOne({
      "emailConfirmation.confirmationCode": code,
    });
  }

  async makeRegistrationConfirmation(userId: string): Promise<void> {
    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { "emailConfirmation.isConfirmed": true } },
    );
  }

  async updateUserConfirmationCode(userId: string, code: string, date: Date) {
    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          ["emailConfirmation.confirmationCode"]: code,
          "emailConfirmation.expirationDate": date,
        },
      },
    );
  }

  async updatePasswordRecoveryCode(
    userId: string,
    code: string,
    expirationDate: Date,
  ): Promise<void> {
    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          "passwordRecovery.recoveryCode": code,
          "passwordRecovery.expirationDate": expirationDate,
        },
      },
    );
  }

  async findUserByRecoveryCode(
    code: string,
  ): Promise<WithId<UserCreateDto> | null> {
    return await usersCollection.findOne({
      "passwordRecovery.recoveryCode": code,
    });
  }
}
