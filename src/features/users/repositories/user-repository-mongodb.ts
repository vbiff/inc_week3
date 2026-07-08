import { UserCreateDto } from "../application/command-services/dto/user-create-dto";
import { UserEntity, UserModel, UserDocument } from "../domain/user_entity";
import { injectable } from "inversify";

@injectable()
export class UserRepository {
  async createUser(dto: UserCreateDto): Promise<string | null> {
    const user = new UserEntity(dto);
    const created = await UserModel.create(user);
    return created._id.toString();
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await UserModel.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }

  async findUserByLoginOrEmail(
    loginOrEmail: string,
  ): Promise<UserDocument | null> {
    return await UserModel.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });
  }

  async updateHash(userId: string, newHash: string): Promise<void> {
    const user = await UserModel.findById(userId);
    if (!user) return;
    user.updateHash(newHash);
    await user.save();
  }

  async findUserByConfirmationCode(code: string): Promise<UserDocument | null> {
    return await UserModel.findOne({
      "emailConfirmation.confirmationCode": code,
    });
  }

  async makeRegistrationConfirmation(userId: string): Promise<void> {
    const user = await UserModel.findById(userId);
    if (!user) return;
    user.confirmRegistration();
    await user.save();
  }

  async updateUserConfirmationCode(
    userId: string,
    code: string,
    date: Date,
  ): Promise<void> {
    const user = await UserModel.findById(userId);
    if (!user) return;
    user.updateConfirmationCode(code, date);
    await user.save();
  }

  async updatePasswordRecoveryCode(
    userId: string,
    code: string,
    expirationDate: Date,
  ): Promise<void> {
    const user = await UserModel.findById(userId);
    if (!user) return;
    user.updatePasswordRecoveryCode(code, expirationDate);
    await user.save();
  }

  async findUserByRecoveryCode(code: string): Promise<UserDocument | null> {
    return await UserModel.findOne({
      "passwordRecovery.recoveryCode": code,
    });
  }
}
