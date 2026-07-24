"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newPasswordInputValidator = void 0;
const express_validator_1 = require("express-validator");
const newPasswordValidator = (0, express_validator_1.body)("newPassword")
    .isString()
    .withMessage({ message: "Invalid password" })
    .isLength({ min: 6, max: 20 })
    .withMessage({ message: "Invalid password" });
const recoveryCodeValidator = (0, express_validator_1.body)("recoveryCode")
    .isString()
    .withMessage({ message: "Invalid recovery code" });
exports.newPasswordInputValidator = [
    newPasswordValidator,
    recoveryCodeValidator,
];
