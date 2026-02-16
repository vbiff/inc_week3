import { Request, Response } from "express";
import { deviceRepository } from "../../repository/device-repository";
import { HttpStatuses } from "../../../../core/types/http-statuses";

export async function getAllActiveDevicesHandler(
  req: Request,
  res: Response,
): Promise<void> {
  const device = await deviceRepository.findDeviceById(req.user!.deviceId);

  if (!device) {
    res.sendStatus(HttpStatuses.NOT_FOUND_404);
    return;
  }

  if (device.userId !== req.user!.id) {
    res.sendStatus(HttpStatuses.FORBIDDEN_403);
    return;
  }

  await deviceRepository.deleteDevice(req.user!.id);

  res.sendStatus(HttpStatuses.NO_CONTENT_204);
}
