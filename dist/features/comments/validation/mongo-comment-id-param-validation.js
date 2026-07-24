"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoCommentIdValidation = void 0;
const express_validator_1 = require("express-validator");
exports.mongoCommentIdValidation = (0, express_validator_1.param)("commentId")
    .exists()
    .withMessage({ message: "id is required" })
    .isString()
    .withMessage({ message: "id is a String" })
    .isMongoId()
    .withMessage({ message: "id is format of mongodb" });
