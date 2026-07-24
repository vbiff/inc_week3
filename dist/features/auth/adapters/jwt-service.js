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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtService = void 0;
const config_1 = require("../../../core/config/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const inversify_1 = require("inversify");
let JwtService = class JwtService {
    createAccessToken(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return jsonwebtoken_1.default.sign({ id: userId }, config_1.AppConfig.SECRET, { expiresIn: "10m" });
        });
    }
    createRefreshToken(userId, did) {
        return __awaiter(this, void 0, void 0, function* () {
            return jsonwebtoken_1.default.sign({ id: userId, deviceId: did }, config_1.AppConfig.REFRESH_SECRET, {
                expiresIn: "20m",
            });
        });
    }
    verifyAccessToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return jsonwebtoken_1.default.verify(token, config_1.AppConfig.SECRET);
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
    verifyRefreshToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return jsonwebtoken_1.default.verify(token, config_1.AppConfig.REFRESH_SECRET);
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
};
exports.JwtService = JwtService;
exports.JwtService = JwtService = __decorate([
    (0, inversify_1.injectable)()
], JwtService);
