import { cookie } from "express-validator";

export const validateCookie = cookie("refreshToken")
  .exists()
  .withMessage({ message: "cookie should exist" });
