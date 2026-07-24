"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapperUserMongoId = mapperUserMongoId;
function mapperUserMongoId(dto) {
    return {
        id: dto._id.toString(),
        login: dto.login,
        email: dto.email,
        createdAt: dto.createdAt,
    };
}
