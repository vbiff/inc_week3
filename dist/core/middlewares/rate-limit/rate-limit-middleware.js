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
exports.rateLimitMiddleware = void 0;
const http_statuses_1 = require("../../types/http-statuses");
const rate_limit_model_1 = require("./rate-limit.model");
const rateLimitMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const ip = req.ip || "";
    const url = req.originalUrl;
    yield rate_limit_model_1.RateLimitModel.create({ ip, url, date: new Date() });
    const counts = yield rate_limit_model_1.RateLimitModel.countDocuments({
        ip,
        url,
        date: { $gte: new Date(Date.now() - 10000) },
    });
    if (counts > 5) {
        res.sendStatus(http_statuses_1.HttpStatuses.TOO_MANY_REQUESTS_429);
        return;
    }
    next();
});
exports.rateLimitMiddleware = rateLimitMiddleware;
