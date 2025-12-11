import { Router, Request, Response } from "express";
import { createPostHandler } from "./handlers/create-post.handler";
import { getPostById } from "./handlers/get-post-by-id.handler";
import { updatePostHandler } from "./handlers/update-post.handler";
import { deletePostHandler } from "./handlers/delete-post.handler";
import { validationResultMiddleware } from "../../core/middlewares/validation/input-validation-result-middleware";
import { getAllPostsHandler } from "./handlers/get-all-posts.handler";
import { PostInputDTO } from "../dto/post-input-dto";
import { postInputDtoValidation } from "../validation/input-dto.validation-middleware";
import { adminGuardMiddleware } from "../../core/middlewares/auth/admin.guard-middleware";

export const postRouter = Router();

//get all
postRouter.get("/", (req: Request, res: Response) => {
  getAllPostsHandler(req, res);
});
// create
postRouter.post(
  "/",
  adminGuardMiddleware,
  postInputDtoValidation,
  validationResultMiddleware,
  (req: Request<PostInputDTO>, res: Response) => {
    createPostHandler(req, res);
  },
);

// get by id

postRouter.get("/:id", (req: Request, res: Response) => {
  getPostById(req, res);
});

// update
postRouter.put(
  "/:id",
  adminGuardMiddleware,
  postInputDtoValidation,
  validationResultMiddleware,
  (req: Request, res: Response) => {
    updatePostHandler(req, res);
  },
);

//delete
postRouter.delete(
  "/:id",
  adminGuardMiddleware,
  (req: Request, res: Response) => {
    deletePostHandler(req, res);
  },
);
