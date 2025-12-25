import { Router } from "express";

import { createUserHandler } from "./handlers/create-user-handler";
import { validationUserInputMiddleware } from "../validation/input-dto-validation-users-middleware";
import { validationResultMiddleware } from "../../core/middlewares/validation/input-validation-result-middleware";
import { getUserHandler } from "./handlers/get-user-handler";
import { getAllUsersHandler } from "./handlers/get-all-users-handler";

export const userRouter = Router();

//create user
userRouter.post(
  "/",
  validationUserInputMiddleware,
  validationResultMiddleware,
  createUserHandler,
);

//get user by id
userRouter.get("/:id", getUserHandler);

//get all users
userRouter.get("/", getAllUsersHandler);
