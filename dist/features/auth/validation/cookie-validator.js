"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCookie = void 0;
const express_validator_1 = require("express-validator");
exports.validateCookie = (0, express_validator_1.cookie)("refreshToken")
    .exists()
    .withMessage({ message: "cookie should exist" });
