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
exports.UserQueryRepository = void 0;
const mapper_user_mongoId_1 = require("../mappers/mapper-user-mongoId");
const mapper_output_1 = require("../../../core/mappers/mapper-output");
const mapper_to_auth_me_dto_1 = require("../../auth/mappers/mapper-to-auth-me-dto");
const inversify_1 = require("inversify");
const user_entity_1 = require("../domain/user_entity");
let UserQueryRepository = class UserQueryRepository {
    findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawUser = yield user_entity_1.UserModel.findById(id);
            if (!rawUser) {
                return null;
            }
            return (0, mapper_user_mongoId_1.mapperUserMongoId)(rawUser);
        });
    }
    findUserByIdForMe(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawUser = yield user_entity_1.UserModel.findById(id);
            if (!rawUser) {
                return null;
            }
            return (0, mapper_to_auth_me_dto_1.mapperToAuthMeDto)(rawUser);
        });
    }
    getAllUsers(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pageNumber, pageSize, sortBy, sortDirection, searchLoginTerm, searchEmailTerm, } = query;
            const skip = (pageNumber - 1) * pageSize;
            const filter = {};
            if (searchLoginTerm || searchEmailTerm) {
                filter.$or = [];
                if (searchLoginTerm) {
                    filter.$or.push({ login: { $regex: searchLoginTerm, $options: "i" } });
                }
                if (searchEmailTerm) {
                    filter.$or.push({ email: { $regex: searchEmailTerm, $options: "i" } });
                }
            }
            const users = yield user_entity_1.UserModel.find(filter)
                .sort({ [sortBy]: sortDirection })
                .skip(skip)
                .limit(pageSize);
            const totalCount = yield user_entity_1.UserModel.countDocuments(filter);
            const mappedUsers = users.map((user) => (0, mapper_user_mongoId_1.mapperUserMongoId)(user));
            return (0, mapper_output_1.mapperOutput)(mappedUsers, {
                pagesCount: Math.ceil(totalCount / pageSize),
                page: pageNumber,
                pageSize: pageSize,
                totalCount: totalCount,
            });
        });
    }
};
exports.UserQueryRepository = UserQueryRepository;
exports.UserQueryRepository = UserQueryRepository = __decorate([
    (0, inversify_1.injectable)()
], UserQueryRepository);
