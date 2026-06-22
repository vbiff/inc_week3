import { Request, Response } from "express";
import { deviceRepository } from "../../../../composition-root";
import { HttpStatuses } from "../../../../core/types/http-statuses";
import { deviceViewMapper } from "../../mappers/device-view-mapper";

export async function getAllActiveDevicesHandler(
  req: Request,
  res: Response,
): Promise<void> {
  const allActiveDevices = await deviceRepository.findAllDevicesByUserId(
    req.user!.id,
  );

  if (!allActiveDevices) {
    res.sendStatus(HttpStatuses.NOT_FOUND_404);
    return;
  }

  const result = allActiveDevices.map((d) => deviceViewMapper(d));

  res.status(HttpStatuses.OK_200).send(result);
}
