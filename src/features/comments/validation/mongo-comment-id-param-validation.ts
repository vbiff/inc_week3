import { param } from "express-validator";

export const mongoCommentIdValidation = param("commentId")
  .exists()
  .withMessage("id is required")
  .isString()
  .withMessage("id is a String")
  .isMongoId()
  .withMessage("id is format of mongodb");
