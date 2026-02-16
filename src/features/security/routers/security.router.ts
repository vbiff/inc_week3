import { Router } from "express";
import { refreshTokenGuardMiddleware } from "../../../core/middlewares/auth/refresh-token-guard";
import { getAllActiveDevicesHandler } from "./handlers/get-all-active-devices-handler";

export const securityRouter = Router();

securityRouter.get(
  "/",
  refreshTokenGuardMiddleware,
  getAllActiveDevicesHandler,
);

securityRouter.delete(
  "/",
  refreshTokenGuardMiddleware,
  getAllActiveDevicesHandler,
);

securityRouter.delete(
  "/:deviceId",
  refreshTokenGuardMiddleware,
  getAllActiveDevicesHandler,
);
