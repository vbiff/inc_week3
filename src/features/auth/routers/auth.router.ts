import { Router } from "express";
import { loginAuthHandler } from "./handlers/login-auth-handler";
import { authValidator } from "../validation/input-auth-validator";
import { LOGIN_PATH } from "../../../core/paths/paths";
import { accessTokenGuardMiddleware } from "../../../core/middlewares/auth/access-token-guard";
import { meAuthHandler } from "./handlers/me-auth-handler";

export const authRouter = Router();

authRouter.post(LOGIN_PATH, authValidator, loginAuthHandler);

authRouter.get("/me", accessTokenGuardMiddleware, meAuthHandler);
