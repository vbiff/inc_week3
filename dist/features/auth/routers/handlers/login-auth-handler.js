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
exports.LoginAuthHandler = void 0;
const http_statuses_1 = require("../../../../core/types/http-statuses");
const auth_service_1 = require("../../application/command-services/auth-service");
const resultCode_1 = require("../../../../core/result/resultCode");
const resultCodeToHttpException_1 = require("../../../../core/result/resultCodeToHttpException");
const inversify_1 = require("inversify");
let LoginAuthHandler = class LoginAuthHandler {
    constructor(authService) {
        this.authService = authService;
        this.loginAuthHandler = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const title = req.headers["user-agent"] || "Unknown device";
                const ip = req.ip || "Unknown ip";
                const authResult = yield this.authService.login(req.body, title, ip);
                if (authResult.status !== resultCode_1.ResultStatus.Success) {
                    res
                        .status((0, resultCodeToHttpException_1.resultCodeToHttpException)(authResult.status))
                        .send(authResult.extensions);
                    return;
                }
                res
                    .cookie("refreshToken", (_a = authResult.data) === null || _a === void 0 ? void 0 : _a.refreshToken, {
                    httpOnly: true,
                    secure: true,
                    expires: new Date(Date.now() + 900000),
                    path: "/",
                })
                    .status(http_statuses_1.HttpStatuses.OK_200)
                    .send({ accessToken: (_b = authResult.data) === null || _b === void 0 ? void 0 : _b.accessToken });
            }
            catch (e) {
                console.error(e);
                res.sendStatus(http_statuses_1.HttpStatuses.SERVERERROR_500);
            }
        });
    }
};
exports.LoginAuthHandler = LoginAuthHandler;
exports.LoginAuthHandler = LoginAuthHandler = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(auth_service_1.AuthService)),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], LoginAuthHandler);
