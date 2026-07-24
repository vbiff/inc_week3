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
exports.DeleteUserHandler = void 0;
const user_repository_mongodb_1 = require("../../repositories/user-repository-mongodb");
const http_statuses_1 = require("../../../../core/types/http-statuses");
const inversify_1 = require("inversify");
let DeleteUserHandler = class DeleteUserHandler {
    constructor(userRepository) {
        this.userRepository = userRepository;
        this.deleteUserHandler = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const isDeleted = yield this.userRepository.deleteUser(req.params.id);
            if (!isDeleted) {
                res.sendStatus(http_statuses_1.HttpStatuses.NOT_FOUND_404);
            }
            res.sendStatus(http_statuses_1.HttpStatuses.NO_CONTENT_204);
        });
    }
};
exports.DeleteUserHandler = DeleteUserHandler;
exports.DeleteUserHandler = DeleteUserHandler = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(user_repository_mongodb_1.UserRepository)),
    __metadata("design:paramtypes", [user_repository_mongodb_1.UserRepository])
], DeleteUserHandler);
