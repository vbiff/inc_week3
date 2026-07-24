"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.UserRepository = void 0;
const user_entity_1 = require("../domain/user_entity");
const inversify_1 = require("inversify");
let UserRepository = class UserRepository {
    createUser(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = user_entity_1.UserEntity.createUser(dto);
            const created = yield user_entity_1.UserModel.create(user);
            return created._id.toString();
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield user_entity_1.UserModel.deleteOne({ _id: id });
            return result.deletedCount === 1;
        });
    }
    findUserByLoginOrEmail(loginOrEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_entity_1.UserModel.findOne({
                $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
            });
        });
    }
    updateHash(userId, newHash) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_entity_1.UserModel.findById(userId);
            if (!user)
                return;
            user.updateHash(newHash);
            yield user.save();
        });
    }
    findUserByConfirmationCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_entity_1.UserModel.findOne({
                "emailConfirmation.confirmationCode": code,
            });
        });
    }
    makeRegistrationConfirmation(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_entity_1.UserModel.findById(userId);
            if (!user)
                return;
            user.confirmRegistration();
            yield user.save();
        });
    }
    updateUserConfirmationCode(userId, code, date) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_entity_1.UserModel.findById(userId);
            if (!user)
                return;
            user.updateConfirmationCode(code, date);
            yield user.save();
        });
    }
    updatePasswordRecoveryCode(userId, code, expirationDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_entity_1.UserModel.findById(userId);
            if (!user)
                return;
            user.updatePasswordRecoveryCode(code, expirationDate);
            yield user.save();
        });
    }
    findUserByRecoveryCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_entity_1.UserModel.findOne({
                "passwordRecovery.recoveryCode": code,
            });
        });
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = __decorate([
    (0, inversify_1.injectable)()
], UserRepository);
