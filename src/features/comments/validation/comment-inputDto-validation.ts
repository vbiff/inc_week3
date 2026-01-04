import { body } from "express-validator";

const contentValidation = body("content")
  .exists()
  .trim()
  .notEmpty()
  .isLength({ min: 20, max: 300 })
  .withMessage({ message: "Comment between 30 and 300 characters." })
  .isString()
  .withMessage({ message: "The content must be String." });

export const commentInputDtoValidation = [contentValidation];
