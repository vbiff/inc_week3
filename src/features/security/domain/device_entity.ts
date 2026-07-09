import { HydratedDocument, Model, model, Schema } from "mongoose";
import { DeviceDTO } from "../application/dto/device-dto";

export class DeviceEntity {
  private constructor(
    public userId: string,
    public deviceId: string,
    public title: string,
    public ip: string,
    public iat: number,
    public exp: number,
  ) {}

  static createDevice(dto: DeviceDTO): DeviceEntity {
    return new DeviceEntity(
      dto.userId,
      dto.deviceId,
      dto.title,
      dto.ip,
      dto.iat,
      dto.exp,
    );
  }

  updateSession(iat: number, exp: number): void {
    this.iat = iat;
    this.exp = exp;
  }
}

export const DeviceSchema = new Schema<DeviceEntity>({
  userId: { type: String, required: true },
  deviceId: { type: String, required: true },
  title: { type: String, required: true },
  ip: { type: String, required: true },
  iat: { type: Number, required: true },
  exp: { type: Number, required: true },
});

DeviceSchema.loadClass(DeviceEntity);

export type DeviceDocument = HydratedDocument<DeviceEntity>;

export const DeviceModel: Model<DeviceEntity> = model<DeviceEntity>(
  "Device",
  DeviceSchema,
);
