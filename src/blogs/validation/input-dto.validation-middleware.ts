import { body } from "express-validator";

const urlPattern =
  /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;

const nameValidation = body("name")
  .trim()
  .exists()
  .withMessage({ message: "Name is required" })
  .isLength({ min: 1, max: 15 })
  .withMessage({
    message: "Name is too long. Should be less 15 symbols",
  });
const descriptionValidation = body("description")
  .trim()
  .isLength({ max: 500 })
  .withMessage({
    message: "description should be less than 500 symbols",
  });
const websiteUrl = body("websiteUrl")
  .trim()
  .isLength({ max: 100 })
  .withMessage({ message: "websiteUrl is too long" })
  .matches(urlPattern)
  .withMessage({ message: "url is wrong" });

// const isMembership = body("isMembership")
//   .trim()
//   .isBoolean()
//   .withMessage({ message: "isMembership should be boolean" });

export const blogInputDtoValidation = [
  nameValidation,
  descriptionValidation,
  websiteUrl,
  // isMembership,
];
