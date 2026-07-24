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
exports.refreshTokenGuardMiddleware = void 0;
const http_statuses_1 = require("../../types/http-statuses");
const composition_root_1 = require("../../../composition-root");
const jwt_service_1 = require("../../../features/auth/adapters/jwt-service");
const device_repository_1 = require("../../../features/security/repository/device-repository");
const jwtService = composition_root_1.container.get(jwt_service_1.JwtService);
const deviceRepository = composition_root_1.container.get(device_repository_1.DeviceRepository);
const refreshTokenGuardMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const currentRefreshToken = req.cookies.refreshToken;
    if (!currentRefreshToken) {
        res.sendStatus(http_statuses_1.HttpStatuses.UNAUTHORIZED_401);
        return;
    }
    // 1 verify the token LOGIC TO SERVICE validateRefreshTokenService
    const verifyTokenResult = yield jwtService.verifyRefreshToken(currentRefreshToken);
    if (!verifyTokenResult) {
        res.sendStatus(http_statuses_1.HttpStatuses.UNAUTHORIZED_401);
        return;
    }
    //2 check device
    const isDeviceFound = yield deviceRepository.findDeviceByIdAndIat(verifyTokenResult.deviceId, verifyTokenResult.iat);
    if (!isDeviceFound) {
        res.sendStatus(http_statuses_1.HttpStatuses.UNAUTHORIZED_401);
        return;
    }
    const { id, deviceId } = verifyTokenResult;
    req.user = { id, deviceId };
    next();
});
exports.refreshTokenGuardMiddleware = refreshTokenGuardMiddleware;
