import { body } from "express-validator";

const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const emailValidator = body("email")
  .isString()
  .withMessage("Invalid email")
  .matches(emailPattern)
  .withMessage("Invalid email");

export const registrationEmailResendingAuthValidator = [emailValidator];
