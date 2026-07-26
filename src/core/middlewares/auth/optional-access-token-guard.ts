import { Request, Response, NextFunction } from "express";
import { container } from "../../../composition-root";
import { JwtService } from "../../../features/auth/adapters/jwt-service";

const jwtService = container.get(JwtService);

// Unlike accessTokenGuardMiddleware, this never responds 401: anonymous
// requests pass through with req.user = null, so read endpoints can serve
// both authorized and unauthorized users (myStatus resolution).
export const optionalAccessTokenGuardMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  req.user = null;

  const auth = req.headers["authorization"] as string | undefined;
  if (!auth) {
    next();
    return;
  }

  const [authType, token] = auth.split(" ");
  if (authType !== "Bearer" || !token) {
    next();
    return;
  }

  const payload = await jwtService.verifyAccessToken(token);
  if (!payload) {
    next();
    return;
  }

  req.user = { id: payload.id, deviceId: "" };
  next();
};
