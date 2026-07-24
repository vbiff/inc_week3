"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapperToAuthMeDto = void 0;
const mapperToAuthMeDto = (rawUser) => {
    return {
        email: rawUser.email,
        login: rawUser.login,
        userId: rawUser._id.toString(),
    };
};
exports.mapperToAuthMeDto = mapperToAuthMeDto;
