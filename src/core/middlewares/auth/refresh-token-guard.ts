import { Request, Response, NextFunction } from "express";
import { HttpStatuses } from "../../types/http-statuses";
import { ioc } from "../../../composition-root";
import { JwtService } from "../../../features/auth/adapters/jwt-service";
import { DeviceRepository } from "../../../features/security/repository/device-repository";

const jwtService = ioc.getInstance<JwtService>(JwtService);
const deviceRepository = ioc.getInstance<DeviceRepository>(DeviceRepository);

export const refreshTokenGuardMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const currentRefreshToken: string = req.cookies.refreshToken;
  if (!currentRefreshToken) {
    res.sendStatus(HttpStatuses.UNAUTHORIZED_401);
    return;
  }

  // 1 verify the token LOGIC TO SERVICE validateRefreshTokenService
  const verifyTokenResult =
    await jwtService.verifyRefreshToken(currentRefreshToken);
  if (!verifyTokenResult) {
    res.sendStatus(HttpStatuses.UNAUTHORIZED_401);
    return;
  }

  //2 check device
  const isDeviceFound = await deviceRepository.findDeviceByIdAndIat(
    verifyTokenResult!.deviceId,
    verifyTokenResult!.iat,
  );
  if (!isDeviceFound) {
    res.sendStatus(HttpStatuses.UNAUTHORIZED_401);
    return;
  }

  const { id, deviceId } = verifyTokenResult!;

  req.user = { id, deviceId };

  next();
};
