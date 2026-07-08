import { Router } from "express";

import { CreateUserHandler } from "./handlers/create-user-handler";
import { validationUserInputMiddleware } from "../validation/input-dto-validation-users-middleware";
import { validationResultMiddleware } from "../../../core/middlewares/validation/validation-result-middleware";
import { GetUserHandler } from "./handlers/get-user-handler";
import { GetAllUsersHandler } from "./handlers/get-all-users-handler";
import { adminGuardMiddleware } from "../../../core/middlewares/auth/admin.guard-middleware";
import { DeleteUserHandler } from "./handlers/delete-user-handler";
import { container } from "../../../composition-root";

const createUserHandler = container.get(CreateUserHandler);
const getUserHandler = container.get(GetUserHandler);
const getAllUsersHandler = container.get(GetAllUsersHandler);
const deleteUserHandler = container.get(DeleteUserHandler);

export const userRouter = Router();

//create user
userRouter.post(
  "/",
  adminGuardMiddleware,
  validationUserInputMiddleware,
  validationResultMiddleware,
  createUserHandler.createUserHandler,
);

//get user by id
userRouter.get("/:id", adminGuardMiddleware, getUserHandler.getUserHandler);

//get all users
userRouter.get("/", adminGuardMiddleware, getAllUsersHandler.getAllUsersHandler);

//delete user by id
userRouter.delete("/:id", adminGuardMiddleware, deleteUserHandler.deleteUserHandler);
