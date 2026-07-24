"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentInputDtoValidation = void 0;
const express_validator_1 = require("express-validator");
const contentValidation = (0, express_validator_1.body)("content")
    .exists()
    .trim()
    .notEmpty()
    .isLength({ min: 20, max: 300 })
    .withMessage({ message: "Comment between 30 and 300 characters." })
    .isString()
    .withMessage({ message: "The content must be String." });
exports.commentInputDtoValidation = [contentValidation];
