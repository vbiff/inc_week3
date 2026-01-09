import { body } from "express-validator";

const loginOrEmailValidator = body("loginOrEmail")
  .isString()
  .withMessage("Invalid login or email");

const passwordValidator = body("password")
  .isString()
  .withMessage("Invalid password");

export const loginAuthValidator = [passwordValidator, loginOrEmailValidator];
