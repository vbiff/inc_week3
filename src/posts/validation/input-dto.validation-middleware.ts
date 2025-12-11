import { body } from "express-validator";


const titleValidation = body("title")
    .trim()
    .exists()
    .withMessage({ message: "Name is required" })
    .notEmpty().withMessage({ message: "Title can not be empty" })
    .isLength({ max: 30 })
    .withMessage({
        message: "Name is too long. Should be less 30 symbols",
    });
const shortDescriptionValidation = body("shortDescription")
    .exists().withMessage({ message: "Description is required" })
    .trim()
    .notEmpty().withMessage({ message: "Description can not be empty" })
    .isLength({ max: 100 })
    .withMessage({
        message: "description should be less than 100 symbols",
    });
const content = body("content")
    .trim()
    .notEmpty().withMessage({ message: "Content is required" })
    .isLength({ max: 1000 })
    .withMessage({ message: "content is too long" })

const blogId = body("blogId")
    .trim()
    .exists()
    .isLength({ max: 100 })
    .withMessage({ message: "blogId is needed" })

export const postInputDtoValidation = [
    titleValidation,
    shortDescriptionValidation,
    content,
    blogId
];
