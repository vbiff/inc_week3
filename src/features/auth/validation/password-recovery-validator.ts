import { body } from "express-validator";

const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const emailValidator = body("email")
  .isString()
  .withMessage({ message: "Invalid email" })
  .matches(emailPattern)
  .withMessage({ message: "Invalid email" });

export const passwordRecoveryValidator = [emailValidator];
