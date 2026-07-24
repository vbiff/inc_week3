"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenModel = exports.RefreshTokenSchema = exports.RefreshTokenEntity = void 0;
const mongoose_1 = require("mongoose");
class RefreshTokenEntity {
    constructor(refreshToken, expiresAt) {
        this.refreshToken = refreshToken;
        this.expiresAt = expiresAt;
    }
    static createRefreshToken(dto) {
        return new RefreshTokenEntity(dto.refreshToken, dto.expiresAt);
    }
}
exports.RefreshTokenEntity = RefreshTokenEntity;
exports.RefreshTokenSchema = new mongoose_1.Schema({
    refreshToken: { type: String, required: true },
    expiresAt: { type: Date, required: true },
});
exports.RefreshTokenSchema.loadClass(RefreshTokenEntity);
exports.RefreshTokenModel = (0, mongoose_1.model)("RefreshToken", exports.RefreshTokenSchema);
