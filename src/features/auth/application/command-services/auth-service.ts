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
import { authRepository } from "../../repositories/auth-repository";

export const authService = {
  //CONFIRMATION OF REGISTRATION
  async confirmRegistration(code: string): Promise<Result> {
    const user = await userRepository.findUserByConfirmationCode(code);
    if (!user) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: "No user",
        extensions: [{ field: "code", message: "Code is incorrect" }],
        data: null,
      };
    }
    if (new Date() > user.emailConfirmation.expirationDate) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: "Confirmation code is expired",
        extensions: [{ field: "code", message: "Code is expired" }],
        data: null,
      };
    }
    if (user.emailConfirmation.isConfirmed) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: "code has been applied",
        extensions: [{ field: "code", message: "Code has been applied" }],
        data: null,
      };
    }
    await userRepository.makeRegistrationConfirmation(user._id.toString());
    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    };
  },

  //REGISTRATION
  async registerUser(
    registrationInputDto: RegistrationInputDto,
  ): Promise<Result> {
    const { login, password, email } = registrationInputDto;

    //check if login exists
    try {
      const isUserLoginExist = userRepository.findUserByLoginOrEmail(login);

      //check if login exists
      const isUserEmailExist = userRepository.findUserByLoginOrEmail(email);

      const [isLoginExist, isEmailExist] = await Promise.all([
        isUserLoginExist,
        isUserEmailExist,
      ]);

      if (isLoginExist) {
        return {
          status: ResultStatus.BadRequest,
          errorMessage: "The login is busy",
          extensions: [{ field: "login", message: "The login is busy" }],
          data: null,
        };
      }
      if (isEmailExist) {
        return {
          status: ResultStatus.BadRequest,
          errorMessage: "The email is busy",
          extensions: [{ field: "email", message: "The email is busy" }],
          data: null,
        };
      }
    } catch (e) {
      console.error(e);
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

    await nodemailerService
      .sendEmail(
        newUser.email,
        newUser.emailConfirmation.confirmationCode,
        emailsOptions.registrationEmail,
      )
      .catch(async (error) => {
        console.error(error);
        await userRepository.deleteUser(userId!);
        return {
          status: ResultStatus.Forbidden,
          errorMessage: "Email was not sent",
          extensions: [{ field: "email", message: "Email was not sent" }],
          data: null,
        };
      });
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
    // recreate confirmation code and date
    const newCode = randomUUID();
    const newDate = add(new Date(), {
      hours: 1,
      minutes: 1,
    });
    await userRepository.updateUserConfirmationCode(
      user._id.toString(),
      newCode,
      newDate,
    );

    await nodemailerService
      .sendEmail(email, newCode, emailsOptions.registrationEmail)
      .catch(async (error) => {
        console.error(error);
        await userRepository.deleteUser(user._id!.toString());
        return {
          status: ResultStatus.Forbidden,
          errorMessage: "Email was not sent",
          extensions: [{ field: "email", message: "Email was not sent" }],
          data: null,
        };
      });

    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    };
  },

  // LOGIN
  async login(
    input: AuthInputDTO,
  ): Promise<Result<{ accessToken: string; refreshToken: string } | null>> {
    const result = await this.checkUserCredentials(input);
    if (result.status !== ResultStatus.Success)
      return {
        status: result.status,
        errorMessage: result.errorMessage,
        extensions: result.extensions,
        data: null,
      };

    const { accessToken, refreshToken } =
      await this.createAccessAndRefreshTokens(result.data!._id.toString());

    return {
      status: ResultStatus.Success,
      data: { accessToken, refreshToken },
      extensions: [],
    };
  },

  async createAccessAndRefreshTokens(userId: string) {
    const access = jwtService.createAccessToken(userId);

    const refresh = jwtService.createRefreshToken(userId);

    const [accessToken, refreshToken] = await Promise.all([access, refresh]);
    return { accessToken, refreshToken };
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

  async refreshTokens(
    currentRefreshToken: string,
  ): Promise<Result<{ accessToken: string; refreshToken: string } | null>> {
    // 1 verify the token
    const verifyTokenResult =
      await jwtService.verifyRefreshToken(currentRefreshToken);
    if (!verifyTokenResult) {
      return {
        status: ResultStatus.Unauthorized,
        errorMessage: "",
        extensions: [],
        data: null,
      };
    }
    //2 check black list
    const isTokenInBlackList =
      await authRepository.isTokenInBlackList(currentRefreshToken);
    if (isTokenInBlackList) {
      return {
        status: ResultStatus.Unauthorized,
        errorMessage: "",
        extensions: [],
        data: null,
      };
    }
    // create new tokens
    const { accessToken, refreshToken } =
      await this.createAccessAndRefreshTokens(verifyTokenResult.id);

    // put old refreshToken to black list
    await authRepository.addTokenToBlackList(currentRefreshToken);

    // send new tokens
    return {
      status: ResultStatus.Success,
      errorMessage: "",
      extensions: [],
      data: { accessToken, refreshToken },
    };
  },
};
