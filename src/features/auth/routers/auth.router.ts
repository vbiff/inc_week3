import { Router } from "express";
import { loginAuthHandler } from "./handlers/login-auth-handler";
import { loginAuthValidator } from "../validation/login-input-auth-validator";
import { LOGIN_PATH } from "../../../core/paths/paths";
import { accessTokenGuardMiddleware } from "../../../core/middlewares/auth/access-token-guard";
import { meAuthHandler } from "./handlers/me-auth-handler";
import { registrationAuthValidator } from "../validation/registartion-input-validation";
import { validationResultMiddleware } from "../../../core/middlewares/validation/validation-result-middleware";
import { registrationAuthHandler } from "./handlers/registration-auth-handler";

export const authRouter = Router();

authRouter.post(LOGIN_PATH, loginAuthValidator, loginAuthHandler);

authRouter.get("/me", accessTokenGuardMiddleware, meAuthHandler);

authRouter.post(
  "/registration",
  registrationAuthValidator,
  validationResultMiddleware,
  registrationAuthHandler,
);
