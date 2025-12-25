import { body } from "express-validator";

const loginPattern = /^[a-zA-Z0-9_-]+$/;
const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const loginValidation = body("login")
  .isString()
  .withMessage("Login is wrong")
  .trim()
  .notEmpty()
  .withMessage("Login can not be empty")
  .isLength({ min: 3, max: 10 })
  .withMessage("Login must be at least 3 characters long and less than 10")
  .matches(loginPattern)
  .withMessage("Should match the pattern");

const passwordValidation = body("password")
  .isString()
  .withMessage("Password is wrong")
  .trim()
  .notEmpty()
  .withMessage("Password can not be empty")
  .isLength({ min: 6, max: 10 })
  .withMessage("Password must be at least 6 characters long and less than 20");

const emailValidation = body("email")
  .isString()
  .trim()
  .notEmpty()
  .withMessage("email can not be empty")
  .matches(emailPattern);

export const validationUserInputMiddleware = [
  loginValidation,
  emailValidation,
  passwordValidation,
];
