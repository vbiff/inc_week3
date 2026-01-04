import { body } from "express-validator";

const contentValidation = body("content")
  .exists()
  .trim()
  .notEmpty()
  .isString()
  .withMessage("The content must be String.");

export const commentInputDtoValidation = [contentValidation];
