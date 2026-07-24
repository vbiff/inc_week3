"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginAuthValidator = void 0;
const express_validator_1 = require("express-validator");
const loginOrEmailValidator = (0, express_validator_1.body)("loginOrEmail")
    .isString()
    .withMessage("Invalid login or email");
const passwordValidator = (0, express_validator_1.body)("password")
    .isString()
    .withMessage("Invalid password");
exports.loginAuthValidator = [passwordValidator, loginOrEmailValidator];
