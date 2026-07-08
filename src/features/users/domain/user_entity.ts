import { HydratedDocument, Model, model, Schema } from "mongoose";
import { UserCreateDto } from "../application/command-services/dto/user-create-dto";

export class UserEntity {
  login: string;
  email: string;
  password: string;
  createdAt: string;
  emailConfirmation: {
    confirmationCode: string;
    expirationDate: Date;
    isConfirmed: boolean;
  };
  passwordRecovery: {
    recoveryCode: string | null;
    expirationDate: Date | null;
  };

  constructor(dto: UserCreateDto) {
    this.login = dto.login;
    this.email = dto.email;
    this.password = dto.password;
    this.createdAt = dto.createdAt;
    this.emailConfirmation = dto.emailConfirmation;
    this.passwordRecovery = dto.passwordRecovery;
  }

  updateHash(newHash: string): void {
    this.password = newHash;
  }

  confirmRegistration(): void {
    this.emailConfirmation.isConfirmed = true;
  }

  updateConfirmationCode(code: string, date: Date): void {
    this.emailConfirmation.confirmationCode = code;
    this.emailConfirmation.expirationDate = date;
  }

  updatePasswordRecoveryCode(code: string, expirationDate: Date): void {
    this.passwordRecovery.recoveryCode = code;
    this.passwordRecovery.expirationDate = expirationDate;
  }
}

export const UserSchema = new Schema<UserEntity>({
  login: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: String, required: true },
  emailConfirmation: {
    confirmationCode: { type: String, required: true },
    expirationDate: { type: Date, required: true },
    isConfirmed: { type: Boolean, required: true },
  },
  passwordRecovery: {
    recoveryCode: { type: String, default: null },
    expirationDate: { type: Date, default: null },
  },
});

UserSchema.loadClass(UserEntity);

export type UserDocument = HydratedDocument<UserEntity>;

export const UserModel: Model<UserEntity> = model<UserEntity>(
  "User",
  UserSchema,
);
