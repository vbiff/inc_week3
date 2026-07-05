import { AuthInputDTO } from "../queries/dto/auth-input-dto/auth-input-dto";
import { Result } from "../../../../core/result/resultType";
import { ResultStatus } from "../../../../core/result/resultCode";
import { UserCreateByAdminDto } from "../../../users/application/command-services/dto/user-create-by-admin-dto";
import { WithId } from "mongodb";
import { RegistrationInputDto } from "./dto/registration-input-dto";
import { randomUUID } from "node:crypto";
import { add } from "date-fns/add";
import { emailsOptions } from "../../adapters/email-service/emails-options";
import { UserRepository } from "../../../users/repositories/user-repository-mongodb";
import { JwtService } from "../../adapters/jwt-service";
import { Argon2Service } from "../../adapters/argon2-service";
import { NodemailerService } from "../../adapters/email-service/nodemailer-service";
import { DeviceRepository } from "../../../security/repository/device-repository";
import { UserService } from "../../../users/application/command-services/user-service";
import { inject, injectable } from "inversify";

@injectable()
export class AuthService {
  constructor(
    @inject(UserRepository) private userRepository: UserRepository,
    @inject(JwtService) private jwtService: JwtService,
    @inject(Argon2Service) private argon2Service: Argon2Service,
    @inject(NodemailerService) private nodemailerService: NodemailerService,
    @inject(DeviceRepository) private deviceRepository: DeviceRepository,
    @inject(UserService) private userService: UserService,
  ) {}

