import { DeviceDTO } from "../application/dto/device-dto";
import { devicesCollection } from "../../../db/mongo.db";

export const deviceRepository = {
  async findDeviceByIdAndIat(
    deviceId: string,
    iat: number,
  ): Promise<DeviceDTO | null> {
    return devicesCollection.findOne({ deviceId: deviceId, iat: iat });
  },

  async findDeviceById(deviceId: string): Promise<DeviceDTO | null> {
    return devicesCollection.findOne({ deviceId: deviceId });
  },

  async createDevice(dto: DeviceDTO): Promise<void> {
    await devicesCollection.insertOne(dto);
  },

  async updateDevice(deviceId: string, iat: number, exp: number) {
    await devicesCollection.updateOne(
      { deviceId: deviceId },
      { $set: { iat: iat, exp: exp } },
    );
  },

  async deleteDevice(deviceId: string) {
    await devicesCollection.deleteOne({ deviceId: deviceId });
  },

  async findAllDevicesByUserId(userId: string): Promise<DeviceDTO[]> {
    return await devicesCollection.find({ userId }).toArray();
  },

  async deleteAllDevicesExceptCurrent(
    userId: string,
    currentDeviceId: string,
  ): Promise<void> {
    await devicesCollection.deleteMany({
      userId,
      deviceId: { $ne: currentDeviceId },
    });
  },
};
