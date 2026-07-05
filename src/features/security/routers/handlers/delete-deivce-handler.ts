import { Request, Response } from "express";
import { ioc } from "../../../../composition-root";
import { DeviceRepository } from "../../repository/device-repository";

const deviceRepository = ioc.getInstance<DeviceRepository>(DeviceRepository);
import { HttpStatuses } from "../../../../core/types/http-statuses";

export async function deleteDeivceHandler(
  req: Request,
  res: Response,
): Promise<void> {
  const device = await deviceRepository.findDeviceById(req.params.deviceId);

  if (!device) {
    res.sendStatus(HttpStatuses.NOT_FOUND_404);
    return;
  }

  if (device.userId !== req.user!.id) {
    res.sendStatus(HttpStatuses.FORBIDDEN_403);
    return;
  }

  await deviceRepository.deleteDevice(req.params.deviceId);

  res.sendStatus(HttpStatuses.NO_CONTENT_204);
}
