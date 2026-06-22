import { Router } from "express";
import { loginAuthHandler } from "./handlers/login-auth-handler";
import { loginAuthValidator } from "../validation/login-input-auth-validator";
import { LOGIN_PATH } from "../../../core/paths/paths";
import { accessTokenGuardMiddleware } from "../../../core/middlewares/auth/access-token-guard";
import { meAuthHandler } from "./handlers/me-auth-handler";
import { registrationAuthValidator } from "../validation/registartion-input-validation";
import { validationResultMiddleware } from "../../../core/middlewares/validation/validation-result-middleware";
import { registrationAuthHandler } from "./handlers/registration-auth-handler";
import { registrationEmailResendingAuthValidator } from "../validation/registration-email-resending-validation";
import { registrationEmailResendingHandler } from "./handlers/registration-email-resending-handler";
import { registrationConfirmationHandler } from "./handlers/registration-confirmation-handler";
import { refreshTokenHandler } from "./handlers/refresh-token-handler";
import { validateCookie } from "../validation/cookie-validator";
import { logoutHandler } from "./handlers/logout-handler";
import { refreshTokenGuardMiddleware } from "../../../core/middlewares/auth/refresh-token-guard";
import { rateLimitMiddleware } from "../../../core/middlewares/rate-limit/rate-limit-middleware";

export const authRouter = Router();

authRouter.post(
  LOGIN_PATH,
  rateLimitMiddleware,
  loginAuthValidator,
  loginAuthHandler,
);

authRouter.get("/me", accessTokenGuardMiddleware, meAuthHandler);

authRouter.post(
  "/refresh-token",
  validateCookie,
  refreshTokenGuardMiddleware,
  refreshTokenHandler,
);

authRouter.post(
  "/logout",
  validateCookie,
  refreshTokenGuardMiddleware,
  logoutHandler,
);

authRouter.post(
  "/registration",
  rateLimitMiddleware,
  registrationAuthValidator,

  validationResultMiddleware,
  registrationAuthHandler,
);

authRouter.post(
  "/registration-email-resending",
  rateLimitMiddleware,
  registrationEmailResendingAuthValidator,
  validationResultMiddleware,
  registrationEmailResendingHandler,
);

authRouter.post(
  "/registration-confirmation",
  rateLimitMiddleware,
  registrationConfirmationHandler,
);
