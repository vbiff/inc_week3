import { Router } from "express";
import { loginAuthHandler } from "./handlers/login-auth-handler";
import { authValidator } from "../validation/input-auth-validator";
import { LOGIN_PATH } from "../../../core/paths/paths";

export const authRouter = Router();

authRouter.post(LOGIN_PATH, authValidator, loginAuthHandler);
