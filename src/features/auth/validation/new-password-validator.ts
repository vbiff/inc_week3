import { body } from "express-validator";

const newPasswordValidator = body("newPassword")
  .isString()
  .withMessage({ message: "Invalid password" })
  .isLength({ min: 6, max: 20 })
  .withMessage({ message: "Invalid password" });

const recoveryCodeValidator = body("recoveryCode")
  .isString()
  .withMessage({ message: "Invalid recovery code" });

export const newPasswordInputValidator = [
  newPasswordValidator,
  recoveryCodeValidator,
];
