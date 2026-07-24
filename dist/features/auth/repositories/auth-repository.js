"use strict";
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
exports.AuthRepository = void 0;
const refresh_token_entity_1 = require("../domain/refresh_token_entity");
class AuthRepository {
    isTokenInBlackList(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield refresh_token_entity_1.RefreshTokenModel.findOne({ refreshToken: token });
                return !!result;
            }
            catch (err) {
                console.error(err);
                return false;
            }
        });
    }
    addTokenToBlackList(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const entry = refresh_token_entity_1.RefreshTokenEntity.createRefreshToken({
                    refreshToken: token,
                    expiresAt: new Date(Date.now() + 60000),
                });
                yield refresh_token_entity_1.RefreshTokenModel.create(entry);
                return true;
            }
            catch (e) {
                console.error(e);
                return false;
            }
        });
    }
}
exports.AuthRepository = AuthRepository;
