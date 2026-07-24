"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogMongoIdValidation = void 0;
const express_validator_1 = require("express-validator");
exports.blogMongoIdValidation = (0, express_validator_1.param)("blogId")
    .exists()
    .withMessage("id is required")
    .isString()
    .withMessage("id is a String")
    .isMongoId()
    .withMessage("id is format of mongodb");
