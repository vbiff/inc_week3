import { Router } from "express";
import { LoginAuthHandler } from "./handlers/login-auth-handler";
import { loginAuthValidator } from "../validation/login-input-auth-validator";
import { LOGIN_PATH } from "../../../core/paths/paths";
import { accessTokenGuardMiddleware } from "../../../core/middlewares/auth/access-token-guard";
import { MeAuthHandler } from "./handlers/me-auth-handler";
import { registrationAuthValidator } from "../validation/registartion-input-validation";
import { validationResultMiddleware } from "../../../core/middlewares/validation/validation-result-middleware";
import { RegistrationAuthHandler } from "./handlers/registration-auth-handler";
import { registrationEmailResendingAuthValidator } from "../validation/registration-email-resending-validation";
import { RegistrationEmailResendingHandler } from "./handlers/registration-email-resending-handler";
import { RegistrationConfirmationHandler } from "./handlers/registration-confirmation-handler";
import { RefreshTokenHandler } from "./handlers/refresh-token-handler";
import { validateCookie } from "../validation/cookie-validator";
import { LogoutHandler } from "./handlers/logout-handler";
import { refreshTokenGuardMiddleware } from "../../../core/middlewares/auth/refresh-token-guard";
import { rateLimitMiddleware } from "../../../core/middlewares/rate-limit/rate-limit-middleware";
import { passwordRecoveryValidator } from "../validation/password-recovery-validator";
import { PasswordRecoveryHandler } from "./handlers/password-recovery-handler";
import { newPasswordInputValidator } from "../validation/new-password-validator";
import { NewPasswordHandler } from "./handlers/new-password-handler";
import { container } from "../../../composition-root";

const loginAuthHandler = container.get(LoginAuthHandler);
const meAuthHandler = container.get(MeAuthHandler);
const registrationAuthHandler = container.get(RegistrationAuthHandler);
const registrationEmailResendingHandler = container.get(
  RegistrationEmailResendingHandler,
);
const registrationConfirmationHandler = container.get(
  RegistrationConfirmationHandler,
);
const refreshTokenHandler = container.get(RefreshTokenHandler);
const logoutHandler = container.get(LogoutHandler);
const passwordRecoveryHandler = container.get(PasswordRecoveryHandler);
const newPasswordHandler = container.get(NewPasswordHandler);

export const authRouter = Router();

authRouter.post(
  LOGIN_PATH,
  rateLimitMiddleware,
  loginAuthValidator,
  loginAuthHandler.loginAuthHandler,
);

authRouter.get(
  "/me",
  accessTokenGuardMiddleware,
  meAuthHandler.meAuthHandler,
);

authRouter.post(
  "/refresh-token",
  validateCookie,
  refreshTokenGuardMiddleware,
  refreshTokenHandler.refreshTokenHandler,
);

authRouter.post(
  "/logout",
  validateCookie,
  refreshTokenGuardMiddleware,
  logoutHandler.logoutHandler,
);

authRouter.post(
  "/registration",
  rateLimitMiddleware,
  registrationAuthValidator,

  validationResultMiddleware,
  registrationAuthHandler.registrationAuthHandler,
);

authRouter.post(
  "/registration-email-resending",
  rateLimitMiddleware,
  registrationEmailResendingAuthValidator,
  validationResultMiddleware,
  registrationEmailResendingHandler.registrationEmailResendingHandler,
);

authRouter.post(
  "/registration-confirmation",
  rateLimitMiddleware,
  registrationConfirmationHandler.registrationConfirmationHandler,
);

authRouter.post(
  "/password-recovery",
  rateLimitMiddleware,
  passwordRecoveryValidator,
  validationResultMiddleware,
  passwordRecoveryHandler.passwordRecoveryHandler,
);

authRouter.post(
  "/new-password",
  rateLimitMiddleware,
  newPasswordInputValidator,
  validationResultMiddleware,
  newPasswordHandler.newPasswordHandler,
);
