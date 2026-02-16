import { Router } from "express";
import { refreshTokenGuardMiddleware } from "../../../core/middlewares/auth/refresh-token-guard";
import { getAllActiveDevicesHandler } from "./handlers/get-all-active-devices-handler";
import { deleteAllDevicesHandler } from "./handlers/delete-all-devices-handler";
import { deleteDeivceHandler } from "./handlers/delete-deivce-handler";

export const securityRouter = Router();

securityRouter.get(
  "/",
  refreshTokenGuardMiddleware,
  getAllActiveDevicesHandler,
);

securityRouter.delete(
  "/",
  refreshTokenGuardMiddleware,
  deleteAllDevicesHandler,
);

securityRouter.delete(
  "/:deviceId",
  refreshTokenGuardMiddleware,
  deleteDeivceHandler,
);
