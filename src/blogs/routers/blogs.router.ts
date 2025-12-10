import { Router, Request, Response } from "express";
import { blogInputDto } from "../dto/blog.input_dto";
import { getAllBlogsHandler } from "./handlers/get-all-blogs.handler";
import { getBlogById } from "./handlers/get-by-id.handler";
import { createBlogHandler } from "./handlers/create-blog.handler";
import { updateBlogHandler } from "./handlers/update-blog.handler";
import { deleteBlogHandler } from "./handlers/delete-blog.handler";
import {body, validationResult} from "express-validator";

const urlPattern = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;


export const blogRouter = Router();
//get all
blogRouter.get("/", (req: Request, res: Response) => {
  getAllBlogsHandler(req, res);
});
// create
blogRouter.post(
  "/",
  body("name").trim().isLength({ max: 15 }),
  body('description').trim().isLength({ max: 500 }),
  body('websiteUrl').trim().matches(urlPattern),

  (req: Request<blogInputDto>, res: Response) => {
      const result = validationResult(req);
      if (!result.isEmpty()) {
          return res.status(400).send({ errors: result.array() });
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
