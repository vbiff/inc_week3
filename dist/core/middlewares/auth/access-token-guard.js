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
exports.accessTokenGuardMiddleware = void 0;
const http_statuses_1 = require("../../types/http-statuses");
const composition_root_1 = require("../../../composition-root");
const jwt_service_1 = require("../../../features/auth/adapters/jwt-service");
const jwtService = composition_root_1.container.get(jwt_service_1.JwtService);
const accessTokenGuardMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const auth = req.headers["authorization"];
    if (!auth) {
        res.sendStatus(http_statuses_1.HttpStatuses.UNAUTHORIZED_401);
    }
    const [authType, token] = auth.split(" ");
    if (authType !== "Bearer") {
        res.sendStatus(http_statuses_1.HttpStatuses.UNAUTHORIZED_401);
    }
    const payload = yield jwtService.verifyAccessToken(token);
    if (!payload) {
        res.sendStatus(http_statuses_1.HttpStatuses.UNAUTHORIZED_401);
    }
    const { id } = payload;
    req.user = { id: id, deviceId: "" };
    next();
});
exports.accessTokenGuardMiddleware = accessTokenGuardMiddleware;
