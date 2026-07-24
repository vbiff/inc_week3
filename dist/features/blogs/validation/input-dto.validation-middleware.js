"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogInputDtoValidation = void 0;
const express_validator_1 = require("express-validator");
const urlPattern = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;
const nameValidation = (0, express_validator_1.body)("name")
    .exists()
    .withMessage({ message: "Name is required" })
    .trim()
    .notEmpty()
    .withMessage({ message: "Name is not empty" })
    .isLength({ min: 1, max: 15 })
    .withMessage({
    message: "Name is too long. Should be less 15 symbols",
});
const descriptionValidation = (0, express_validator_1.body)("description")
    .trim()
    .notEmpty()
    .withMessage({ message: "description is not empty" })
    .isLength({ max: 500 })
    .withMessage({
    message: "description should be less than 500 symbols",
});
const websiteUrl = (0, express_validator_1.body)("websiteUrl")
    .trim()
    .notEmpty()
    .withMessage({ message: "websiteUrl is not empty" })
    .isLength({ max: 100 })
    .withMessage({ message: "websiteUrl is too long" })
    .matches(urlPattern)
    .withMessage({ message: "url is wrong" });
exports.blogInputDtoValidation = [
    nameValidation,
    descriptionValidation,
    websiteUrl,
];
