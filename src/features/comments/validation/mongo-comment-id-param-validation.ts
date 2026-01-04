import { param } from "express-validator";

export const mongoCommentIdValidation = param("commentId")
  .exists()
  .withMessage({ message: "id is required" })
  .isString()
  .withMessage({ message: "id is a String" })
  .isMongoId()
  .withMessage({ message: "id is format of mongodb" });
