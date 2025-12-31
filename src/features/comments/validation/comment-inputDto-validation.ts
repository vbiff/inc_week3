import { body } from "express-validator";

const contentValidation = body("content")
  .trim()
  .notEmpty()
  .isString()
  .withMessage("The content must be String.");

export const commentInputDtoValidation = [contentValidation];
