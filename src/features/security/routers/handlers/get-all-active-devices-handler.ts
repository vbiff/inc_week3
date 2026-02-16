import { Request, Response } from "express";
import { deviceRepository } from "../../repository/device-repository";
import { HttpStatuses } from "../../../../core/types/http-statuses";

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

  res.status(HttpStatuses.OK_200).send(allActiveDevices);
}
