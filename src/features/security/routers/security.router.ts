import { Router } from "express";
import { refreshTokenGuardMiddleware } from "../../../core/middlewares/auth/refresh-token-guard";
import { container } from "../../../composition-root";
import { GetAllActiveDevicesHandler } from "./handlers/get-all-active-devices-handler";
import { DeleteAllDevicesHandler } from "./handlers/delete-all-devices-handler";
import { DeleteDeivceHandler } from "./handlers/delete-deivce-handler";

export const securityRouter = Router();

const getAllActiveDevicesHandler = container.get(GetAllActiveDevicesHandler);
const deleteAllDevicesHandler = container.get(DeleteAllDevicesHandler);
const deleteDeivceHandler = container.get(DeleteDeivceHandler);

securityRouter.get(
  "/",
  refreshTokenGuardMiddleware,
  getAllActiveDevicesHandler.getAllActiveDevicesHandler,
);

securityRouter.delete(
  "/",
  refreshTokenGuardMiddleware,
  deleteAllDevicesHandler.deleteAllDevicesHandler,
);

securityRouter.delete(
  "/:deviceId",
  refreshTokenGuardMiddleware,
  deleteDeivceHandler.deleteDeivceHandler,
);
