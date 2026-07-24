"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateBasicAuthToken = generateBasicAuthToken;
const admin_guard_middleware_1 = require("../middlewares/auth/admin.guard-middleware");
function generateBasicAuthToken() {
    const credentials = `${admin_guard_middleware_1.ADMIN_USERNAME}:${admin_guard_middleware_1.ADMIN_PASSWORD}`;
    const token = Buffer.from(credentials).toString("base64");
    return `Basic ${token}`;
}
