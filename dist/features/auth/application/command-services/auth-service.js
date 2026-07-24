"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const resultCode_1 = require("../../../../core/result/resultCode");
const node_crypto_1 = require("node:crypto");
const add_1 = require("date-fns/add");
const emails_options_1 = require("../../adapters/email-service/emails-options");
const user_repository_mongodb_1 = require("../../../users/repositories/user-repository-mongodb");
const jwt_service_1 = require("../../adapters/jwt-service");
const argon2_service_1 = require("../../adapters/argon2-service");
const nodemailer_service_1 = require("../../adapters/email-service/nodemailer-service");
const device_repository_1 = require("../../../security/repository/device-repository");
const user_service_1 = require("../../../users/application/command-services/user-service");
const inversify_1 = require("inversify");
let AuthService = class AuthService {
    constructor(userRepository, jwtService, argon2Service, nodemailerService, deviceRepository, userService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.argon2Service = argon2Service;
        this.nodemailerService = nodemailerService;
        this.deviceRepository = deviceRepository;
        this.userService = userService;
    }
    //CONFIRMATION OF REGISTRATION
    confirmRegistration(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findUserByConfirmationCode(code);
            if (!user) {
                return {
                    status: resultCode_1.ResultStatus.BadRequest,
                    errorMessage: "No user",
                    extensions: [{ field: "code", message: "Code is incorrect" }],
                    data: null,
                };
            }
            if (new Date() > user.emailConfirmation.expirationDate) {
                return {
                    status: resultCode_1.ResultStatus.BadRequest,
                    errorMessage: "Confirmation code is expired",
                    extensions: [{ field: "code", message: "Code is expired" }],
                    data: null,
                };
            }
            if (user.emailConfirmation.isConfirmed) {
                return {
                    status: resultCode_1.ResultStatus.BadRequest,
                    errorMessage: "code has been applied",
                    extensions: [{ field: "code", message: "Code has been applied" }],
                    data: null,
                };
            }
            yield this.userRepository.makeRegistrationConfirmation(user._id.toString());
            return {
                status: resultCode_1.ResultStatus.Success,
                data: null,
                extensions: [],
            };
        });
    }
    //REGISTRATION
    registerUser(registrationInputDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { login, password, email } = registrationInputDto;
            const isUserLoginExist = this.userRepository.findUserByLoginOrEmail(login);
            const isUserEmailExist = this.userRepository.findUserByLoginOrEmail(email);
            const [isLoginExist, isEmailExist] = yield Promise.all([
                isUserLoginExist,
                isUserEmailExist,
            ]);
            if (isLoginExist) {
                return {
                    status: resultCode_1.ResultStatus.BadRequest,
                    errorMessage: "The login is busy",
                    extensions: [{ field: "login", message: "The login is busy" }],
                    data: null,
                };
            }
            if (isEmailExist) {
                return {
                    status: resultCode_1.ResultStatus.BadRequest,
                    errorMessage: "The email is busy",
                    extensions: [{ field: "email", message: "The email is busy" }],
                    data: null,
                };
            }
            const passwordHash = yield this.argon2Service.generateHash(password);
            const newUser = Object.assign(Object.assign({}, registrationInputDto), { password: passwordHash, createdAt: new Date().toISOString(), emailConfirmation: {
                    confirmationCode: (0, node_crypto_1.randomUUID)(),
                    expirationDate: (0, add_1.add)(new Date(), {
                        hours: 1,
                        minutes: 1,
                    }),
                    isConfirmed: false,
                }, passwordRecovery: {
                    recoveryCode: null,
                    expirationDate: null,
                } });
            const userId = yield this.userRepository.createUser(newUser);
            this.nodemailerService
                .sendEmail(newUser.email, newUser.emailConfirmation.confirmationCode, emails_options_1.emailsOptions.registrationEmail)
                .catch((error) => __awaiter(this, void 0, void 0, function* () {
                console.error(error);
                yield this.userRepository.deleteUser(userId);
            }));
            return {
                status: resultCode_1.ResultStatus.Success,
                data: null,
                extensions: [],
            };
        });
    }
    //RESEND EMAIL CONFIRMATION
    resendRegistrationEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findUserByLoginOrEmail(email);
            if (!user) {
                return {
                    status: resultCode_1.ResultStatus.BadRequest,
                    errorMessage: "No user",
                    extensions: [{ field: "email", message: "User not exist" }],
                    data: null,
                };
            }
            if (user.emailConfirmation.isConfirmed) {
                return {
                    status: resultCode_1.ResultStatus.BadRequest,
                    errorMessage: "Already confirmed",
                    extensions: [{ field: "email", message: "Email already confirmed" }],
                    data: null,
                };
            }
            const newCode = (0, node_crypto_1.randomUUID)();
            const newDate = (0, add_1.add)(new Date(), {
                hours: 1,
                minutes: 1,
            });
            yield this.userRepository.updateUserConfirmationCode(user._id.toString(), newCode, newDate);
            this.nodemailerService
                .sendEmail(email, newCode, emails_options_1.emailsOptions.registrationEmail)
                .catch((error) => __awaiter(this, void 0, void 0, function* () {
                console.error(error);
                yield this.userRepository.deleteUser(user._id.toString());
            }));
            return {
                status: resultCode_1.ResultStatus.Success,
                data: null,
                extensions: [],
            };
        });
    }
    // LOGIN
    login(input, title, ip) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.checkUserCredentials(input);
            if (result.status !== resultCode_1.ResultStatus.Success)
                return {
                    status: result.status,
                    errorMessage: result.errorMessage,
                    extensions: result.extensions,
                    data: null,
                };
            const deviceId = (0, node_crypto_1.randomUUID)();
            const userId = result.data._id.toString();
            const { accessToken, refreshToken } = yield this.createAccessAndRefreshTokens(userId, deviceId);
            const decodeToken = yield this.jwtService.verifyRefreshToken(refreshToken);
            if (!decodeToken) {
                return {
                    status: resultCode_1.ResultStatus.BadRequest,
                    data: null,
                    extensions: [],
                };
            }
            const { iat, exp } = decodeToken;
            yield this.deviceRepository.createDevice({
                userId,
                deviceId,
                title,
                ip,
                iat,
                exp,
            });
            return {
                status: resultCode_1.ResultStatus.Success,
                data: { accessToken, refreshToken },
                extensions: [],
            };
        });
    }
    //LOGOUT
    logout(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.deviceRepository.deleteDevice(deviceId);
            }
            catch (error) {
                console.error(error);
            }
            return true;
        });
    }
    createAccessAndRefreshTokens(userId, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const access = this.jwtService.createAccessToken(userId);
            const refresh = this.jwtService.createRefreshToken(userId, deviceId);
            const [accessToken, refreshToken] = yield Promise.all([access, refresh]);
            return { accessToken, refreshToken };
        });
    }
    checkUserCredentials(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { password, loginOrEmail } = input;
            const user = yield this.userRepository.findUserByLoginOrEmail(loginOrEmail);
            if (!user) {
                return {
                    status: resultCode_1.ResultStatus.Unauthorized,
                    data: null,
                    errorMessage: "Not Authorized",
                    extensions: [{ field: "loginOrEmail", message: "Not Found" }],
                };
            }
            const isPassCorrect = yield this.argon2Service.comparePassword(password, user.password);
            if (!isPassCorrect) {
                return {
                    status: resultCode_1.ResultStatus.Unauthorized,
                    data: null,
                    errorMessage: "Not Authorized",
                    extensions: [{ field: "password", message: "Not correct" }],
                };
            }
            const newHash = yield this.argon2Service.reHash(password, user.password);
            if (newHash) {
                yield this.userService.updateUserHash(user._id.toString(), newHash);
            }
            return {
                status: resultCode_1.ResultStatus.Success,
                data: user,
                extensions: [],
            };
        });
    }
    //PASSWORD RECOVERY
    passwordRecovery(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findUserByLoginOrEmail(email);
            if (!user) {
                return {
                    status: resultCode_1.ResultStatus.Success,
                    data: null,
                    extensions: [],
                };
            }
            const recoveryCode = (0, node_crypto_1.randomUUID)();
            const expirationDate = (0, add_1.add)(new Date(), {
                hours: 1,
                minutes: 1,
            });
            yield this.userRepository.updatePasswordRecoveryCode(user._id.toString(), recoveryCode, expirationDate);
            yield this.nodemailerService
                .sendEmail(email, recoveryCode, emails_options_1.emailsOptions.passwordRecoveryEmail)
                .catch((error) => {
                console.error(error);
            });
            return {
                status: resultCode_1.ResultStatus.Success,
                data: null,
                extensions: [],
            };
        });
    }
    //NEW PASSWORD
    newPassword(recoveryCode, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findUserByRecoveryCode(recoveryCode);
            if (!user) {
                return {
                    status: resultCode_1.ResultStatus.BadRequest,
                    errorMessage: "Incorrect recovery code",
                    extensions: [
                        { field: "recoveryCode", message: "Incorrect recovery code" },
                    ],
                    data: null,
                };
            }
            if (!user.passwordRecovery.expirationDate ||
                new Date() > user.passwordRecovery.expirationDate) {
                return {
                    status: resultCode_1.ResultStatus.BadRequest,
                    errorMessage: "Recovery code is expired",
                    extensions: [
                        { field: "recoveryCode", message: "Recovery code is expired" },
                    ],
                    data: null,
                };
            }
            const passwordHash = yield this.argon2Service.generateHash(newPassword);
            yield this.userRepository.updateHash(user._id.toString(), passwordHash);
            return {
                status: resultCode_1.ResultStatus.Success,
                data: null,
                extensions: [],
            };
        });
    }
    refreshTokens(currentRefreshToken, userId, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { accessToken, refreshToken } = yield this.createAccessAndRefreshTokens(userId, deviceId);
            const decodeToken = yield this.jwtService.verifyRefreshToken(refreshToken);
            if (!decodeToken) {
                return {
                    status: resultCode_1.ResultStatus.BadRequest,
                    data: null,
                    extensions: [],
                };
            }
            const { iat, exp } = decodeToken;
            yield this.deviceRepository.updateDevice(deviceId, iat, exp);
            return {
                status: resultCode_1.ResultStatus.Success,
                errorMessage: "",
                extensions: [],
                data: { accessToken, refreshToken },
            };
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(user_repository_mongodb_1.UserRepository)),
    __param(1, (0, inversify_1.inject)(jwt_service_1.JwtService)),
    __param(2, (0, inversify_1.inject)(argon2_service_1.Argon2Service)),
    __param(3, (0, inversify_1.inject)(nodemailer_service_1.NodemailerService)),
    __param(4, (0, inversify_1.inject)(device_repository_1.DeviceRepository)),
    __param(5, (0, inversify_1.inject)(user_service_1.UserService)),
    __metadata("design:paramtypes", [user_repository_mongodb_1.UserRepository,
        jwt_service_1.JwtService,
        argon2_service_1.Argon2Service,
        nodemailer_service_1.NodemailerService,
        device_repository_1.DeviceRepository,
        user_service_1.UserService])
], AuthService);
