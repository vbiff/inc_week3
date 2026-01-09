import { body } from "express-validator";

const loginPattern = /^[a-zA-Z0-9_-]+$/;
const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const loginValidator = body("login")
  .isString()
  .withMessage("Invalid login")
  .isLength({ min: 3, max: 10 })
  .withMessage("Invalid login")
  .matches(loginPattern)
  .withMessage("Invalid login");

const passwordValidator = body("password")
  .isString()
  .withMessage("Invalid password")
  .isLength({ min: 6, max: 20 })
  .withMessage("Invalid password");

const emailValidator = body("email")
  .isString()
  .withMessage("Invalid email")
  .matches(emailPattern)
  .withMessage("Invalid email");

export const registrationAuthValidator = [
  passwordValidator,
  loginValidator,
  emailValidator,
];
