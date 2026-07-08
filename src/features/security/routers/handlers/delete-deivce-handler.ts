import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { DeviceRepository } from "../../repository/device-repository";
import { HttpStatuses } from "../../../../core/types/http-statuses";

@injectable()
export class DeleteDeivceHandler {
  constructor(
    @inject(DeviceRepository) private deviceRepository: DeviceRepository,
  ) {}

  deleteDeivceHandler = async (req: Request, res: Response): Promise<void> => {
    const device = await this.deviceRepository.findDeviceById(
      req.params.deviceId,
    );

    if (!device) {
      res.sendStatus(HttpStatuses.NOT_FOUND_404);
      return;
    }

    if (device.userId !== req.user!.id) {
      res.sendStatus(HttpStatuses.FORBIDDEN_403);
      return;
    }

    await this.deviceRepository.deleteDevice(req.params.deviceId);

    res.sendStatus(HttpStatuses.NO_CONTENT_204);
  };
}
