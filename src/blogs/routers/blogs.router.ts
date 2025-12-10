import { Router, Request, Response } from "express";
import { blogInputDto } from "../dto/blog.input_dto";
import { getAllBlogsHandler } from "./handlers/get-all-blogs.handler";
import { getBlogById } from "./handlers/get-by-id.handler";
import { createBlogHandler } from "./handlers/create-blog.handler";
import { updateBlogHandler } from "./handlers/update-blog.handler";
import { deleteBlogHandler } from "./handlers/delete-blog.handler";
import {body, FieldValidationError, ValidationError, validationResult} from "express-validator";

const urlPattern =
  /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;

const formatErrors = (error: ValidationError) => {
    const expressError = error as unknown as FieldValidationError
    return {
        field: expressError.path,
        message: expressError.msg.message
    }
}

export const blogRouter = Router();
//get all
blogRouter.get("/", (req: Request, res: Response) => {
  getAllBlogsHandler(req, res);
});
// create
blogRouter.post(
  "/",
  body("name")
      .exists().withMessage({ field: "name", message: "Name is required" })
    .trim()
    .isLength({ max: 15 })
    .withMessage({ field: "name", message: "Name is too long. Should be less 15 symbols" }),
  body("description")
    .trim()
    .isLength({ max: 500 })
    .withMessage({
      field: "description",
      message: "description should be less than 500 symbols",
    }),
  body("websiteUrl")
    .trim()
      .isLength({ max: 100 }).withMessage({ field: "websiteUrl", message: "websiteUrl is too long" })
    .matches(urlPattern)
    .withMessage({ field: "websiteUrl", message: "url is wrong" }),

  (req: Request<blogInputDto>, res: Response) => {
    const result = validationResult(req).formatWith(formatErrors).array({onlyFirstError: true});
    if (result.length > 0) {
      return res.status(400).send({ errorsMessages: result });
    }
    createBlogHandler(req, res);
  },
);

// get by id

blogRouter.get("/:id", (req: Request, res: Response) => {
  getBlogById(req, res);
});

// update
blogRouter.put("/:id", (req: Request, res: Response) => {
  updateBlogHandler(req, res);
});

//delete
blogRouter.delete("/:id", (req: Request, res: Response) => {
  deleteBlogHandler(req, res);
});
