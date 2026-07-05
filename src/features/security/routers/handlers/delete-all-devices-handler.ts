import { Request, Response } from "express";
import { container } from "../../../../composition-root";
import { DeviceRepository } from "../../repository/device-repository";

const deviceRepository = container.get(DeviceRepository);
import { HttpStatuses } from "../../../../core/types/http-statuses";

export async function deleteAllDevicesHandler(
  req: Request,
  res: Response,
): Promise<void> {
  await deviceRepository.deleteAllDevicesExceptCurrent(
    req.user!.id,
    req.user!.deviceId,
  );

  res.sendStatus(HttpStatuses.NO_CONTENT_204);
}
