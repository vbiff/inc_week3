import { Request, Response } from "express";
import { deviceRepository } from "../../repository/device-repository";
import { HttpStatuses } from "../../../../core/types/http-statuses";

export async function getAllActiveDevicesHandler(
  req: Request,
  res: Response,
): Promise<void> {
  await deviceRepository.deleteAllDevicesExceptCurrent(
    req.user!.id,
    req.user!.deviceId,
  );

  res.sendStatus(HttpStatuses.NO_CONTENT_204);
}
