"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = exports.UserSchema = exports.UserEntity = void 0;
const mongoose_1 = require("mongoose");
class UserEntity {
    constructor(login, email, password, createdAt, emailConfirmation, passwordRecovery) {
        this.login = login;
        this.email = email;
        this.password = password;
        this.createdAt = createdAt;
        this.emailConfirmation = emailConfirmation;
        this.passwordRecovery = passwordRecovery;
    }
    static createUser(dto) {
        return new UserEntity(dto.login, dto.email, dto.password, dto.createdAt, dto.emailConfirmation, dto.passwordRecovery);
    }
    updateHash(newHash) {
        this.password = newHash;
    }
    confirmRegistration() {
        this.emailConfirmation.isConfirmed = true;
    }
    updateConfirmationCode(code, date) {
        this.emailConfirmation.confirmationCode = code;
        this.emailConfirmation.expirationDate = date;
    }
    updatePasswordRecoveryCode(code, expirationDate) {
        this.passwordRecovery.recoveryCode = code;
        this.passwordRecovery.expirationDate = expirationDate;
    }
}
exports.UserEntity = UserEntity;
exports.UserSchema = new mongoose_1.Schema({
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
exports.UserSchema.loadClass(UserEntity);
exports.UserModel = (0, mongoose_1.model)("User", exports.UserSchema);
