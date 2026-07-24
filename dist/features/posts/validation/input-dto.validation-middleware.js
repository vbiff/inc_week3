"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postInputDtoValidation = void 0;
const express_validator_1 = require("express-validator");
const titleValidation = (0, express_validator_1.body)("title")
    .trim()
    .exists()
    .withMessage({ message: "Name is required" })
    .notEmpty()
    .withMessage({ message: "Title can not be empty" })
    .isLength({ max: 30 })
    .withMessage({
    message: "Name is too long. Should be less 30 symbols",
});
const shortDescriptionValidation = (0, express_validator_1.body)("shortDescription")
    .exists()
    .withMessage({ message: "Description is required" })
    .trim()
    .notEmpty()
    .withMessage({ message: "Description can not be empty" })
    .isLength({ max: 100 })
    .withMessage({
    message: "description should be less than 100 symbols",
});
const content = (0, express_validator_1.body)("content")
    .trim()
    .notEmpty()
    .withMessage({ message: "Content is required" })
    .isLength({ max: 1000 })
    .withMessage({ message: "content is too long" });
const blogId = (0, express_validator_1.body)("blogId")
    .trim()
    .notEmpty()
    .isLength({ max: 100 })
    .withMessage({ message: "blogId is needed" });
exports.postInputDtoValidation = [
    titleValidation,
    shortDescriptionValidation,
    content,
    blogId,
];
