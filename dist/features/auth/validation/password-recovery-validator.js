"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordRecoveryValidator = void 0;
const express_validator_1 = require("express-validator");
const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const emailValidator = (0, express_validator_1.body)("email")
    .isString()
    .withMessage({ message: "Invalid email" })
    .matches(emailPattern)
    .withMessage({ message: "Invalid email" });
exports.passwordRecoveryValidator = [emailValidator];
