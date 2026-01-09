import { AuthInputDTO } from "../queries/dto/auth-input-dto/auth-input-dto";
import { userRepository } from "../../../users/repositories/user-repository-mongodb";
import { Result } from "../../../../core/result/resultType";
import { ResultStatus } from "../../../../core/result/resultCode";
import { UserCreateByAdminDto } from "../../../users/application/command-services/dto/user-create-by-admin-dto";
import { WithId } from "mongodb";
import { jwtService } from "../../adapters/jwt-service";
import { argon2Service } from "../../adapters/argon2-service";
import { userService } from "../../../users/application/command-services/user-service";
import { RegistrationInputDto } from "./dto/registration-input-dto";
import { randomUUID } from "node:crypto";
import { add } from "date-fns/add";
import { nodemailerService } from "../../adapters/email-service/nodemailer-service";
import { emailsOptions } from "../../adapters/email-service/emails-options";

export const authService = {
  //REGISTRATION
  async registerUser(
    registrationInputDto: RegistrationInputDto,
  ): Promise<Result> {
    const { login, password, email } = registrationInputDto;

    //check if login exists
    const isUserLoginExist = await userRepository.findUserByLoginOrEmail(login);
    if (isUserLoginExist) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: "The login is busy",
        extensions: [{ field: "login", message: "The login is busy" }],
        data: null,
      };
    }
    //check if login exists
    const isUserEmailExist = await userRepository.findUserByLoginOrEmail(email);
    if (isUserEmailExist) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: "The email is busy",
        extensions: [{ field: "email", message: "The email is busy" }],
        data: null,
      };
    }
    const passwordHash = await argon2Service.generateHash(password);

    const newUser = {
      ...registrationInputDto,
      password: passwordHash,
      createdAt: new Date().toISOString(),
      emailConfirmation: {
        confirmationCode: randomUUID(),
        expirationDate: add(new Date(), {
          hours: 1,
          minutes: 1,
        }),
        isConfirmed: false,
      },
    };

    const userId = await userRepository.createUser(newUser);

    let isEmailSent = false;
    try {
      isEmailSent = await nodemailerService.sendEmail(
        newUser.email,
        newUser.emailConfirmation.confirmationCode,
        emailsOptions.registrationEmail,
      );
    } catch (error) {
      console.error(error);
    }
    if (!isEmailSent) {
      await userRepository.deleteUser(userId!.toString());
      return {
        status: ResultStatus.Forbidden,
        errorMessage: "Email was not sent",
        extensions: [{ field: "email", message: "Email was not sent" }],
        data: null,
      };
    }
    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    };
  },
  //RESEND EMAIL CONFIRMATION
  async resendRegistrationEmail(email: string): Promise<Result> {
    //check if login exists
    const user = await userRepository.findUserByLoginOrEmail(email);
    if (!user) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: "No user",
        extensions: [{ field: "email", message: "User not exist" }],
        data: null,
      };
    }
    if (user.emailConfirmation.isConfirmed) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: "Already confirmed",
        extensions: [{ field: "email", message: "Email already confirmed" }],
        data: null,
      };
    }
    let isSent = false;
    try {
      isSent = await nodemailerService.sendEmail(
        email,
        user.emailConfirmation.confirmationCode,
        emailsOptions.registrationEmail,
      );
    } catch (error) {
      console.error(error);
    }
    if (!isSent) {
      await userRepository.deleteUser(user._id!.toString());
      return {
        status: ResultStatus.Forbidden,
        errorMessage: "Email was not sent",
        extensions: [{ field: "email", message: "Email was not sent" }],
        data: null,
      };
    }
    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    };
  },
  // LOGIN
  async login(
    input: AuthInputDTO,
  ): Promise<Result<{ accessToken: string } | null>> {
    const result = await this.checkUserCredentials(input);
    if (result.status !== ResultStatus.Success)
      return {
        status: result.status,
        errorMessage: result.errorMessage,
        extensions: result.extensions,
        data: null,
      };
    const accessToken = await jwtService.createToken(
      result.data!._id.toString(),
    );

    return {
      status: ResultStatus.Success,
      data: { accessToken },
      extensions: [],
    };
  },

  async checkUserCredentials(
    input: AuthInputDTO,
  ): Promise<Result<WithId<UserCreateByAdminDto> | null>> {
    const { password, loginOrEmail } = input;

    const user: WithId<UserCreateByAdminDto> | null =
      await userRepository.findUserByLoginOrEmail(loginOrEmail);

    if (!user) {
      return {
        status: ResultStatus.Unauthorized,
        data: null,
        errorMessage: "Not Authorized",
        extensions: [{ field: "loginOrEmail", message: "Not Found" }],
      };
    }

    const isPassCorrect = await argon2Service.comparePassword(
      password,
      user.password,
    );
    if (!isPassCorrect) {
      return {
        status: ResultStatus.Unauthorized,
        data: null,
        errorMessage: "Not Authorized",
        extensions: [{ field: "password", message: "Not correct" }],
      };
    }
    const newHash = await argon2Service.reHash(password, user.password);
    if (newHash) {
      await userService.updateUserHash(user._id.toString(), newHash);
    }

    return {
      status: ResultStatus.Success,
      data: user,
      extensions: [],
    };
  },
};
