"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitModel = exports.RateLimitSchema = void 0;
const mongoose_1 = require("mongoose");
exports.RateLimitSchema = new mongoose_1.Schema({
    ip: { type: String, required: true },
    url: { type: String, required: true },
    date: { type: Date, required: true },
});
exports.RateLimitModel = (0, mongoose_1.model)("RateLimit", exports.RateLimitSchema);