  //CONFIRMATION OF REGISTRATION
  async confirmRegistration(code: string): Promise<Result> {
    const user = await this.userRepository.findUserByConfirmationCode(code);
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
    await this.userRepository.makeRegistrationConfirmation(user._id.toString());
    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    };
  }

  //REGISTRATION
  async registerUser(
    registrationInputDto: RegistrationInputDto,
  ): Promise<Result> {
    const { login, password, email } = registrationInputDto;

    const isUserLoginExist = this.userRepository.findUserByLoginOrEmail(login);
    const isUserEmailExist = this.userRepository.findUserByLoginOrEmail(email);

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

    const passwordHash = await this.argon2Service.generateHash(password);

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
      passwordRecovery: {
        recoveryCode: null,
        expirationDate: null,
      },
    };

    const userId = await this.userRepository.createUser(newUser);

    this.nodemailerService
      .sendEmail(
        newUser.email,
        newUser.emailConfirmation.confirmationCode,
        emailsOptions.registrationEmail,
      )
      .catch(async (error) => {
        console.error(error);
        await this.userRepository.deleteUser(userId!);
      });
    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    };
  }

  //RESEND EMAIL CONFIRMATION
  async resendRegistrationEmail(email: string): Promise<Result> {
    const user = await this.userRepository.findUserByLoginOrEmail(email);
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
    const newCode = randomUUID();
    const newDate = add(new Date(), {
      hours: 1,
      minutes: 1,
    });
    await this.userRepository.updateUserConfirmationCode(
      user._id.toString(),
      newCode,
      newDate,
    );

    this.nodemailerService
      .sendEmail(email, newCode, emailsOptions.registrationEmail)
      .catch(async (error) => {
        console.error(error);
        await this.userRepository.deleteUser(user._id!.toString());
      });

    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    };
  }

  // LOGIN
  async login(
    input: AuthInputDTO,
    title: string,
    ip: string,
  ): Promise<Result<{ accessToken: string; refreshToken: string } | null>> {
    const result = await this.checkUserCredentials(input);
    if (result.status !== ResultStatus.Success)
      return {
        status: result.status,
        errorMessage: result.errorMessage,
        extensions: result.extensions,
        data: null,
      };

    const deviceId = randomUUID();
    const userId = result.data!._id.toString();

    const { accessToken, refreshToken } =
      await this.createAccessAndRefreshTokens(userId, deviceId);

    const decodeToken = await this.jwtService.verifyRefreshToken(refreshToken);

    if (!decodeToken) {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        extensions: [],
      };
    }

    const { iat, exp } = decodeToken;

    await this.deviceRepository.createDevice({
      userId,
      deviceId,
      title,
      ip,
      iat,
      exp,
    });

    return {
      status: ResultStatus.Success,
      data: { accessToken, refreshToken },
      extensions: [],
    };
  }

  //LOGOUT
  async logout(deviceId: string): Promise<boolean> {
    try {
      await this.deviceRepository.deleteDevice(deviceId);
    } catch (error) {
      console.error(error);
    }
    return true;
  }

  async createAccessAndRefreshTokens(userId: string, deviceId: string) {
    const access = this.jwtService.createAccessToken(userId);
    const refresh = this.jwtService.createRefreshToken(userId, deviceId);

    const [accessToken, refreshToken] = await Promise.all([access, refresh]);
    return { accessToken, refreshToken };
  }

  async checkUserCredentials(
    input: AuthInputDTO,
  ): Promise<Result<WithId<UserCreateByAdminDto> | null>> {
    const { password, loginOrEmail } = input;

    const user: WithId<UserCreateByAdminDto> | null =
      await this.userRepository.findUserByLoginOrEmail(loginOrEmail);

    if (!user) {
      return {
        status: ResultStatus.Unauthorized,
        data: null,
        errorMessage: "Not Authorized",
        extensions: [{ field: "loginOrEmail", message: "Not Found" }],
      };
    }

    const isPassCorrect = await this.argon2Service.comparePassword(
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
    const newHash = await this.argon2Service.reHash(password, user.password);
    if (newHash) {
      await this.userService.updateUserHash(user._id.toString(), newHash);
    }

    return {
      status: ResultStatus.Success,
      data: user,
      extensions: [],
    };
  }

  //PASSWORD RECOVERY
  async passwordRecovery(email: string): Promise<Result> {
    const user = await this.userRepository.findUserByLoginOrEmail(email);
    if (!user) {
      return {
        status: ResultStatus.Success,
        data: null,
        extensions: [],
      };
    }

    const recoveryCode = randomUUID();
    const expirationDate = add(new Date(), {
      hours: 1,
      minutes: 1,
    });

    await this.userRepository.updatePasswordRecoveryCode(
      user._id.toString(),
      recoveryCode,
      expirationDate,
    );

    await this.nodemailerService
      .sendEmail(email, recoveryCode, emailsOptions.passwordRecoveryEmail)
      .catch((error) => {
        console.error(error);
      });

    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    };
  }

  //NEW PASSWORD
  async newPassword(
    recoveryCode: string,
    newPassword: string,
  ): Promise<Result> {
    const user = await this.userRepository.findUserByRecoveryCode(recoveryCode);
    if (!user) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: "Incorrect recovery code",
        extensions: [
          { field: "recoveryCode", message: "Incorrect recovery code" },
        ],
        data: null,
      };
    }

    if (
      !user.passwordRecovery.expirationDate ||
      new Date() > user.passwordRecovery.expirationDate
    ) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: "Recovery code is expired",
        extensions: [
          { field: "recoveryCode", message: "Recovery code is expired" },
        ],
        data: null,
      };
    }

    const passwordHash = await this.argon2Service.generateHash(newPassword);
    await this.userRepository.updateHash(user._id.toString(), passwordHash);

    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    };
  }

  async refreshTokens(
    currentRefreshToken: string,
    userId: string,
    deviceId: string,
  ): Promise<Result<{ accessToken: string; refreshToken: string } | null>> {
    const { accessToken, refreshToken } =
      await this.createAccessAndRefreshTokens(userId, deviceId);

    const decodeToken = await this.jwtService.verifyRefreshToken(refreshToken);

    if (!decodeToken) {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        extensions: [],
      };
    }

    const { iat, exp } = decodeToken;
    await this.deviceRepository.updateDevice(deviceId, iat, exp);

    return {
      status: ResultStatus.Success,
      errorMessage: "",
      extensions: [],
      data: { accessToken, refreshToken },
    };
  }
}
