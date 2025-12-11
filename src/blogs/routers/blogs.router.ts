import { Router, Request, Response } from "express";
import { blogInputDto } from "../dto/blog.input_dto";
import { getAllBlogsHandler } from "./handlers/get-all-blogs.handler";
import { getBlogById } from "./handlers/get-by-id.handler";
import { createBlogHandler } from "./handlers/create-blog.handler";
import { updateBlogHandler } from "./handlers/update-blog.handler";
import { deleteBlogHandler } from "./handlers/delete-blog.handler";
import { validationResultMiddleware } from "../../core/middlewares/validation/input-validation-result-middleware";
import { blogInputDtoValidation } from "../validation/input-dto.validation-middleware";

export const blogRouter = Router();
//get all
blogRouter.get("/", (req: Request, res: Response) => {
  getAllBlogsHandler(req, res);
});
// create
blogRouter.post(
  "/",
  blogInputDtoValidation,
  validationResultMiddleware,
  (req: Request<blogInputDto>, res: Response) => {
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
