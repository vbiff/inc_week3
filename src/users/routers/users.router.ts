import { Router } from "express";

import { createUserHandler } from "./handlers/create-user-handler";

export const userRouter = Router();

//create user

userRouter.post("/", createUserHandler);
