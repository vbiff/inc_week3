import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { DeviceRepository } from "../../repository/device-repository";
import { HttpStatuses } from "../../../../core/types/http-statuses";
import { deviceViewMapper } from "../../mappers/device-view-mapper";

@injectable()
export class GetAllActiveDevicesHandler {
  constructor(
    @inject(DeviceRepository) private deviceRepository: DeviceRepository,
  ) {}

  getAllActiveDevicesHandler = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const allActiveDevices = await this.deviceRepository.findAllDevicesByUserId(
      req.user!.id,
    );

    if (!allActiveDevices) {
      res.sendStatus(HttpStatuses.NOT_FOUND_404);
      return;
    }

    const result = allActiveDevices.map((d) => deviceViewMapper(d));

    res.status(HttpStatuses.OK_200).send(result);
  };
}
