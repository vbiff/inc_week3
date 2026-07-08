import { DeviceDTO } from "../application/dto/device-dto";
import { DeviceEntity, DeviceModel, DeviceDocument } from "../domain/device_entity";
import { injectable } from "inversify";

@injectable()
export class DeviceRepository {
  async findDeviceByIdAndIat(
    deviceId: string,
    iat: number,
  ): Promise<DeviceDocument | null> {
    return DeviceModel.findOne({ deviceId, iat });
  }

  async findDeviceById(deviceId: string): Promise<DeviceDocument | null> {
    return DeviceModel.findOne({ deviceId });
  }

  async createDevice(dto: DeviceDTO): Promise<void> {
    const device = new DeviceEntity(dto);
    await DeviceModel.create(device);
  }

  async updateDevice(deviceId: string, iat: number, exp: number): Promise<void> {
    const device = await DeviceModel.findOne({ deviceId });
    if (!device) return;
    device.updateSession(iat, exp);
    await device.save();
  }

  async deleteDevice(deviceId: string): Promise<void> {
    await DeviceModel.deleteOne({ deviceId });
  }

  async findAllDevicesByUserId(userId: string): Promise<DeviceDocument[]> {
    return await DeviceModel.find({ userId });
  }

  async deleteAllDevicesExceptCurrent(
    userId: string,
    currentDeviceId: string,
  ): Promise<void> {
    await DeviceModel.deleteMany({
      userId,
      deviceId: { $ne: currentDeviceId },
    });
  }
}
