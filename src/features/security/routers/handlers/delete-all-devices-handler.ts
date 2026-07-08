import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { DeviceRepository } from "../../repository/device-repository";
import { HttpStatuses } from "../../../../core/types/http-statuses";

@injectable()
export class DeleteAllDevicesHandler {
  constructor(
    @inject(DeviceRepository) private deviceRepository: DeviceRepository,
  ) {}

  deleteAllDevicesHandler = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    await this.deviceRepository.deleteAllDevicesExceptCurrent(
      req.user!.id,
      req.user!.deviceId,
    );

    res.sendStatus(HttpStatuses.NO_CONTENT_204);
  };
}
