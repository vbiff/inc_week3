import { Router } from "express";

import { createUserHandler } from "./handlers/create-user-handler";
import { validationUserInputMiddleware } from "../validation/input-dto-validation-users-middleware";
import { validationResultMiddleware } from "../../core/middlewares/validation/input-validation-result-middleware";
import { getUserHandler } from "./handlers/get-user-handler";
import { getAllUsersHandler } from "./handlers/get-all-users-handler";
import { adminGuardMiddleware } from "../../core/middlewares/auth/admin.guard-middleware";
import { deleteUserHandler } from "./handlers/delete-user-handler";

export const userRouter = Router();

//create user
userRouter.post(
  "/",
  adminGuardMiddleware,
  validationUserInputMiddleware,
  validationResultMiddleware,
  createUserHandler,
);

//get user by id
userRouter.get("/:id", adminGuardMiddleware, getUserHandler);

//get all users
userRouter.get("/", adminGuardMiddleware, getAllUsersHandler);

//delete user by id
userRouter.delete("/:id", adminGuardMiddleware, deleteUserHandler);
